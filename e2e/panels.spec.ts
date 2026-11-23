import type { Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const checklist = {
  title: 'Acceptance criteria',
  items: [
    { status: 'met', mark: 'met', text: 'A person can log in.', steps: ['1'] },
    { status: 'not yet', mark: 'not-met', text: 'The app shows its version.', steps: ['2'] },
  ],
};

const record = (repo: Repo, input: unknown, command = 'steps') => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
};

const queue = (page: Page) => page.getByRole('navigation', { name: "What's left" });
const edge = (page: Page, side: 'left' | 'right') => page.locator(`.edge-stripe.${side}`);
const bottom = (page: Page) => page.getByRole('toolbar', { name: 'Tool panel (hidden)' });
const checklistPanel = (page: Page) => page.getByRole('complementary', { name: 'Checklist' });
const toolPanel = (page: Page) => page.getByRole('region', { name: 'Tool panel' });
const step = (page: Page, name: string) => page.getByRole('region', { name });

/** The checklist shows in the rail first, so the page has drawn it before a panel is opened. */
async function withChecklist(page: Page, repo: Repo) {
  record(repo, checklist, 'checklist');
  await expect(queue(page).getByRole('link', { name: 'The app shows its version.' })).toBeVisible();
}

async function showAll(page: Page) {
  for (const key of ['2', '3', '4']) await page.keyboard.press(key);
  await expect(checklistPanel(page)).toBeVisible();
  await expect(toolPanel(page)).toBeVisible();
}

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, steps);
  await expect(step(page, 'Login check')).toBeVisible();
});

test('by default the queue is open and every other panel waits on its edge', async ({ page, repo }) => {
  await withChecklist(page, repo);
  repo.run('say', 'The lockfile is in no step.');
  const hide = queue(page).getByRole('button', { name: 'Hide To review' });
  await expect(queue(page).getByRole('heading', { name: 'To review 4' })).toBeVisible();
  await expect(hide).toHaveAttribute('title', 'Hide To review (1)');

  await expect(edge(page, 'left').getByRole('button')).toHaveText(['Explanation']);
  await expect(edge(page, 'left').getByRole('button', { name: 'Explanation' })).toHaveAttribute('title', 'Show Explanation (3)');
  await expect(edge(page, 'right').getByRole('button')).toHaveText(['Checklist1/2']);
  await expect(edge(page, 'right').getByRole('button')).toHaveAttribute('title', 'Show Checklist (2)');
  await expect(bottom(page).getByRole('button')).toHaveText(['Notes0', 'From the session1']);
  await expect(checklistPanel(page)).toBeHidden();
  await expect(toolPanel(page)).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Steps' })).toBeHidden();
});

test('each panel hides from its title bar and comes back from its edge or its key, and stays so after a restart', async ({ page, repo }) => {
  await withChecklist(page, repo);

  await queue(page).getByRole('button', { name: 'Hide To review' }).click();

  await expect(queue(page)).toBeHidden();
  await expect(edge(page, 'left').getByRole('button')).toHaveText(['To review3', 'Explanation']);
  const walk = page.getByRole('navigation', { name: 'Steps' });
  await expect(walk).toContainText('Step 1');
  await expect(walk.getByRole('button', { name: 'Previous step' })).toBeDisabled();
  await walk.getByRole('button', { name: 'Next step' }).click();
  await expect(step(page, 'App version')).toBeVisible();
  await expect(walk).toContainText('Step 2');

  await page.keyboard.press('1');
  await expect(queue(page)).toBeVisible();
  await expect(walk).toBeHidden();

  await edge(page, 'right').getByRole('button', { name: /^Checklist/ }).click();
  const side = checklistPanel(page);
  await expect(side.getByRole('region', { name: 'Acceptance criteria' }).getByRole('listitem')).toHaveCount(2);
  await expect(side.getByRole('button', { name: 'Hide Checklist' })).toHaveAttribute('title', 'Hide Checklist (2)');
  await expect(edge(page, 'right')).toBeHidden();

  await page.keyboard.press('3');
  const prose = step(page, 'App version').locator('.prose');
  await expect(prose.getByRole('button', { name: 'Hide Explanation' })).toHaveAttribute('title', 'Hide Explanation (3)');
  await expect(prose.getByText('Bumps the app constant.')).toBeVisible();
  await expect(step(page, 'App version').locator('.code .d2h-file-wrapper')).toHaveCount(1);

  await bottom(page).getByRole('button', { name: /^Notes/ }).click();
  await expect(toolPanel(page).getByRole('tab', { name: /^Notes/ })).toHaveAttribute('aria-selected', 'true');
  await expect(toolPanel(page).getByRole('button', { name: 'Hide tool panel' })).toHaveAttribute('title', 'Hide tool panel (4)');
  await expect(bottom(page)).toBeHidden();

  // A new server listens on a new port, whose browser storage starts empty.
  await page.goto('about:blank');
  repo.run('stop');
  repo.run('start');
  await page.goto(`${repo.url()}#2`);
  await expect(step(page, 'App version')).toBeVisible();
  await expect(checklistPanel(page)).toBeVisible();
  await expect(toolPanel(page)).toBeVisible();
  await expect(step(page, 'App version').locator('.prose .step-title')).toBeVisible();

  for (const key of ['2', '3', '4']) await page.keyboard.press(key);
  await expect(checklistPanel(page)).toBeHidden();
  await expect(toolPanel(page)).toBeHidden();
  await expect(step(page, 'App version').locator('.prose')).toHaveCount(0);
});

