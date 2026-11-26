import { expect, open, record, test } from './walkthrough';

// DESIGN.md's syntax tokens and changed-word washes, light then dark.
const KEYWORD = ['rgb(176, 40, 42)', 'rgb(249, 135, 149)'];
const CONSTANT = ['rgb(0, 90, 191)', 'rgb(121, 184, 255)'];
const ADD_WORD = ['rgb(196, 233, 207)', 'rgb(29, 65, 41)'];
const DEL_WORD = ['rgb(247, 205, 200)', 'rgb(79, 37, 38)'];
const TINT = ['rgb(238, 240, 243)', 'rgb(35, 40, 48)'];

test('a diff, a suggested change and a code block take the syntax tokens as classes, a changed word stays marked, and inline code stays plain', async ({ page, repo, url }) => {
  record(repo, [{ title: 'Login', explanation: 'Bumps the app with `const`.\n\n```ts\nconst app = 2;\n```', files: ['login.ts', 'app.ts'] }]);
  record(repo, [{ file: 'app.ts', lines: [1, 1], body: 'Make it 3.\n\n```suggestion\nexport const app = 3;\n```' }], 'comment');
  await open(page, url);
  await page.getByRole('button', { name: 'More' }).click();

  const app = page.locator('.file[data-file="app.ts"]');
  const added = app.locator('td.d2h-ins:not(.d2h-code-linenumber) .d2h-code-line-ctn');
  const removed = app.locator('td.d2h-del:not(.d2h-code-linenumber) .d2h-code-line-ctn');
  const block = page.locator('.explanation pre');
  for (const [at, scheme] of (['light', 'dark'] as const).entries()) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const code of [added, removed]) {
      await expect(code.locator('span.sx-k', { hasText: 'export' })).toHaveCSS('color', KEYWORD[at] ?? '');
      // diff2html's mark on the changed number holds its colour, so both show.
      await expect(code.locator(':is(ins, del) > span.sx-n')).toHaveCSS('color', CONSTANT[at] ?? '');
    }
    await expect(added.locator('ins')).toHaveText('2');
    await expect(added.locator('ins')).toHaveCSS('background-color', ADD_WORD[at] ?? '');
    await expect(removed.locator('del')).toHaveText('1');
    await expect(removed.locator('del')).toHaveCSS('background-color', DEL_WORD[at] ?? '');
    await expect(block).toHaveCSS('background-color', TINT[at] ?? '');
    await expect(block.locator('span.sx-k', { hasText: 'const' })).toHaveCSS('color', KEYWORD[at] ?? '');
  }
  await expect(page.locator('.explanation :not(pre) > code')).toHaveText('const');
  await expect(page.locator('.explanation :not(pre) > code span')).toHaveCount(0);
  const suggestion = app.locator('.suggestion td.suggestion-line');
  await expect(suggestion).toHaveText(['-export const app = 2;', '+export const app = 3;']);
  for (const line of await suggestion.all()) await expect(line.locator('span.sx-k', { hasText: 'export' })).toHaveCount(1);
  // Every colour comes from a class, never an inline style.
  await expect(page.locator(':is(.d2h-code-line-ctn, pre, .suggestion-line) [style]')).toHaveCount(0);
});
