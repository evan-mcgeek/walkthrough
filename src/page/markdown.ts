// The session's Markdown as HTML with no raw HTML from the text, and nothing the page's CSP refuses.
import MarkdownIt from 'markdown-it';

// Images would load from other sites, which the CSP refuses.
const md = new MarkdownIt({ html: false }).disable('image');

// The CSP refuses inline styles, so a table column's alignment becomes a class.
md.core.ruler.push('align_class', state => {
  for (const token of state.tokens) {
    const align = /^text-align:(\w+)$/.exec(String(token.attrGet('style') ?? ''))?.[1];
    if (!align) continue;
    token.attrs = (token.attrs ?? []).filter(([name]) => name !== 'style');
    token.attrJoin('class', `align-${align}`);
  }
});

md.renderer.rules['link_open'] = (tokens, at, options, _env, self) => {
  tokens[at]?.attrSet('target', '_blank');
  tokens[at]?.attrSet('rel', 'noreferrer');
  return self.renderToken(tokens, at, options);
};

export function markdown(text: string, className: string): HTMLElement {
  const box = document.createElement('div');
  box.className = `markdown ${className}`;
  box.innerHTML = md.render(text);
  return box;
}
