import type { Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const record = (repo: Repo, input: unknown, command = 'steps') => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
};

const LAYOUTS = ["What's left", 'Three columns', 'Explanation beside code', 'Tool panel'];

const layoutSwitch = (page: Page) => page.getByRole('banner').getByRole('group', { name: 'Layout' });
const choose = (page: Page, layout: string) => layoutSwitch(page).getByRole('button', { name: layout }).click();

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, steps);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

test("the header offers the four layouts, with What's left pressed until another is chosen", async ({ page }) => {
  const buttons = layoutSwitch(page).getByRole('button');
  await expect(buttons).toHaveCount(4);
  for (const [at, layout] of LAYOUTS.entries()) {
    await expect(buttons.nth(at)).toHaveAccessibleName(layout);
    await expect(buttons.nth(at)).toHaveAttribute('title', layout);
    await expect(buttons.nth(at)).toHaveAttribute('aria-pressed', String(at === 0));
  }

  await choose(page, 'Tool panel');

  await expect(layoutSwitch(page).getByRole('button', { name: 'Tool panel' })).toHaveAttribute('aria-pressed', 'true');
  await expect(layoutSwitch(page).getByRole('button', { name: "What's left" })).toHaveAttribute('aria-pressed', 'false');
});

test('the chosen layout survives a reload', async ({ page }) => {
  await choose(page, 'Three columns');
  await page.reload();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(layoutSwitch(page).getByRole('button', { name: 'Three columns' })).toHaveAttribute('aria-pressed', 'true');
});

test("with browser storage blocked the page opens on What's left and still switches, without errors", async ({ page, url }) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', { get: blocked });
  });
  await page.goto(url);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(layoutSwitch(page).getByRole('button', { name: "What's left" })).toHaveAttribute('aria-pressed', 'true');

  await choose(page, 'Explanation beside code');

  await expect(layoutSwitch(page).getByRole('button', { name: 'Explanation beside code' })).toHaveAttribute('aria-pressed', 'true');
});

test('a stored layout the page does not know falls back to the default', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('walkthrough.layout', 'nonsense');
  });
  await page.reload();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(layoutSwitch(page).getByRole('button', { name: "What's left" })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('navigation', { name: "What's left" })).toBeVisible();
});

for (const layout of LAYOUTS)
  test(`in ${layout} a step is approved, flagged with a note, asked about and its lines picked`, async ({ page, repo }) => {
    await choose(page, layout);
    const heard = async (listener: ReturnType<Repo['background']>) => JSON.parse((await listener.ended).stdout) as unknown;
    const deciding = repo.background('listen');
    await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

    await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

    expect(await heard(deciding)).toMatchObject({ kind: 'decision', item: { type: 'step', id: '1' }, action: 'approve' });
    const second = page.getByRole('region', { name: 'App version' });
    await expect(second).toBeVisible();
    await expect(page.getByText('1/2', { exact: true })).toBeVisible();
    const asking = repo.background('listen');
    await second.getByRole('textbox', { name: 'Ask about this step' }).fill('Why bump it?');
    await second.getByRole('textbox', { name: 'Ask about this step' }).press('Enter');
    expect(await heard(asking)).toMatchObject({ kind: 'ask', step: '2', text: 'Why bump it?' });
    await expect(second.getByText('Waiting for the session to answer.')).toBeVisible();

    await second.locator('tr[data-line="1"] .d2h-code-linenumber').click();
    await expect(second.getByRole('textbox', { name: 'Ask about app.ts line 1' })).toBeFocused();
    await page.keyboard.press('Escape');

    await second.getByRole('button', { name: 'Flag' }).click();
    await second.getByRole('textbox', { name: 'Note' }).fill('Too early.');
    await second.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByRole('region', { name: 'All 2 steps decided' })).toBeVisible();
    await page.keyboard.press('k');
    await expect(second.getByText('Decided: Flag', { exact: true })).toBeVisible();
    await expect(second.getByText('Too early.', { exact: true })).toBeVisible();
    await expect(layoutSwitch(page).getByRole('button', { name: layout })).toHaveAttribute('aria-pressed', 'true');
  });

