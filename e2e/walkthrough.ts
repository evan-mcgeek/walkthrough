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
      // A request that never reached a server, as a test that takes the server away causes, is not the page's fault.
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource: net::ERR_')) problems.push(message.text());
    });
    await use(repo.url());
    expect(problems).toEqual([]);
  },
});

/** Records `input` with the CLI; steps also make the walkthrough ready, so the page shows it. */
export function record(repo: Repo, input: unknown, command = 'steps'): void {
  const recorded = command === 'steps' ? [repo.record(input, command), repo.run('ready')] : [repo.record(input, command)];
  for (const { status, stderr } of recorded) if (status !== 0) throw new Error(stderr);
}

export async function open(page: Page, url: string, address = ''): Promise<void> {
  await page.goto(url + address);
  await expect(page.locator('.app-header .mark')).toBeAttached();
}

/** Where `locator` sits in the page, to tell whether anything moved it. */
export const topOf = async (page: Page, selector: string) =>
  page.locator(selector).first().evaluate(element => element.getBoundingClientRect().top);
