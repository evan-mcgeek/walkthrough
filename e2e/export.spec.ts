import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from './walkthrough';

// A GIF header that says 1280 × 800, with the NUL that makes git call it binary.
test.use({ files: { 'gen.txt': 'made\n', 'docs/shot.gif': 'GIF89a\u0000\u0005\u0020\u0003\u0000\u0000;' } });

const steps = [
  { title: 'Login check', explanation: 'Adds a **login** function.', files: ['login.ts'], assumptions: ['Callers check the result.'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: [{ path: 'app.ts', explanation: 'The **version** the app reports.' }] },
  {
    title: 'Generated',
    folded: true,
    files: [
      { path: 'gen.txt', reason: 'Made by a tool.' },
      { path: 'docs/shot.gif', reason: 'A screenshot.' },
    ],
    problems: ['Out of date.'],
  },
];

test('the export shows the whole walkthrough as one read-only document, offline, from its one file', async ({ page, context, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(steps);
  repo.record({ title: 'Criteria', items: [{ status: 'met', text: 'A person can log in.', steps: ['1', '2'] }] }, 'checklist');
  repo.record([{ step: '1', file: 'login.ts', lines: [1, 1], label: 'Risk', text: 'Everyone gets in.' }], 'note');
  const step = page.getByRole('region', { name: 'Login check' });
  const note = step.getByRole('article', { name: 'Risk' });
  await note.getByRole('button', { name: 'Reply' }).click();
  await note.getByRole('textbox', { name: 'Reply' }).fill('Is that on purpose?');
  await note.getByRole('button', { name: 'Send' }).click();
  await expect(note.getByText('Is that on purpose?')).toBeVisible();
  await step.getByRole('button', { name: 'Flag' }).click();
  await page.getByRole('textbox', { name: 'Note' }).fill('Check the password.');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  // The page shows a step read before the server has stored it, and the export reads what is stored.
  const stored = new URL('data/walkthrough.json', url).href;
  const read = async () => ((await (await page.request.get(stored)).json()) as { read: string[] }).read;
  await expect.poll(read).toEqual(['1', '2']);
  repo.record([{ item: { type: 'verdict' }, actions: [{ id: 'fixes', label: 'Needs fixes' }] }], 'actions');
  await page.getByRole('banner').getByRole('link', { name: 'Finish review' }).click();
  await page.getByRole('radio', { name: 'Needs fixes' }).click();
  await expect(page.getByRole('banner').getByTitle('Your verdict')).toHaveText('Needs fixes');
  const out = path.join(path.dirname(repo.dir), 'login.html');
  expect(repo.run('export', '--out', out).status).toBe(0);
  await page.close();

  await context.setOffline(true);
  const exported = await context.newPage();
  const problems: string[] = [];
  exported.on('pageerror', error => problems.push(error.message));
  exported.on('console', message => problems.push(message.text()));
  exported.on('request', request => {
    if (!request.url().startsWith('file:')) problems.push(request.url());
  });
  await exported.goto(pathToFileURL(out).href);

  await expect(exported.getByRole('heading', { level: 1 })).toHaveText('feature/login');
  await expect(exported.locator('.export-head .logo')).toHaveText('Walkthrough');
  expect(await exported.locator('link[rel="icon"]').getAttribute('href')).toMatch(/^data:image\/svg\+xml;base64,/);
  await expect(exported.getByText(/^Walkthrough export · .+ · 3 steps, 1 decided$/)).toBeVisible();
  await expect(exported.locator('.export-head').getByTitle('Your verdict')).toHaveText('Needs fixes');
  expect((await exported.getByRole('main').boundingBox())?.width).toBe(900);
  const shown = exported.getByRole('region', { name: 'Login check' });
  await expect(shown.getByRole('heading', { level: 2 })).toHaveText('1Login checkDecided: Flag');
  await expect(shown.getByRole('strong')).toHaveText('login');
  await expect(shown.getByText('Check the password.')).toBeVisible();
  await expect(shown.getByText('Callers check the result.')).toBeVisible();
  await expect(shown.locator('.d2h-ins')).toContainText(['export const login = () => true;']);
  const shownNote = shown.getByRole('article', { name: 'Risk' });
  await expect(shownNote.getByText('Everyone gets in.')).toBeVisible();
  await expect(shownNote.getByText('Is that on purpose?')).toBeVisible();
  const other = exported.getByRole('region', { name: 'App version' });
  await expect(other.getByText('Undecided', { exact: true })).toBeVisible();
  await expect(other.locator('.d2h-del')).toContainText(['export const app = 1;']);
  await expect(other.locator('.d2h-file-wrapper[data-file="app.ts"] .file-explanation')).toHaveText('The version the app reports.');
  const folded = exported.getByRole('region', { name: 'Generated' });
  await expect(folded.getByRole('list', { name: 'Folded files' })).toContainText('gen.txt');
  await expect(folded.getByText('Made by a tool.')).toBeVisible();
  await expect(folded.getByText('Out of date.')).toBeVisible();
  await expect(folded.getByText('Binary image · 1280 × 800 · added', { exact: true })).toBeVisible();
  await expect(folded.locator('.fold-path')).toHaveText(['gen.txt', 'docs/shot.gif']);
  await expect(folded.locator('.fold-path wbr')).toHaveCount(1);
  await expect(exported.getByRole('region', { name: 'Criteria' }).getByText('A person can log in.')).toBeVisible();
  await expect(exported.getByRole('button')).toHaveCount(0);
  await expect(exported.getByRole('textbox')).toHaveCount(0);
  await expect(exported.getByRole('status', { name: 'Session' })).toHaveCount(0);
  await expect(exported.getByRole('navigation')).toHaveCount(0);
  // The self-hosted code font comes from the file itself, since nothing was fetched.
  expect(await exported.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some(font => font.family.includes('JetBrains Mono') && font.status === 'loaded');
  })).toBe(true);

  await exported.getByRole('region', { name: 'Criteria' }).getByRole('link', { name: 'Step 2' }).click();

  await expect(exported).toHaveURL(/#2$/);
  await expect(other.getByRole('heading', { level: 2 })).toBeInViewport();
  expect(problems).toEqual([]);
});

test("with the explanation column on, the export lists each step's explained files under its overview", async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(steps);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  const stored = new URL('data/viewer.json', url).href;
  await page.keyboard.press('3');
  await expect.poll(async () => ((await (await page.request.get(stored)).json()) as { panels: { explanation: boolean } }).panels.explanation).toBe(true);
  const out = path.join(path.dirname(repo.dir), 'login.html');
  expect(repo.run('export', '--out', out).status).toBe(0);

  await page.goto(pathToFileURL(out).href);
  const other = page.getByRole('region', { name: 'App version' });
  const files = other.getByRole('list', { name: 'Files' });
  await expect(files.getByRole('link')).toHaveText(['app.ts']);
  await expect(files.locator('.file-explanation')).toHaveText('The version the app reports.');
  await expect(other.locator('.d2h-file-wrapper .file-explanation')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Login check' }).getByRole('list', { name: 'Files' })).toHaveCount(0);
});
