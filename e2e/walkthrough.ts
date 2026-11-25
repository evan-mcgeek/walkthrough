// The page under test: a walkthrough started by the real CLI in a throwaway repo, served on its own port.
import { test as base, expect, type Page } from '@playwright/test';
import { makeRepo, type Repo } from '../test/helpers';

export { expect };

/** A file of `count` numbered lines, long enough to scroll through. */
export const lines = (count: number, prefix = 'line') => Array.from({ length: count }, (_, at) => `export const ${prefix}${String(at + 1)} = ${String(at + 1)};`).join('\n') + '\n';

export const test = base.extend<{ start: Record<string, string>; files: Record<string, string>; args: string[]; repo: Repo; url: string }>({
  /** Files the base has on top of the default start. */
  start: [{}, { option: true }],
  /** Files the feature branch adds on top of the default change. */
  files: [{}, { option: true }],
  /** What start is given, such as --pr. */
  args: [[], { option: true }],
  repo: async ({ start, files }, use) => {
    const repo = makeRepo({ start, feature: files });
    await use(repo);
    repo.run('stop');
    await repo.settled();
  },
  url: async ({ repo, page, args }, use) => {
    const started = repo.run('start', ...args);
    if (started.status !== 0) throw new Error(started.stderr);
    // A script blocked by the CSP or a page that throws shows up here.
    const problems: string[] = [];
    page.on('pageerror', error => problems.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') problems.push(message.text());
    });
    await use(repo.url());
    expect(problems).toEqual([]);
  },
});

/** Records `input` with the CLI and waits until the page shows the step list it draws. */
export function record(repo: Repo, input: unknown, command = 'steps'): void {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
}

export async function open(page: Page, url: string, address = ''): Promise<void> {
  await page.goto(url + address);
  await expect(page.locator('.app-header .mark')).toBeAttached();
}

/** Where `locator` sits in the page, to tell whether anything moved it. */
export const topOf = async (page: Page, selector: string) =>
  page.locator(selector).first().evaluate(element => element.getBoundingClientRect().top);
