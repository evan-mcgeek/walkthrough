import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a **login** function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

test('the export shows the walkthrough read-only, offline, from its one file', async ({ page, context, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(steps);
  repo.record({ title: 'Criteria', items: [{ status: 'met', text: 'A person can log in.', steps: ['1'] }] }, 'checklist');
  repo.record([{ step: '1', file: 'login.ts', lines: [1, 1], label: 'Risk', text: 'Everyone gets in.' }], 'note');
  const step = page.getByRole('region', { name: 'Login check' });
  const note = step.getByRole('article', { name: 'Risk' });
  await note.getByRole('button', { name: 'Reply' }).click();
  await note.getByRole('textbox', { name: 'Reply' }).fill('Is that on purpose?');
  await note.getByRole('button', { name: 'Send' }).click();
  await expect(note.getByText('Is that on purpose?')).toBeVisible();
  await step.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
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
  await exported.goto(`${pathToFileURL(out).href}#1`);

  await expect(exported.getByRole('heading', { level: 1 })).toHaveText('feature/login');
  await expect(exported.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', '1 of 2 steps decided, 1 left, 2 read');
  const shown = exported.getByRole('region', { name: 'Login check' });
  await expect(shown.getByRole('strong')).toHaveText('login');
  await expect(shown.locator('.d2h-ins')).toContainText(['export const login = () => true;']);
  await expect(shown.getByText('Decided: Approve', { exact: true })).toBeVisible();
  const shownNote = shown.getByRole('article', { name: 'Risk' });
  await expect(shownNote.getByText('Everyone gets in.')).toBeVisible();
  await expect(shownNote.getByText('Is that on purpose?')).toBeVisible();
  await expect(exported.getByRole('button')).toHaveText(['1 decided']);
  await expect(exported.getByRole('textbox')).toHaveCount(0);
  await expect(exported.getByRole('status', { name: 'Session' })).toHaveCount(0);

  await exported.getByRole('navigation', { name: "What's left" }).getByRole('link', { name: 'App version' }).click();

  await expect(exported.getByRole('region', { name: 'App version' }).locator('.d2h-del')).toContainText([
    'export const app = 1;',
  ]);
  await exported.keyboard.press('j');
  await expect(exported.getByRole('region', { name: 'Criteria' }).getByText('A person can log in.')).toBeVisible();
  expect(problems).toEqual([]);
});
