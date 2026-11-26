// A walkthrough as one read-only HTML file that opens with no server: its steps, explanations, diffs, comments and criteria.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { html as diffHtml } from 'diff2html';
import type { DiffFile } from 'diff2html/lib-esm/types';
import MarkdownIt from 'markdown-it';
import { colourHtml, joinLines, ruleFor, type Run } from './colours';
import { parseDiff } from './diff';
import { tokensAt, tokensFor } from './highlight';
import { type CommentView, walkthroughView } from './review';
import { PAGE } from './server';
import { SCREENSHOT_TYPES } from './steps';
import { nameOf } from './walkthrough';

const hash = (text: string) => `'sha256-${crypto.createHash('sha256').update(text).digest('base64')}'`;
// Raw HTML in what the session or a person wrote shows as text.
const markdown = new MarkdownIt({ html: false, linkify: true }).disable('image');
const escape = (text: string) =>
  text.replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char);

const STATUS = { met: 'Met', partly: 'Partly met', 'not-met': 'Not met', 'not-checked': 'Not checked' } as const;

const who = (said: CommentView) => (said.by === 'colleague' ? (said.author ?? '') : said.by === 'ai' ? 'AI' : 'You');

const unescape = (text: string) => text.replace(/&(amp|lt|gt|quot);/g, (_, name: string) => ({ amp: '&', lt: '<', gt: '>', quot: '"' })[name] ?? '');

/** Each colour key used, whose rule goes into the file's one stylesheet. */
function painted(html: string, runs: Run[] | undefined, keys: Set<string>): string {
  const coloured = runs && colourHtml(html, runs);
  if (!runs || !coloured) return html;
  for (const [, key] of runs) keys.add(key);
  return coloured;
}

/** A file's diff2html rows coloured as the page colours them: removed lines from the base, the others from the head. */
async function colourDiff(html: string, file: DiffFile, base: string, head: string, keys: Set<string>): Promise<string> {
  const [before, after] = await Promise.all([
    file.isNew ? null : tokensAt(process.cwd(), base, file.oldName),
    file.isDeleted ? null : tokensAt(process.cwd(), head, file.newName),
  ]);
  return html.replace(/<tr>[\s\S]*?<\/tr>/g, row => {
    const removed = row.includes('d2h-code-linenumber d2h-del');
    const line = Number(new RegExp(`<div class="line-num${removed ? '1' : '2'}">(\\d+)</div>`).exec(row)?.[1]);
    const tokens = (removed ? before : after)?.[line - 1];
    return row.replace(/(<span class="d2h-code-line-ctn">)([\s\S]*?)(<\/span>)/, (_, open: string, code: string, close: string) => open + painted(code, tokens, keys) + close);
  });
}

/** A step's diff, one coloured file at a time. */
async function stepDiff(diff: string, base: string, head: string, keys: Set<string>): Promise<string> {
  const files = parseDiff(diff);
  const [start = '', ...chunks] = diffHtml(files, { outputFormat: 'line-by-line', drawFileList: false, matching: 'lines' }).split(/(?=<div id="d2h-\d+" class="d2h-file-wrapper")/);
  const coloured = await Promise.all(chunks.map((chunk, at) => {
    const file = files[at];
    return file ? colourDiff(chunk, file, base, head, keys) : Promise.resolve(chunk);
  }));
  return start + coloured.join('');
}

/** Code blocks whose fence names a language, coloured. */
async function colourBlocks(html: string, keys: Set<string>): Promise<string> {
  const blocks = /<pre><code class="language-([^"\s]+)">([\s\S]*?)<\/code><\/pre>/g;
  const tokens = await Promise.all([...html.matchAll(blocks)].map(([, language = '', code = '']) => tokensFor(unescape(code), { language: unescape(language) })));
  let at = 0;
  return html.replace(blocks, (block, language: string, code: string) => {
    const lines = tokens[at++];
    return lines ? `<pre><code class="language-${language}">${painted(code, joinLines(lines), keys)}</code></pre>` : block;
  });
}

export async function exportPage(dir: string): Promise<string> {
  const view = walkthroughView(dir);
  if (!view) throw new Error('there is no such walkthrough');
  const title = view.pr ? `#${view.pr.number} ${view.pr.title}` : nameOf(view);
  const keys = new Set<string>();
  const diffs = await Promise.all(view.steps.map(step => stepDiff(step.diff, view.base, view.head, keys)));
  const steps = view.steps.map((step, at) => {
    const threads = view.threads.filter(thread => thread.step === step.id);
    const comments = threads.flatMap(thread =>
      thread.comments.map(
        said =>
          `<li><code>${escape(thread.file)}${thread.lines ? `:${String(thread.lines[1])}` : ''}</code> <strong>${escape(who(said))}</strong>${said.by === 'ai' && (said.pending || said.review) ? ' <code>[AI]</code>' : ''}${markdown.render(said.body)}</li>`,
      ),
    );
    const shot = step.screenshot;
    const type = shot && SCREENSHOT_TYPES[shot.name.split('.').pop() as keyof typeof SCREENSHOT_TYPES];
    const figure =
      shot && type
        ? `<figure class="screenshot open"><img class="screenshot-image" src="data:${type};base64,${fs.readFileSync(path.join(dir, shot.name)).toString('base64')}" alt="${escape(shot.alt)}" />${shot.alt ? `<figcaption>${escape(shot.alt)}</figcaption>` : ''}</figure>`
        : '';
    const diff = diffs[at] ?? '';
    return `<section class="export-step"><h2>${String(at + 1)}. ${escape(step.title)}</h2>
<div class="markdown">${markdown.render(step.explanation)}</div>${figure}${diff}${comments.length ? `<ul class="export-comments">${comments.join('')}</ul>` : ''}</section>`;
  });
  const body = await colourBlocks(steps.join('\n'), keys);
  const criteria = (view.criteria ?? []).map(one => `<li>${escape(one.text)}: ${STATUS[one.status]}</li>`);
  const style = fs.readFileSync(path.join(PAGE, 'style.css'), 'utf8') + [...keys].map(ruleFor).filter(Boolean).join('');
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