const checklist = {
  title: 'Acceptance criteria',
  items: [
    { status: 'met', mark: 'met', text: 'A person can log in.', steps: ['1'] },
    { status: 'not yet', mark: 'not-met', text: 'The app shows its version.', steps: ['2'] },
  ],
};

/** Records the checklist and waits until the page shows it, so a layout chosen next draws it at once. */
const withChecklist = async (page: Page, repo: Repo) => {
  record(repo, checklist, 'checklist');
  await expect(page.getByRole('navigation', { name: "What's left" }).getByRole('link', { name: 'The app shows its version.' })).toBeVisible();
};

for (const [layout, beside] of [['Three columns', 'the side pane'], ['Tool panel', 'the tool panel']] as const)
  test(`in ${layout} the Undo toast sits over the main pane, clear of ${beside}`, async ({ page, repo }) => {
    await withChecklist(page, repo);
    await choose(page, layout);

    await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

    const toast = page.getByRole('status').filter({ hasText: 'Decided step 1: Approve' });
    await expect(toast).toBeVisible();
    const shown = await toast.boundingBox();
    const pane = await page.getByRole('main').boundingBox();
    if (!shown || !pane) throw new Error('The toast or the main pane has no box.');
    expect(shown.x).toBeGreaterThanOrEqual(pane.x);
    expect(shown.x + shown.width).toBeLessThanOrEqual(pane.x + pane.width);
    expect(shown.y).toBeGreaterThanOrEqual(pane.y);
    expect(shown.y + shown.height).toBeLessThanOrEqual(pane.y + pane.height);
  });

