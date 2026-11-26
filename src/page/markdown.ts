import MarkdownIt from 'markdown-it';
import type { Code } from '../lines';
import { imagePath } from '../preview';

function renderer() {
  // Raw HTML shows as text, and markdown-it drops script links, so the result is safe to put in the page.
  const markdown = new MarkdownIt({ html: false, linkify: true });

  // The CSP refuses style attributes, so table cells align by class instead.
  markdown.core.ruler.push('align_by_class', state => {
    for (const token of state.tokens) {
      const align = /^text-align:(left|center|right)$/.exec(String(token.attrGet('style')))?.[1];
      if (!align) continue;
      token.attrs = (token.attrs ?? []).filter(([name]) => name !== 'style');
      token.attrJoin('class', `align-${align}`);
    }
  });

  // A link leaves the walkthrough open, and the page address with its token stays private.
  markdown.renderer.rules['link_open'] = (tokens, at, options, _env, self) => {
    tokens[at]?.attrSet('target', '_blank');
    tokens[at]?.attrSet('rel', 'noopener noreferrer');
    return self.renderToken(tokens, at, options);
  };
  return markdown;
}

const withImages = renderer();
// A path in the repo loads from the server as it is at the head commit; an address is left to the CSP.
const image = withImages.renderer.rules['image'];
withImages.renderer.rules['image'] = (tokens, at, options, env, self) => {
  const token = tokens[at];
  const file = (env as { file?: string } | undefined)?.file ?? '';
  const repoPath = token && imagePath(file, String(token.attrGet('src') ?? ''));
  if (repoPath) token.attrSet('src', `file?path=${encodeURIComponent(repoPath)}`);
  return image ? image(tokens, at, options, env, self) : '';
};
// A top-level block holding a line the change adds gets the addition wash.
withImages.core.ruler.push('mark_added', state => {
  const added = (state.env as { added?: Set<number> } | undefined)?.added;
  if (!added?.size) return;
  for (const token of state.tokens) {
    if (token.level !== 0 || token.nesting === -1 || !token.map) continue;
    const [first, end] = token.map;
    for (let line = first + 1; line <= end; line++)
      if (added.has(line)) {
        token.attrJoin('class', 'inserted');
        break;
      }
  }
});
// What the session writes shows no pictures, which could pass for part of the page.
const withoutImages = renderer().disable('image');
// A suggestion block on a comment's lines shows as a suggested change: those lines removed, the block's lines added.
const fence = withoutImages.renderer.rules['fence'];
withoutImages.renderer.rules['fence'] = (tokens, at, options, env, self) => {
  const token = tokens[at];
  const code = (env as { code?: Code } | undefined)?.code;
  if (!token || !code?.length || token.info.trim() !== 'suggestion') return fence ? fence(tokens, at, options, env, self) : '';
  const { escapeHtml } = withoutImages.utils;
  const row = (kind: 'del' | 'add', before: string, after: string, text: string) =>
    `<tr class="suggestion-${kind}"><td class="suggestion-number">${before}</td><td class="suggestion-number">${after}</td><td class="suggestion-line"><span class="suggestion-sign">${kind === 'del' ? '-' : '+'}</span>${escapeHtml(text)}</td></tr>`;
  const first = code[0]?.[0] ?? 1;
  const added = token.content ? token.content.replace(/\n$/, '').split('\n') : [];
  return `<div class="suggestion"><div class="suggestion-head">Suggested change</div><div class="suggestion-scroll"><table class="suggestion-code">${[
    ...code.map(([number, text]) => row('del', String(number), '', text)),
    ...added.map((text, offset) => row('add', '', String(first + offset), text)),
  ].join('')}</table></div></div>\n`;
};

/** `file` is the changed Markdown file being previewed, whose images are part of what is reviewed; `added` its head lines the change adds. */
export const renderMarkdown = (text: string, file?: string, added?: Set<number>) =>
  file === undefined ? withoutImages.render(text) : withImages.render(text, { file, added });
/** A comment, whose suggestion block shows as a suggested change on `code`, the lines it is on. */
export const renderComment = (text: string, code: Code) => withoutImages.render(text, { code });
