import type { Locator, Page } from '@playwright/test';
import { expect, test } from './walkthrough';

const expectAbove = async (upper: Locator, lower: Locator) => {
  const [one, other] = await Promise.all([upper.boundingBox(), lower.boundingBox()]);
  expect((one?.y ?? Infinity) + (one?.height ?? 0)).toBeLessThanOrEqual(other?.y ?? -Infinity);
};

/** A design token as the browser resolves it for colour, in the page's current theme. */
const tokenColor = (page: Page, token: string) =>
  page.evaluate(name => {
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.color = `var(${name})`;
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);

const fileIn = (scope: Locator, path: string) => scope.locator(`.d2h-file-wrapper[data-file="${path}"]`);

test.describe('explained files', () => {
  const big = Array.from({ length: 450 }, (_, at) => `export const line${String(at)} = ${String(at)};`).join('\n');
  test.use({ files: { 'big.ts': `${big}\n` } });

  test.beforeEach(async ({ page, repo, url }) => {
    await expect(page).toHaveURL(url);
    const recorded = repo.record([
      {
        title: 'Login',
        explanation: 'Adds login.',
        files: ['app.ts', { path: 'big.ts', explanation: 'A long table:\n\n- one\n- two' }, { path: 'login.ts', explanation: 'Lets **everyone** in.' }],
      },
    ]);
    if (recorded.status !== 0) throw new Error(recorded.stderr);
    await expect(page.getByRole('region', { name: 'Login' })).toBeVisible();
  });

  test("with the explanation column hidden, a file's explanation is a short note under its header, on a phone too", async ({ page }) => {
    const step = page.getByRole('region', { name: 'Login' });
    const login = fileIn(step, 'login.ts');
    const note = login.locator('.file-explanation');
    await expect(note).toHaveText('Lets everyone in.');
    await expect(step.locator('.files-explained')).toHaveCount(0);
    await expectAbove(login.locator('.d2h-file-header'), note);
    await expectAbove(note, login.locator('.d2h-file-diff'));
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await expect(note).toBeVisible();
      await expect(note).toHaveCSS('color', await tokenColor(page, '--ink-secondary'));
      await expect(note).toHaveCSS('font-size', '14px');
      await expect.poll(async () => Number.parseFloat(await note.evaluate(box => getComputedStyle(box).lineHeight))).toBeCloseTo(21.7, 1);
      await expect(note).toHaveCSS('border-left', `2px solid ${await tokenColor(page, '--accent')}`);
      const { above, below } = await note.evaluate(box => ({ above: getComputedStyle(box).marginTop, below: getComputedStyle(box).marginBottom }));
      expect(above).toBe(below);
    }
  });

  test('with the explanation column open, the column lists the explained files and the code pane holds only code', async ({ page }) => {
    await page.keyboard.press('3');
    const step = page.getByRole('region', { name: 'Login' });
    const prose = step.locator('.prose');
    const code = step.locator('.code');
    const files = prose.getByRole('list', { name: 'Files' });
    await expect(prose.getByRole('heading', { name: 'Files' })).toBeVisible();
    await expect(files.getByRole('link')).toHaveText(['big.ts', 'login.ts']);
    await expect(files.locator('.file-explanation')).toHaveText([/^A long table:\s*one\s*two\s*$/, 'Lets everyone in.']);
    await expect(files.locator('.file-explanation').first()).toHaveCSS('font-size', '15px');
    await expect(code.locator('.file-explanation')).toHaveCount(0);
    const entry = (path: string) => files.getByRole('listitem').filter({ has: page.getByRole('link', { name: path }) });
    // app.ts is at the top of the code pane and has no explanation.
    await expect(files.locator('[aria-current]')).toHaveCount(0);

    await expect(fileIn(code, 'big.ts').locator('.d2h-file-diff')).toBeHidden();
    await files.getByRole('link', { name: 'big.ts' }).click();
    await expect(fileIn(code, 'big.ts').locator('.d2h-file-diff')).toBeVisible();
    await expect(entry('big.ts')).toHaveAttribute('aria-current', 'true');
    await expect(files.locator('[aria-current]')).toHaveCount(1);
    const [pane, file] = await Promise.all([code.boundingBox(), fileIn(code, 'big.ts').boundingBox()]);
    expect(Math.abs((file?.y ?? 0) - (pane?.y ?? 0))).toBeLessThanOrEqual(1);

    // A short last file cannot reach the top, so the pane's end marks it.
    await files.getByRole('link', { name: 'login.ts' }).click();
    await expect(entry('login.ts')).toHaveAttribute('aria-current', 'true');
    await expect(entry('big.ts')).not.toHaveAttribute('aria-current');

    await code.evaluate(box => {
      box.scrollTop = 0;
    });
    await expect(files.locator('[aria-current]')).toHaveCount(0);

    // The column waits for wider screens, so a phone shows each explanation under its file.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(step.locator('.files-explained')).toHaveCount(0);
    await expect(fileIn(step, 'login.ts').locator('.file-explanation')).toHaveText('Lets everyone in.');
  });
});

test.describe('files named like object members', () => {
  test.use({ files: { constructor: 'built\n', toString: 'said\n' } });

  test('take no inherited value as their explanation', async ({ page, repo, url }) => {
    await expect(page).toHaveURL(url);
    const recorded = repo.record([
      { title: 'Members', explanation: 'Adds two files.', files: ['login.ts', 'app.ts', 'constructor', { path: 'toString', explanation: 'Says itself.' }] },
    ]);
    if (recorded.status !== 0) throw new Error(recorded.stderr);
    const step = page.getByRole('region', { name: 'Members' });
    await expect(fileIn(step, 'constructor')).toBeVisible();
    await expect(step.locator('.file-explanation')).toHaveText(['Says itself.']);
    await page.keyboard.press('3');
    await expect(step.locator('.prose').getByRole('list', { name: 'Files' }).getByRole('link')).toHaveText(['toString']);
  });
});
