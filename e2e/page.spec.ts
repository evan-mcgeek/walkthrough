import { expect, test } from './walkthrough';

test('shows the change as one step with its plain-text diff', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('feature/login');
  await expect(page.getByText(`${repo.base.slice(0, 7)}..${repo.head.slice(0, 7)}`)).toBeVisible();
  const step = page.getByRole('region', { name: 'The whole change' });
  await expect(step.getByText('+export const login = () => true;')).toBeVisible();
  await expect(step.getByText('-export const app = 1;')).toBeVisible();
});

test('an approved step stays approved when the page is opened again', async ({ page, context, url }) => {
  const step = page.getByRole('region', { name: 'The whole change' });
  await step.getByRole('button', { name: 'Approve' }).click();
  await expect(step.getByText('Approved', { exact: true })).toBeVisible();

  await page.close();
  const reopened = await context.newPage();
  await reopened.goto(url);

  const again = reopened.getByRole('region', { name: 'The whole change' });
  await expect(again.getByText('Approved', { exact: true })).toBeVisible();
  await expect(again.getByRole('button', { name: 'Approve' })).toHaveCount(0);
});

test('the Stop button ends the server', async ({ page, request, url }) => {
  await page.getByRole('button', { name: 'Stop' }).click();

  await expect(page.getByText('The walkthrough has stopped. You can close this tab.')).toBeVisible();
  await expect(request.get(url)).rejects.toThrow();
});

// Started here rather than through `url`, whose check for console errors would catch the refused connection.
test('an action after the server stopped says how to reopen the walkthrough', async ({ page, repo }) => {
  repo.run('start');
  await page.goto(repo.url());
  repo.run('stop');

  await page.getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByRole('alert')).toHaveText(
    'Could not reach the walkthrough. Run /walkthrough again to reopen it.',
  );
});

test('a request without the token is refused', async ({ request, url }) => {
  const { origin } = new URL(url);

  expect((await request.post(`${origin}/decide`, { data: { step: 'change', decision: 'approved' } })).status()).toBe(
    404,
  );
  expect((await request.get(`${origin}/s/${'0'.repeat(48)}/`)).status()).toBe(404);
});