for (const [name, setUp] of [
  ['the default panels', async () => {}],
  ['every panel shown', showAll],
  [
    'every panel hidden',
    async (page: Page) => {
      await page.keyboard.press('1');
      await expect(queue(page)).toBeHidden();
    },
  ],
] as const)
  test(`with ${name} a step is approved, flagged with a note, asked about and its lines picked`, async ({ page, repo }) => {
    await withChecklist(page, repo);
    await setUp(page);
    const heard = async (listener: ReturnType<Repo['background']>) => JSON.parse((await listener.ended).stdout) as unknown;
    const deciding = repo.background('listen');
    await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

    await step(page, 'Login check').getByRole('button', { name: 'Approve' }).click();

    expect(await heard(deciding)).toMatchObject({ kind: 'decision', item: { type: 'step', id: '1' }, action: 'approve' });
    const second = step(page, 'App version');
    await expect(second).toBeVisible();
    await expect(page.getByRole('banner').getByText('1/2', { exact: true })).toBeVisible();
    const asking = repo.background('listen');
    await second.getByRole('textbox', { name: 'Ask about this step' }).fill('Why bump it?');
    await second.getByRole('textbox', { name: 'Ask about this step' }).press('Enter');
    expect(await heard(asking)).toMatchObject({ kind: 'ask', step: '2', text: 'Why bump it?' });
    await expect(second.getByText('Waiting for the session to answer.')).toBeVisible();

    await second.locator('tr[data-line="1"] .line-num2').click();
    await second.getByRole('button', { name: 'Ask about lines' }).click();
    await expect(second.getByRole('textbox', { name: 'Ask about app.ts line 1' })).toBeFocused();
    await page.keyboard.press('Escape');

    await second.getByRole('button', { name: 'Flag' }).click();
    await second.getByRole('textbox', { name: 'Note' }).fill('Too early.');
    await second.getByRole('button', { name: 'Send' }).click();

    await expect(page.getByRole('region', { name: 'All 2 steps decided' })).toBeVisible();
    // The end of the walkthrough keeps the checklist within reach, whichever panels are shown.
    await expect(page.getByRole('main').getByRole('region', { name: 'Acceptance criteria' })).toBeVisible();
    await page.keyboard.press('k');
    await expect(second.getByText('Decided: Flag', { exact: true })).toBeVisible();
    await expect(second.getByText('Too early.', { exact: true })).toBeVisible();
  });

