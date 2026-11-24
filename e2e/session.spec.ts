import { ONE_STEP } from '../test/helpers';
import { expect, test } from './walkthrough';

test('Ask reaches the listening session and its answer shows at the step', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const chip = page.getByRole('status', { name: 'Session' });
  await expect(chip).toHaveText('Working');
  repo.record(ONE_STEP);

  const listener = repo.background('listen');
  await expect(chip).toHaveText('Listening');

  const step = page.getByRole('region', { name: 'Login' });
  await step.getByRole('textbox', { name: 'Ask about this step' }).fill('Why is app 2 now?');
  await step.getByRole('textbox', { name: 'Ask about this step' }).press('Enter');

  const { stdout } = await listener.ended;
  const asked = JSON.parse(stdout) as { id: string; kind: string; text: string };
  expect(asked).toMatchObject({ kind: 'ask', text: 'Why is app 2 now?' });
  await expect(chip).toHaveText('Working');
  await expect(step.getByText('Why is app 2 now?')).toBeVisible();
  await expect(step.getByText('Waiting for an answer')).toBeVisible();

  repo.run('say', '--answer', asked.id, 'Login needs the second app.');
  repo.background('listen');

  await expect(step.getByText('Login needs the second app.')).toBeVisible();
  await expect(step.getByText('Waiting for an answer')).toHaveCount(0);
  await expect(chip).toHaveText('Listening');
  await expect(step.getByRole('button', { name: 'Approve' })).toBeVisible();
});

test('a question from the session needs the person until they reply', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.run('say', '--question', 'Is the login meant to accept everyone?');
  const listener = repo.background('listen');
  const chip = page.getByRole('status', { name: 'Session' });
  await expect(chip).toHaveText('Needs you');
  const asks = page.locator('.question-box');
  await expect(asks.getByText('Is the login meant to accept everyone?')).toBeVisible();
  const fromSession = page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: 'Session messages' });
  await expect(fromSession).toHaveText('Session messages1 message');

  await asks.getByRole('textbox', { name: 'Reply' }).fill('No, only staff.');
  await asks.getByRole('textbox', { name: 'Reply' }).press('Enter');

  expect(JSON.parse((await listener.ended).stdout)).toMatchObject({ kind: 'reply', text: 'No, only staff.' });
  await expect(chip).toHaveText('Working');
  await expect(asks).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Reply' })).toHaveCount(0);
  await fromSession.click();
  const thread = page.locator('.messages-section.from-session');
  await expect(thread.getByText('Is the login meant to accept everyone?')).toBeVisible();
  await expect(thread.getByText('No, only staff.')).toBeVisible();
});

test('a draft question survives the page redrawing', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(ONE_STEP);
  const box = page.getByRole('textbox', { name: 'Ask about this step' });
  await box.fill('Half a thou');

  repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  await expect(box).toHaveValue('Half a thou');
  await expect(box).toBeFocused();
});

test('a question offers its answers as buttons, and the choice reaches the listener', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.run('say', '--question', '--choice', 'Staff only', '--choice', 'Everyone', 'Who may log in?');
  const listener = repo.background('listen');
  const asks = page.locator('.question-box');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Needs you');
  await expect(asks.getByRole('button')).toHaveText(['Staff only', 'Everyone']);
  await expect(asks.getByRole('textbox', { name: 'Reply' })).toHaveAttribute('placeholder', 'Or reply…');

  await asks.getByRole('button', { name: 'Everyone' }).click();

  const replied = JSON.parse((await listener.ended).stdout) as { id: string; kind: string; text: string };
  expect(replied).toMatchObject({ kind: 'reply', text: 'Everyone' });
  await expect(asks).toHaveCount(0);
  await page.getByRole('link', { name: 'Session messages' }).click();
  const question = page.locator('.messages-section.from-session');
  await expect(question.getByText('Everyone', { exact: true })).toBeVisible();

  repo.run('say', '--answer', replied.id, 'Login now accepts everyone.');
  await expect(question.getByText('Login now accepts everyone.')).toBeVisible();
});

test('the session is gone once its listener stops and has not come back', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const chip = page.getByRole('status', { name: 'Session' });
  const listener = repo.background('listen');
  await expect(chip).toHaveText('Listening');

  await expect(page.getByText('Session gone.', { exact: true })).toHaveCount(0);

  listener.child.kill('SIGTERM');

  await expect(chip).toHaveText('Session gone');
  await expect(page.getByText('Session gone. Your decisions are kept; start the session again to continue.')).toBeVisible();
});

test('a question over 4000 characters is refused with the reason and stays in its box', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(ONE_STEP);
  const step = page.getByRole('region', { name: 'Login' });
  const box = step.getByRole('textbox', { name: 'Ask about this step' });
  await box.fill('a'.repeat(4001));

  await box.press('Enter');

  await expect(page.getByRole('alert')).toHaveText('That text is 4001 characters long; the most it can be is 4000.');
  await expect(box).toHaveValue('a'.repeat(4001));
  await expect(step.getByText('Waiting for an answer')).toHaveCount(0);
});

test('a redraw keeps keyboard focus on a choice and on the Send of a Flag note', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(ONE_STEP);
  repo.run('say', '--question', '--choice', 'Staff only', '--choice', 'Everyone', 'Who may log in?');
  const fromSession = page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: 'Session messages' });
  const choice = page.locator('.question-box').getByRole('button', { name: 'Everyone' });
  await choice.focus();

  repo.run('say', 'Still here.');

  await expect(fromSession).toHaveText('Session messages2 messages');
  await expect(choice).toBeFocused();

  const step = page.getByRole('region', { name: 'Login' });
  await step.getByRole('button', { name: 'Flag' }).click();
  const send = step.getByRole('button', { name: 'Send' });
  await send.focus();

  repo.run('say', 'And here.');

  await expect(fromSession).toHaveText('Session messages3 messages');
  await expect(send).toBeFocused();
});

test('a redraw waits while the person composes with an input method, and comes after', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(ONE_STEP);
  const box = page.getByRole('textbox', { name: 'Ask about this step' });
  await box.fill('ろぐいん');
  await box.evaluate(input => {
    Object.assign(input, { composed: true });
    input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }));
  });

  const polled = page.waitForResponse(async answer => answer.url().includes('data/session.json') && (await answer.text()).includes('"listening"'));
  repo.background('listen');
  await polled;
  await page.waitForResponse(answer => answer.url().includes('data/session.json'));

  await expect(page.getByRole('status', { name: 'Session' })).not.toHaveText('Listening');
  expect(await box.evaluate(input => 'composed' in input)).toBe(true);

  await box.evaluate(input => input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: 'ろぐいん' })));

  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');
  await expect(box).toHaveValue('ろぐいん');
  await expect(box).toBeFocused();
});

test('the session status stays in the page and changes in place, so a screen reader announces each new state', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const status = page.getByRole('status', { name: 'Session' });
  await expect(status).toHaveText('Working');
  await status.evaluate(region => Object.assign(region, { kept: true }));

  repo.background('listen');
  await expect(status).toHaveText('Listening');
  repo.record(ONE_STEP);
  await expect(page.getByRole('region', { name: 'Login' })).toBeVisible();

  expect(await status.evaluate(region => 'kept' in region)).toBe(true);
});
