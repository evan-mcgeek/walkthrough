import { expect, open, record, test } from './walkthrough';

const RED = 'rgb(215, 58, 73)';
const BLUE = 'rgb(0, 92, 197)';

test('a diff, a suggested change and a Markdown code block take syntax colours, and a changed word stays marked inside them', async ({ page, repo, url }) => {
  record(repo, [{ title: 'Login', explanation: 'Bumps the app.\n\n```ts\nconst app = 2;\n```', files: ['login.ts', 'app.ts'] }]);
  record(repo, [{ file: 'app.ts', lines: [1, 1], body: 'Make it 3.\n\n```suggestion\nexport const app = 3;\n```' }], 'comment');
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
  const suggestion = app.locator('.suggestion td.suggestion-line');
  await expect(suggestion).toHaveText(['-export const app = 2;', '+export const app = 3;']);
  for (const line of await suggestion.all()) await expect(line.locator('span', { hasText: 'export' })).toHaveCSS('color', RED);
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.locator('.explanation pre code span', { hasText: 'const' })).toHaveCSS('color', RED);

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(app.locator('td.d2h-ins .d2h-code-line-ctn span', { hasText: 'export' })).toHaveCSS('color', 'rgb(249, 117, 131)');
});