test('with every panel shown the Undo toast sits over the main pane, clear of the checklist and the tool panel', async ({ page, repo }) => {
  await withChecklist(page, repo);
  await page.keyboard.press('2');
  await page.keyboard.press('4');
  await expect(toolPanel(page)).toBeVisible();

  await step(page, 'Login check').getByRole('button', { name: 'Approve' }).click();

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

test('the checklist panel lists the items compactly beside the step, and the checklist page shows it once', async ({ page, repo }) => {
  await withChecklist(page, repo);
  await page.keyboard.press('2');
  const list = checklistPanel(page).getByRole('region', { name: 'Acceptance criteria' });
  await expect(list.getByText('1/2', { exact: true })).toBeVisible();
  // Beside a step the list is compact: the statuses wait in the checklist's own page, which its title opens.
  await expect(list.getByText('not yet', { exact: true })).toHaveCount(0);

  await list.getByRole('link', { name: 'Step 2' }).click();
  await expect(step(page, 'App version')).toBeVisible();

  await queue(page).getByRole('link', { name: 'The app shows its version.' }).click();
  await expect(page.getByRole('main').getByRole('region', { name: 'Acceptance criteria' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Acceptance criteria' })).toHaveCount(1);
  await expect(page.getByRole('main').getByText('not yet', { exact: true })).toBeVisible();
});

test('the tool panel puts the step notes, the session and what is detached in tabs under the step', async ({ page, repo }) => {
  record(
    repo,
    [
      { step: '1', label: 'Risk', text: 'Everyone gets in.' },
      { step: '1', label: 'Nit', text: 'A *name*.', file: 'login.ts', lines: [1, 1], low: true },
    ],
    'note',
  );
  repo.run('say', 'The lockfile is in no step.');
  await expect(bottom(page).getByRole('button')).toHaveText(['Notes2', 'From the session1']);

  await bottom(page).getByRole('button', { name: /^From the session/ }).click();

  const panel = toolPanel(page);
  await expect(panel.getByRole('tab')).toHaveText(['Notes2', 'From the session1']);
  await expect(panel.getByRole('tab', { name: /^From the session/ })).toHaveAttribute('aria-selected', 'true');
  await expect(panel.getByRole('tabpanel')).toContainText('The lockfile is in no step.');
  await panel.getByRole('tab', { name: /^From the session/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(panel.getByRole('tab', { name: /^Notes/ })).toBeFocused();
  await expect(panel.getByRole('tabpanel').getByRole('button')).toHaveText(['RiskEveryone gets in.', 'NitLine 1A name.']);
  const nit = step(page, 'Login check').getByRole('article', { name: 'Nit' });
  await expect(nit).toBeHidden();

  await panel.getByRole('button', { name: /^Nit/ }).click();

  await expect(nit).toBeVisible();
  await expect(nit).toBeFocused();

  // Not again beside the main pane that shows the session.
  await queue(page).getByRole('link', { name: 'From the session' }).click();
  await expect(page.getByText('The lockfile is in no step.')).toHaveCount(1);
  await expect(page.getByRole('tab', { name: /^From the session/ })).toHaveCount(0);
});

test.describe('with a long file', () => {
  test.use({ files: { 'login.ts': Array.from({ length: 120 }, (_, at) => `export const line${String(at)} = ${String(at)};`).join('\n') } });

  const scrollers = [
    { name: 'the main pane', show: [] as string[], pane: (page: Page) => page.getByRole('main') },
    { name: "the explanation column's code", show: ['3'], pane: (page: Page) => step(page, 'Login check').locator('.code') },
  ];

  for (const { name, show, pane } of scrollers)
    test(`${name} keeps where it was scrolled when the page redraws`, async ({ page, repo }) => {
      for (const key of show) await page.keyboard.press(key);
      await expect(pane(page).locator('tr[data-line="120"]')).toBeAttached();
      await pane(page).evaluate(scroller => {
        scroller.scrollTop = 600;
      });

      repo.run('say', 'Still here.');

      await expect(page.getByRole('link', { name: 'From the session' })).toBeVisible();
      expect(await pane(page).evaluate(scroller => scroller.scrollTop)).toBe(600);
    });

  test('the explanation column starts each step at the top of both its panes', async ({ page }) => {
    await page.keyboard.press('3');
    const code = step(page, 'Login check').locator('.code');
    await code.evaluate(scroller => {
      scroller.scrollTop = 600;
    });

    await page.keyboard.press('j');

    await expect(step(page, 'App version')).toBeVisible();
    expect(await step(page, 'App version').locator('.code').evaluate(scroller => scroller.scrollTop)).toBe(0);
    // The step that left was shown in panes of its own, which go once it has left.
    await expect(page.locator('.code')).toHaveCount(1);
    await expect(page.locator('.prose')).toHaveCount(1);
  });
});
