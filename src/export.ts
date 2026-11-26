// A walkthrough as one read-only HTML file that opens with no server: its steps, explanations, diffs, comments and criteria.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { html as diffHtml } from 'diff2html';
import type { DiffFile } from 'diff2html/lib-esm/types';
import { colourHtml, joinLines, type Run } from './colours';
import { parseDiff } from './diff';
import { tokensAt, tokensFor } from './highlight';
import { renderComment, renderMarkdown } from './page/markdown';
import { type CommentView, walkthroughView } from './review';
import { PAGE } from './server';
import { SCREENSHOT_TYPES } from './steps';
import { nameOf } from './walkthrough';

const hash = (text: string) => `'sha256-${crypto.createHash('sha256').update(text).digest('base64')}'`;
const escape = (text: string) =>
  text.replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char);

const STATUS = { met: 'Met', partly: 'Partly met', 'not-met': 'Not met', 'not-checked': 'Not checked' } as const;

const who = (said: CommentView) => (said.by === 'colleague' ? (said.author ?? '') : said.by === 'ai' ? 'AI' : 'You');

const unescape = (text: string) => text.replace(/&(amp|lt|gt|quot);/g, (_, name: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"' })[name] ?? '');

const painted = (html: string, runs: Run[] | undefined) => (runs && colourHtml(html, runs)) ?? html;

/** A file's diff2html rows coloured as the page colours them: removed lines from the base, the others from the head. */
async function colourDiff(html: string, file: DiffFile, base: string, head: string): Promise<string> {
  const [before, after] = await Promise.all([
    file.isNew ? null : tokensAt(process.cwd(), base, file.oldName),
    file.isDeleted ? null : tokensAt(process.cwd(), head, file.newName),
  ]);
  return html.replace(/<tr>[\s\S]*?<\/tr>/g, row => {
    const removed = row.includes('d2h-code-linenumber d2h-del');
    const line = Number(new RegExp(`<div class="line-num${removed ? '1' : '2'}">(\\d+)</div>`).exec(row)?.[1]);
    const tokens = (removed ? before : after)?.[line - 1];
    return row.replace(/(<span class="d2h-code-line-ctn">)([\s\S]*?)(<\/span>)/, (_, open: string, code: string, close: string) => open + painted(code, tokens) + close);
  });
}

/** A step's diff, one coloured file at a time. */
async function stepDiff(diff: string, base: string, head: string): Promise<string> {
  const files = parseDiff(diff);
  const [start = '', ...chunks] = diffHtml(files, { outputFormat: 'line-by-line', drawFileList: false, matching: 'lines' }).split(/(?=<div id="d2h-\d+" class="d2h-file-wrapper")/);
  const coloured = await Promise.all(chunks.map((chunk, at) => {
    const file = files[at];
    return file ? colourDiff(chunk, file, base, head) : Promise.resolve(chunk);
  }));
  return start + coloured.join('');
}

/** Code blocks whose fence names a language, coloured. */
async function colourBlocks(html: string): Promise<string> {
  const blocks = /<pre><code class="language-([^"\s]+)">([\s\S]*?)<\/code><\/pre>/g;
  const tokens = await Promise.all([...html.matchAll(blocks)].map(([, language = '', code = '']) => tokensFor(unescape(code), { language: unescape(language) })));
  let at = 0;
  return html.replace(blocks, (block, language: string, code: string) => {
    const lines = tokens[at++];
    return lines ? `<pre><code class="language-${language}">${painted(code, joinLines(lines))}</code></pre>` : block;
  });
}

/** A comment's suggested changes coloured as the page colours them: the lines they replace as they stand at the head, the lines they add in the file's language. */
async function colourSuggestions(html: string, file: string, head: string): Promise<string> {
  const rows = /(<tr class="suggestion-(del|add)"><td class="suggestion-number">(\d*)<\/td><td class="suggestion-number">\d*<\/td><td class="suggestion-line"><span class="suggestion-sign">.<\/span>)([\s\S]*?)(<\/td><\/tr>)/g;
  const found = [...html.matchAll(rows)];
  if (!found.length) return html;
  const added = found.flatMap(([, , kind, , code = '']) => (kind === 'add' ? [unescape(code)] : []));
  const [atHead, addedLines] = await Promise.all([tokensAt(process.cwd(), head, file), added.length ? tokensFor(added.join('\n'), { file }) : null]);
  let at = 0;
  return html.replace(rows, (_, open: string, kind: string, number: string, code: string, close: string) =>
    open + painted(code, kind === 'del' ? atHead?.[Number(number) - 1] : addedLines?.[at++]) + close,
  );
}

export async function exportPage(dir: string): Promise<string> {
  const view = walkthroughView(dir);
  if (!view) throw new Error('there is no such walkthrough');
  const title = view.pr ? `#${view.pr.number} ${view.pr.title}` : nameOf(view);
  const diffs = await Promise.all(view.steps.map(step => stepDiff(step.diff, view.base, view.head)));
  const comments = await Promise.all(
    view.steps.map(step =>
      Promise.all(
        view.threads
          .filter(thread => thread.step === step.id)
          .flatMap(thread =>
            thread.comments.map(
              async said =>
                `<li><code>${escape(thread.file)}${thread.lines ? `:${String(thread.lines[1])}` : ''}</code> <strong>${escape(who(said))}</strong>${said.by === 'ai' && (said.pending || said.review) ? ' <code>[AI]</code>' : ''}<div class="markdown">${await colourSuggestions(renderComment(said.body, thread.code ?? []), thread.file, view.head)}</div></li>`,
            ),
          ),
      ),
    ),
  );
  const steps = view.steps.map((step, at) => {
    const said = comments[at] ?? [];
    const shot = step.screenshot;
    const type = shot && SCREENSHOT_TYPES[shot.name.split('.').pop() as keyof typeof SCREENSHOT_TYPES];
    const figure =
      shot && type
        ? `<figure class="screenshot open"><img class="screenshot-image" src="data:${type};base64,${fs.readFileSync(path.join(dir, shot.name)).toString('base64')}" alt="${escape(shot.alt)}" />${shot.alt ? `<figcaption>${escape(shot.alt)}</figcaption>` : ''}</figure>`
        : '';
    const diff = diffs[at] ?? '';
    return `<section class="export-step"><h2>${String(at + 1)}. ${escape(step.title)}</h2>
<div class="markdown">${renderMarkdown(step.explanation)}</div>${figure}${diff}${said.length ? `<ul class="export-comments">${said.join('')}</ul>` : ''}</section>`;
  });
  const body = await colourBlocks(steps.join('\n'));
  const criteria = (view.criteria ?? []).map(one => `<li>${escape(one.text)}: ${STATUS[one.status]}${one.missing || one.reason ? `. ${escape(one.missing ?? one.reason ?? '')}` : ''}</li>`);
  const style = fs.readFileSync(path.join(PAGE, 'style.css'), 'utf8');
  const policy = `default-src 'none'; style-src ${hash(style)}; img-src data:; font-src data:; base-uri 'none'; form-action 'none'`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="content-security-policy" content="${policy}" />
    <title>${escape(title)} · Walkthrough</title>
    <style>${style}</style>
  </head>
  <body class="export">
    <main class="export-main">
      <h1>${escape(title)}</h1>
      ${body}
      ${criteria.length ? `<section class="export-step"><h2>Acceptance criteria</h2><ul>${criteria.join('')}</ul></section>` : ''}
    </main>
  </body>
</html>
`;
}
