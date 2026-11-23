// A walkthrough as one read-only HTML file: the page itself with its script, style and state inlined, opened with no server.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { walkthroughView } from './decisions';
import { PAGE, readViewer } from './server';
import { sessionView } from './session';

const hash = (text: string) => `'sha256-${crypto.createHash('sha256').update(text).digest('base64')}'`;

function inline(html: string, tag: string, replacement: string): string {
  if (!html.includes(tag)) throw new Error(`the page has no ${tag} to inline`);
  return html.replace(tag, () => replacement);
}

export function exportPage(dir: string): string {
  const read = (file: string) => fs.readFileSync(path.join(PAGE, file), 'utf8');
  // `<!--` or `</script` in a string or regex would end or confuse the inline script; `\x3C` reads as `<` in both.
  const script = read('app.js').replace(/<(?=!--|\/script)/gi, '\\x3C');
  const style = read('style.css');
  const state = { walkthrough: walkthroughView(dir), session: sessionView(dir), at: new Date().toISOString(), viewer: readViewer() };
  // The state is data and never runs, so a `<` in it cannot end its element.
  const data = JSON.stringify(state).replaceAll('<', '\\u003c');
  const policy = `default-src 'none'; script-src ${hash(script)}; style-src ${hash(style)}; img-src data:; font-src data:; base-uri 'none'; form-action 'none'`;
  let html = read('index.html');
  // A file opened on its own has no server for the icons, so the favicon travels inside it.
  const favicon = fs.readFileSync(path.join(PAGE, 'favicon.svg')).toString('base64');
  html = inline(
    html,
    '<link rel="icon" href="favicon.svg" type="image/svg+xml" />\n    <link rel="apple-touch-icon" href="apple-touch-icon.png" />',
    `<link rel="icon" href="data:image/svg+xml;base64,${favicon}" type="image/svg+xml" />`,
  );
  html = inline(
    html,
    '<link rel="stylesheet" href="style.css" />',
    `<meta http-equiv="content-security-policy" content="${policy}" />\n    <style>${style}</style>`,
  );
  html = inline(
    html,
    '<script type="module" src="app.js"></script>',
    `<script type="application/json" id="exported">${data}</script>\n    <script type="module">${script}</script>`,
  );
  return html;
}
