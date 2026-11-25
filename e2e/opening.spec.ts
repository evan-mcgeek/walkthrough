import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';
import { ONE_STEP, type Repo } from '../test/helpers';
import { expect, open, test } from './walkthrough';

/** The scene's animations still running, so a still picture has none. */
const sceneMotion = (page: Page) => page.locator('.desk-scene').evaluate(scene => scene.getAnimations({ subtree: true }).length);

const listenerFile = (repo: Repo) =>
  path.join(repo.state, fs.readdirSync(repo.state).find(name => name.startsWith('shop-')) ?? '', 'branch-feature~login', 'listener.json');

test('the Opening shows until ready, then the whole walkthrough appears at once; under reduced motion the scene stands still', async ({ page, repo, url }) => {
  await open(page, url);
  const main = page.locator('#main');

  await expect(main.getByRole('heading', { level: 1, name: 'Preparing the walkthrough' })).toBeVisible();
  await expect(main.getByText('The AI is finishing its review, usually within a minute.')).toBeVisible();
  await expect(main.locator('.changed-files li')).toHaveText([/app\.ts\s*\+1 −1/, /login\.ts\s*\+1 −0/]);
  await expect(page.locator('.files-changed')).toHaveText('2 files changed');
  await expect(page.getByRole('status', { name: 'AI reviewing' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Finish review' })).toBeHidden();
  await expect(page.getByText('Steps appear here when the AI is done.')).toBeVisible();
  await expect(page).toHaveTitle('Reviewing · feature/login · Walkthrough');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-reviewing.svg');
  expect(await sceneMotion(page)).toBeGreaterThan(0);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await sceneMotion(page)).toBe(0);
  await expect(page.locator('.desk6 .b1')).toHaveCSS('opacity', '0');
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  repo.record(ONE_STEP);
  repo.record([{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.' }], 'comment');
  await page.waitForTimeout(2000);
  await expect(main.getByRole('heading', { level: 1, name: 'Preparing the walkthrough' })).toBeVisible();

  expect(repo.run('ready').status).toBe(0);

  await expect(main.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
  await expect(page.getByText('Everyone gets in.')).toBeVisible();
  await expect(page.getByRole('button', { name: /new comment/ })).toBeHidden();
  await expect(page.locator('.files-viewed')).toContainText('0 / 2 files viewed');
  await expect(page.locator('.ai-reviewing')).toHaveCount(0);
  await expect(page.locator('.opening')).toHaveCount(0);
  await expect(page.locator('.desk-scene')).toHaveCount(0);
  await expect(page).toHaveTitle('feature/login · Walkthrough');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon.svg');
});

test('once the session stops listening before ready, the page says so and how to pick it up', async ({ page, repo, url, context }) => {
  repo.record(ONE_STEP);
  const { child } = repo.background('listen');
  await expect.poll(() => fs.existsSync(listenerFile(repo))).toBe(true);
  child.kill('SIGKILL');
  await expect.poll(() => child.exitCode !== null || child.signalCode !== null).toBe(true);
  const then = new Date(Date.now() - 20_000);
  fs.utimesSync(listenerFile(repo), then, then);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await open(page, url);

  await expect(page.getByRole('heading', { level: 1, name: 'The AI couldn’t prepare the walkthrough' })).toBeVisible();
  await expect(page.getByText('It stopped before the review was done. Nothing was posted.')).toBeVisible();
  await expect(page.getByText('Start it over in your agent:')).toBeVisible();
  await expect(page.locator('.opening .command code')).toHaveText('/walkthrough');
  await expect(page.getByRole('button', { name: 'Try again' })).toHaveCount(0);
  await expect(page.getByText('No steps yet.')).toBeVisible();
  await expect(page.locator('.desk-scene')).toHaveCount(0);
  await expect(page.locator('.ai-reviewing')).toHaveCount(0);
  await page.getByRole('button', { name: 'Copy command' }).click();
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('/walkthrough');

  repo.background('listen');
  await expect(page.getByRole('heading', { level: 1, name: 'Preparing the walkthrough' })).toBeVisible();
});
