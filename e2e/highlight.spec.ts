import { expect, open, record, test } from './walkthrough';

const RED = 'rgb(215, 58, 73)';
const BLUE = 'rgb(0, 92, 197)';

test('a diff and a Markdown code block take syntax colours, and a changed word stays marked inside them', async ({ page, repo, url }) => {
  record(repo, [{ title: 'Login', explanation: 'Bumps the app.\n\n```ts\nconst app = 2;\n```', files: ['login.ts', 'app.ts'] }]);
  await open(page, url);

  const app = page.locator('.file[data-file="app.ts"]');
  for (const side of ['d2h-del', 'd2h-ins']) {
    const code = app.locator(`td.${side}:not(.d2h-code-linenumber) .d2h-code-line-ctn`);
    await expect(code.locator('span', { hasText: 'export' })).toHaveCSS('color', RED);
    // diff2html's mark on the changed number holds its colour, so both show.
    const changed = code.locator(side === 'd2h-ins' ? 'ins' : 'del');
    await expect(changed).toHaveText(side === 'd2h-ins' ? '2' : '1');
    await expect(changed.locator('span')).toHaveCSS('color', BLUE);
  }
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.locator('.explanation pre code span', { hasText: 'const' })).toHaveCSS('color', RED);

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(app.locator('td.d2h-ins .d2h-code-line-ctn span', { hasText: 'export' })).toHaveCSS('color', 'rgb(249, 117, 131)');
});
