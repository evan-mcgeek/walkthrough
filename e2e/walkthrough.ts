// The page under test: a walkthrough started by the real CLI in a throwaway repo, served on its own port.
import { test as base, expect } from '@playwright/test';
import { makeRepo, type Repo } from '../test/helpers';

export { expect };

export const test = base.extend<{ files: Record<string, string>; repo: Repo; url: string }>({
  /** Files the feature branch adds on top of the default change. */
  files: [{}, { option: true }],
  repo: async ({ files }, use) => {
    const repo = makeRepo({ feature: files });
    await use(repo);
    repo.run('stop');
  },
  url: async ({ repo, page }, use) => {
    const started = repo.run('start');
    if (started.status !== 0) throw new Error(started.stderr);
    // A script blocked by the CSP or a page that throws shows up here.
    const problems: string[] = [];
    page.on('pageerror', error => problems.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') problems.push(message.text());
    });
    await page.goto(repo.url());
    await use(repo.url());
    expect(problems).toEqual([]);
  },
});
