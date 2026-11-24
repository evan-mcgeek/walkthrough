import type { Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const checklist = {
  title: 'Acceptance criteria',
  description: 'Each criterion from the tickets, and the steps that deliver it.',
  items: [
    { status: 'met', mark: 'met', text: 'A person can log in.', steps: ['1', '2'] },
    { status: 'not yet', mark: 'not-met', text: 'The app shows its version.', steps: ['2'] },
  ],
};

/** A design token as the browser resolves it for colour, in the page's current theme. */
const tokenColor = (page: Page, token: string) =>
  page.evaluate(name => {
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.color = `var(${name})`;
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);

const record = (repo: Repo, input: unknown, command = 'steps') => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
};

const queue = (page: Page) => page.getByRole('navigation', { name: 'To review' });
const edge = (page: Page, side: 'left' | 'right') => page.locator(`.edge-stripe.${side}`);
const checklistPanel = (page: Page) => page.getByRole('complementary', { name: 'Checklist' });
const step = (page: Page, name: string) => page.getByRole('region', { name });

/** The page has drawn the checklist, on its edge or in its panel, before a panel is opened. */
async function withChecklist(page: Page, repo: Repo) {
  record(repo, checklist, 'checklist');
  await expect(page.locator('[data-key="show:checklist"]').or(checklistPanel(page).getByText('The app shows its version.')).first()).toBeVisible();
}

async function showAll(page: Page) {
  for (const key of ['2', '3']) await page.keyboard.press(key);
  await expect(checklistPanel(page)).toBeVisible();
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
  await expect(queue(page).getByRole('heading', { name: 'To review 3' })).toBeVisible();
  await expect(hide).toHaveAttribute('title', 'Hide To review (1)');

  await expect(edge(page, 'left').getByRole('button')).toHaveText(['Explanation']);
  await expect(edge(page, 'left').getByRole('button', { name: 'Explanation' })).toHaveAttribute('title', 'Show Explanation (3)');
  await expect(edge(page, 'right').getByRole('button')).toHaveText(['Checklist1 of 2 met']);
  await expect(edge(page, 'right').getByRole('button')).toHaveAttribute('title', 'Show Checklist (2)');
  await expect(page.getByRole('toolbar')).toHaveCount(2);
  await expect(checklistPanel(page)).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Steps' })).toBeHidden();
});

test('each panel hides from its title bar and comes back from its edge or its key, and stays so after a restart', async ({ page, repo }) => {
  await withChecklist(page, repo);

  await queue(page).getByRole('button', { name: 'Hide To review' }).click();

  await expect(queue(page)).toBeHidden();
  await expect(edge(page, 'left').getByRole('button')).toHaveText(['To review2', 'Explanation']);
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


  // A new server listens on a new port, whose browser storage starts empty.
  await page.goto('about:blank');
  repo.run('stop');
  repo.run('start');
  await page.goto(`${repo.url()}#2`);
  await expect(step(page, 'App version')).toBeVisible();
  await expect(checklistPanel(page)).toBeVisible();
  await expect(step(page, 'App version').locator('.prose .step-title')).toBeVisible();

  for (const key of ['2', '3']) await page.keyboard.press(key);
  await expect(checklistPanel(page)).toBeHidden();
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
    await expect(page.getByRole('banner').getByText('Step 2 of 2 · 1 decided', { exact: true })).toBeVisible();
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

    await expect(page.getByRole('region', { name: 'Summary' })).toBeVisible();
    // The Summary keeps the criteria within reach, whichever panels are shown.
    await expect(page.getByRole('main').getByRole('region', { name: 'Acceptance criteria' })).toBeVisible();
    await page.keyboard.press('k');
    await expect(second.getByText('Decided: Flag', { exact: true })).toBeVisible();
    await expect(second.getByText('Too early.', { exact: true })).toBeVisible();
  });

test('with every panel shown the Undo toast sits over the main pane, clear of the checklist', async ({ page, repo }) => {
  await withChecklist(page, repo);
  await showAll(page);

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

test('the checklist panel says what it counts and what it is for, and each item reads down to its status and steps', async ({ page, repo }) => {
  await withChecklist(page, repo);
  await page.keyboard.press('2');
  const list = checklistPanel(page).getByRole('region', { name: 'Acceptance criteria' });
  await expect(list.locator('.counter')).toHaveText('1 of 2 met');
  await expect(list.getByText('Each criterion from the tickets, and the steps that deliver it.', { exact: true })).toBeVisible();
  const [met, notMet] = [list.getByRole('listitem').nth(0), list.getByRole('listitem').nth(1)];
  await expect(met.locator('.item-line')).toHaveText('met · Steps 1, 2');
  await expect(notMet.locator('.item-line')).toHaveText('not yet · Step 2');
  await expect(met.getByRole('link', { name: 'Step 2' })).toHaveAttribute('title', 'App version');
  // Read in one frame, as the panel is still sliding in.
  const { text, line } = await met.evaluate(item => {
    const box = (selector: string) => item.querySelector(selector)?.getBoundingClientRect() ?? new DOMRect(NaN, NaN);
    return { text: box('.item-text').toJSON() as DOMRect, line: box('.item-line').toJSON() as DOMRect };
  });
  expect(line.y).toBeGreaterThanOrEqual(text.bottom);
  expect(line.x).toBe(text.x);
  await expect(met.locator('.item-status')).toHaveCSS('color', await tokenColor(page, '--ok'));
  await expect(notMet.locator('.item-status')).toHaveCSS('color', await tokenColor(page, '--bad'));

  await notMet.getByRole('link', { name: 'Step 2' }).click();
  await expect(step(page, 'App version')).toBeVisible();

  await page.goto(`${page.url().split('#')[0] ?? ''}#checklist-2`);
  await expect(page.getByRole('main').getByRole('region', { name: 'Acceptance criteria' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Acceptance criteria' })).toHaveCount(1);
  await expect(page.getByRole('main').getByText('not yet', { exact: true })).toBeVisible();
});

test('with no tool panel, notes stay on their lines and what the session said waits on the Session messages page', async ({ page, repo }) => {
  record(
    repo,
    [
      { step: '1', label: 'Risk', text: 'Everyone gets in.' },
      { step: '1', label: 'Nit', text: 'A *name*.', file: 'login.ts', lines: [1, 1] },
    ],
    'note',
  );
  repo.run('say', 'The lockfile is in no step.');
  const messages = queue(page).getByRole('link', { name: 'Session messages' });
  await expect(messages).toHaveText('Session messages1 message');
  const login = step(page, 'Login check');
  await expect(login.getByRole('complementary', { name: 'In this step' })).toContainText('2 notes');
  await expect(login.getByRole('article', { name: 'Nit' })).toBeVisible();
  await expect(page.getByText('The lockfile is in no step.')).toHaveCount(0);

  await page.keyboard.press('4');
  await expect(page.getByRole('region', { name: 'Tool panel' })).toHaveCount(0);
  await expect(page.getByRole('tab')).toHaveCount(0);

  await messages.click();
  await expect(page.getByRole('heading', { name: 'Session messages', level: 2 })).toBeVisible();
  await expect(page.getByRole('region', { name: 'From the session' })).toContainText('The lockfile is in no step.');
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

      await expect(page.getByRole('link', { name: 'Session messages' })).toBeVisible();
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
