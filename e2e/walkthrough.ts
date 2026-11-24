// The page under test: a walkthrough started by the real CLI in a throwaway repo, served on its own port.
import { test as base, expect } from '@playwright/test';
import { makeRepo, type Repo } from '../test/helpers';

export { expect };

export const test = base.extend<{ start: Record<string, string>; files: Record<string, string>; repo: Repo; url: string }>({
  /** Files the base has on top of the default start. */
  start: [{}, { option: true }],
  /** Files the feature branch adds on top of the default change. */
  files: [{}, { option: true }],
  repo: async ({ start, files }, use) => {
    const repo = makeRepo({ start, feature: files });
    await use(repo);
    repo.run('stop');
    await repo.settled();
  },
  url: async ({ repo, page }, use) => {
    const started = repo.run('start');
    if (started.status !== 0) throw new Error(started.stderr);
    // A script blocked by the CSP or a page that throws shows up here.
    const problems: string[] = [];
    // WebKit reports a poll that leaving the page cuts off as a page error, which says nothing about the page.
    let leaving = false;
    page.on('request', request => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) leaving = true;
    });
    page.on('load', () => {
      leaving = false;
    });
    page.on('pageerror', error => {
      if (!(leaving && /Fetch API cannot load \S+ due to access control checks/.test(error.stack ?? ''))) problems.push(error.message);
    });
    page.on('console', message => {
      // The browser logs a 409, which the page answers by telling the person what changed.
      if (message.type() === 'error' && !message.text().includes('status of 409')) problems.push(message.text());
    });
    await page.goto(repo.url());
    // The page takes keys once it has drawn the walkthrough.
    await expect(page.locator('h1')).toBeAttached();
    await use(repo.url());
    expect(problems).toEqual([]);
  },
});
