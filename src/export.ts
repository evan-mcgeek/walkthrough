// A walkthrough as one read-only HTML file that opens with no server: its steps, explanations, diffs, comments and criteria.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { html as diffHtml } from 'diff2html';
import MarkdownIt from 'markdown-it';
import { parseDiff } from './diff';
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

export function exportPage(dir: string): string {
  const view = walkthroughView(dir);
  if (!view) throw new Error('there is no such walkthrough');
  const title = view.pr ? `#${view.pr.number} ${view.pr.title}` : nameOf(view);
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
    const diff = diffHtml(parseDiff(step.diff), { outputFormat: 'line-by-line', drawFileList: false, matching: 'lines' });
    return `<section class="export-step"><h2>${String(at + 1)}. ${escape(step.title)}</h2>
<div class="markdown">${markdown.render(step.explanation)}</div>${figure}${diff}${comments.length ? `<ul class="export-comments">${comments.join('')}</ul>` : ''}</section>`;
  });
  const criteria = (view.criteria ?? []).map(one => `<li>${escape(one.text)}: ${STATUS[one.status]}</li>`);
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
      ${steps.join('\n')}
      ${criteria.length ? `<section class="export-step"><h2>Acceptance criteria</h2><ul>${criteria.join('')}</ul></section>` : ''}
    </main>
  </body>
</html>
`;
}
