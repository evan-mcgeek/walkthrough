import { expect, test } from './walkthrough';

test('Ask reaches the listening session and its answer shows at the step', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const chip = page.getByRole('status', { name: 'Session' });
  await expect(chip).toHaveText('Quiet');

  const listener = repo.background('listen');
  await expect(chip).toHaveText('Listening');

  const step = page.getByRole('region', { name: 'The whole change' });
  await step.getByRole('textbox', { name: 'Ask about this step' }).fill('Why is app 2 now?');
  await step.getByRole('button', { name: 'Ask' }).click();

  const { stdout } = await listener.ended;
  const asked = JSON.parse(stdout) as { id: string; kind: string; text: string };
  expect(asked).toMatchObject({ kind: 'ask', text: 'Why is app 2 now?' });
  await expect(chip).toHaveText('Working');
  await expect(step.getByText('Why is app 2 now?')).toBeVisible();
  await expect(step.getByText('Waiting for the session to answer.')).toBeVisible();

  repo.run('say', '--answer', asked.id, 'Login needs the second app.');
  repo.background('listen');

  await expect(step.getByText('Login needs the second app.')).toBeVisible();
  await expect(step.getByText('Waiting for the session to answer.')).toHaveCount(0);
  await expect(chip).toHaveText('Listening');
  await expect(step.getByRole('button', { name: 'Approve' })).toBeVisible();
});

test('a question from the session needs the person until they reply', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.run('say', '--question', 'Is the login meant to accept everyone?');
  const listener = repo.background('listen');
  const chip = page.getByRole('status', { name: 'Session' });
  await expect(chip).toHaveText('Needs you');

  await page.getByRole('textbox', { name: 'Reply' }).fill('No, only staff.');
  await page.getByRole('button', { name: 'Reply' }).click();

  expect(JSON.parse((await listener.ended).stdout)).toMatchObject({ kind: 'reply', text: 'No, only staff.' });
  await expect(chip).toHaveText('Working');
  await expect(page.getByText('No, only staff.')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Reply' })).toHaveCount(0);
});

test('a draft question survives the page redrawing', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const box = page.getByRole('textbox', { name: 'Ask about this step' });
  await box.fill('Half a thou');

  repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  await expect(box).toHaveValue('Half a thou');
  await expect(box).toBeFocused();
});