test('Three columns keeps the rail and puts the checklist in a side pane beside the step', async ({ page, repo }) => {
  await withChecklist(page, repo);
  await choose(page, 'Three columns');
  const side = page.getByRole('complementary');
  const list = side.getByRole('region', { name: 'Acceptance criteria' });
  await expect(list.getByRole('listitem')).toHaveCount(2);
  await expect(list.getByText('1/2', { exact: true })).toBeVisible();
  // Beside a step the list is compact: the statuses wait in the checklist's own page, which its title opens.
  await expect(list.getByText('not yet', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: "What's left" })).toBeVisible();

  await list.getByRole('link', { name: 'Step 2' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();

  // Opened as a page of its own, the checklist shows once, in the main pane.
  await page.getByRole('navigation', { name: "What's left" }).getByRole('link', { name: 'The app shows its version.' }).click();
  await expect(page.getByRole('main').getByRole('region', { name: 'Acceptance criteria' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Acceptance criteria' })).toHaveCount(1);
  await expect(page.getByRole('main').getByText('not yet', { exact: true })).toBeVisible();
  await expect(side).toBeHidden();

  await page.getByRole('navigation', { name: "What's left" }).getByRole('link', { name: 'App version' }).click();
  await side.getByRole('link', { name: 'Acceptance criteria' }).click();
  await expect(page.getByRole('main').getByRole('region', { name: 'Acceptance criteria' })).toBeVisible();
});

test('Explanation beside code has no rail: Previous and Next walk the steps, and the prose pane holds the checklist and the session', async ({
  page,
  repo,
}) => {
  await withChecklist(page, repo);
  repo.run('say', 'The lockfile is in no step.');
  await choose(page, 'Explanation beside code');
  await expect(page.getByRole('navigation', { name: "What's left" })).toBeHidden();
  const step = page.getByRole('region', { name: 'Login check' });
  await expect(step.locator('.prose').getByRole('region', { name: 'Acceptance criteria' })).toBeVisible();
  await expect(step.locator('.code .d2h-file-wrapper')).toHaveCount(1);
  const walk = (label: string) => page.getByRole('navigation', { name: 'Steps' }).getByRole('button', { name: label });
  await expect(walk('Previous step')).toBeDisabled();

  await walk('Next step').click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await walk('Next step').click();
  await expect(page.getByRole('region', { name: '0 of 2 steps decided' })).toBeVisible();
  await expect(walk('Next step')).toBeDisabled();
  await walk('Previous step').click();

  await page.getByRole('region', { name: 'App version' }).getByRole('link', { name: 'From the session' }).click();
  await expect(page.getByRole('region', { name: 'From the session' }).getByText('The lockfile is in no step.')).toBeVisible();
  await walk('Next step').click();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

test('Tool panel puts notes, the checklist and the session in tabs under the step', async ({ page, repo }) => {
  await withChecklist(page, repo);
  record(
    repo,
    [
      { step: '1', label: 'Risk', text: 'Everyone gets in.' },
      { step: '1', label: 'Nit', text: 'A *name*.', file: 'login.ts', lines: [1, 1], low: true },
    ],
    'note',
  );
  repo.run('say', 'The lockfile is in no step.');
  await choose(page, 'Tool panel');
  const panel = page.getByRole('region', { name: 'Tool panel' });
  await expect(panel.getByRole('tab')).toHaveText(['Notes2', 'Checklist1/2', 'From the session1']);
  await expect(panel.getByRole('tab', { name: /^Checklist/ })).toHaveAttribute('aria-selected', 'true');
  await expect(panel.getByRole('tabpanel').getByRole('listitem')).toHaveCount(2);

  await panel.getByRole('tab', { name: /^Checklist/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(panel.getByRole('tab', { name: /^From the session/ })).toBeFocused();
  await expect(panel.getByRole('tabpanel')).toContainText('The lockfile is in no step.');
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();

  await page.keyboard.press('ArrowRight');
  await expect(panel.getByRole('tab', { name: /^Notes/ })).toHaveAttribute('aria-selected', 'true');
  await expect(panel.getByRole('tabpanel').getByRole('button')).toHaveText(['RiskEveryone gets in.', 'NitLine 1A name.']);
  const nit = page.getByRole('region', { name: 'Login check' }).getByRole('article', { name: 'Nit' });
  await expect(nit).toBeHidden();

  await panel.getByRole('button', { name: /^Nit/ }).click();

  await expect(nit).toBeVisible();
  await expect(nit).toBeFocused();
});

test('Tool panel leaves out its session tab while the main pane shows the session', async ({ page, repo }) => {
  repo.run('say', 'The lockfile is in no step.');
  await choose(page, 'Tool panel');

  await page.getByRole('link', { name: 'From the session' }).click();

  await expect(page.getByRole('region', { name: 'From the session' })).toBeVisible();
  await expect(page.getByText('The lockfile is in no step.')).toHaveCount(1);
  await expect(page.getByRole('tab', { name: /^From the session/ })).toHaveCount(0);
  await expect(page.locator('#tools')).toBeHidden();
});

test.describe('with a long file', () => {
  test.use({ files: { 'login.ts': Array.from({ length: 120 }, (_, at) => `export const line${String(at)} = ${String(at)};`).join('\n') } });

  const scrollers = [
    { layout: "What's left", pane: (page: Page) => page.getByRole('main') },
    { layout: 'Explanation beside code', pane: (page: Page) => page.getByRole('region', { name: 'Login check' }).locator('.code') },
  ];

  for (const { layout, pane } of scrollers)
    test(`${layout} keeps the step where it was scrolled when the page redraws`, async ({ page, repo }) => {
      await choose(page, layout);
      await expect(pane(page).locator('tr[data-line="120"]')).toBeAttached();
      await pane(page).evaluate(scroller => {
        scroller.scrollTop = 600;
      });

      repo.run('say', 'Still here.');

      await expect(page.getByRole('link', { name: 'From the session' })).toBeVisible();
      expect(await pane(page).evaluate(scroller => scroller.scrollTop)).toBe(600);
    });

  test('Explanation beside code starts each step at the top of both panes', async ({ page }) => {
    await choose(page, 'Explanation beside code');
    const code = page.getByRole('region', { name: 'Login check' }).locator('.code');
    await code.evaluate(scroller => {
      scroller.scrollTop = 600;
    });

    await page.getByRole('navigation', { name: 'Steps' }).getByRole('button', { name: 'Next step' }).click();

    await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
    expect(await page.getByRole('region', { name: 'App version' }).locator('.code').evaluate(scroller => scroller.scrollTop)).toBe(0);
    // The step that left was shown in panes of its own, which go once it has left.
    await expect(page.locator('.code')).toHaveCount(1);
    await expect(page.locator('.prose')).toHaveCount(1);
  });
});
