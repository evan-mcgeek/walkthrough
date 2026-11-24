import type { Locator } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

// Longer than the summary is wide in any font, so the one line is always cut.
const REASONS = [
  'Screenshot of the built page for the README.',
  'Copied in from the design board as it was drawn, and not edited by hand since, so its spacing, colours and type sizes are the board’s own, which the page as built may have moved away from in the weeks since, and which nobody has checked against the running page or the parts it is made of.',
  'Recorded test output.',
];
const shots = Array.from({ length: 18 }, (_, at) => ({ path: `shots/shot-${String(at + 1).padStart(2, '0')}.txt`, reason: REASONS[at % 3] ?? '' }));
const lines = Array.from({ length: 6 }, (_, at) => `Line ${String(at + 1)}.`).join('\n');
test.use({ files: { ...Object.fromEntries(shots.map(shot => [shot.path, `${shot.path}\n`])), 'notes.md': `${lines}\n` } });

const record = (repo: Repo, input: unknown, command: string) => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  return [...recorded.stdout.matchAll(/([0-9a-f]{8})/g)].map(match => match[1] ?? '');
};
/** How far a note's first action starts from its text, both measured in one frame, as a step's pane slides in. */
const offset = (note: Locator) =>
  note.evaluate(article => {
    const left = (selector: string) => article.querySelector(selector)?.getBoundingClientRect().x ?? NaN;
    return article.isConnected ? Math.abs(left('.note-foot .choices button') - left('.note-text')) : NaN;
  });

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(
    repo,
    [
      { title: 'Notes', explanation: 'Adds notes.', files: ['notes.md', 'login.ts', 'app.ts'] },
      { title: 'Screens', folded: true, files: shots, problems: ['shot-07.txt is older than the page it shows.'] },
    ],
    'steps',
  );
  await expect(page.getByRole('region', { name: 'Notes' })).toBeVisible();
});

test('collapsed, a folded step is one line of its distinct reasons, with its problems shown under it', async ({ page, url }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${url}#2`);
  const step = page.getByRole('region', { name: 'Screens' });
  const summary = step.getByRole('button', { name: /^18 files/ });

  await expect(summary.locator('.fold-reasons')).toHaveText(REASONS.join(' · '));
  await expect(summary).toHaveAttribute('title', REASONS.join('\n'));
  await expect(summary.locator('.fold-count')).toHaveText('18 files');
  const count = await summary.locator('.fold-count').boundingBox();
  expect(count?.height).toBeLessThan(24);
  expect((await summary.boundingBox())?.height).toBeLessThan(44);
  const cut = await summary.locator('.fold-reasons').evaluate(box => box.scrollWidth > box.clientWidth && getComputedStyle(box).textOverflow === 'ellipsis');
  expect(cut).toBe(true);
  await expect(step.getByRole('list', { name: 'Problems the session found' })).toHaveText('shot-07.txt is older than the page it shows.');
  await expect(step.getByRole('list', { name: 'Folded files' })).toHaveCount(0);
});

test('in To review a folded step keeps its own icon, and its title reads in ink like every other row, in light and dark', async ({ page }) => {
  const rail = page.getByRole('navigation', { name: 'To review' });
  const row = rail.getByRole('link', { name: /Screens/ });
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    const ink = await page.evaluate(() => {
      const probe = document.body.appendChild(document.createElement('span'));
      probe.style.color = 'var(--ink)';
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    });
    await expect(row.locator('.icon-folded')).toBeVisible();
    await expect(row.locator('.queue-title')).toHaveCSS('color', ink);
    await expect(rail.getByRole('link', { name: /Notes/ }).locator('.queue-title')).toHaveCSS('color', ink);
  }
});

test('opened, each folded file is a row with its reason as text that wraps', async ({ page, url }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${url}#2`);
  const step = page.getByRole('region', { name: 'Screens' });
  await step.getByRole('button', { name: /^18 files/ }).click();
  const files = step.getByRole('list', { name: 'Folded files' });

  await expect(files.getByRole('listitem')).toHaveCount(18);
  const reason = files.getByRole('listitem').nth(1).locator('.fold-reason');
  await expect(reason).toHaveText(REASONS[1] ?? '');
  await expect(reason).toHaveCSS('white-space', 'normal');
  await expect(reason).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  expect((await reason.boundingBox())?.height).toBeGreaterThan(30);
  await expect(step.getByRole('list', { name: 'Problems the session found' })).toBeVisible();
});

test('a note’s action buttons start where its text does, on a step, on lines and on a folded step', async ({ page, repo, url }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  const ids = record(
    repo,
    [
      { step: '1', label: 'Risk', text: 'On the step.' },
      { step: '1', file: 'notes.md', lines: [2, 2], label: 'Nit', text: 'On a line.' },
      { step: '2', label: 'Draft', text: 'On the folded step.' },
    ],
    'note',
  );
  record(repo, ids.map(id => ({ item: { type: 'note', id }, actions: [{ id: 'accept', label: 'Accept' }] })), 'actions');

  for (const [label, address] of [['Risk', '1'], ['Nit', '1'], ['Draft', '2']] as const) {
    await page.goto(`${url}#${address}`);
    const note = page.getByRole('article', { name: label });
    const accept = note.getByRole('button', { name: 'Accept' });
    await expect(accept).toBeVisible();
    expect(await offset(note)).toBeLessThan(2);
  }
});
