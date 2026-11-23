import MarkdownIt from 'markdown-it';
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
// What the session writes shows no pictures, which could pass for part of the page.
const withoutImages = renderer().disable('image');

/** `file` is the changed Markdown file being previewed, whose images are part of what is reviewed. */
export const renderMarkdown = (text: string, file?: string) =>
  file === undefined ? withoutImages.render(text) : withImages.render(text, { file });
