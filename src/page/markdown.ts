import MarkdownIt from 'markdown-it';

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

export const renderMarkdown = (text: string) => markdown.render(text);
