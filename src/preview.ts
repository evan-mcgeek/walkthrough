import MarkdownIt from 'markdown-it';

// What the page can preview, known by what a file is, and the type the server sends it as.
const TYPES: Record<string, string> = {
  md: 'text/markdown; charset=utf-8',
  markdown: 'text/markdown; charset=utf-8',
  apng: 'image/apng',
  avif: 'image/avif',
  bmp: 'image/bmp',
  gif: 'image/gif',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

export function previewType(file: string): string | undefined {
  const extension = /\.([^./]+)$/.exec(file)?.[1]?.toLowerCase() ?? '';
  return Object.hasOwn(TYPES, extension) ? TYPES[extension] : undefined;
}

/** The repo path an image in a Markdown file points at, or null for an address or a path that leaves the repo. */
export function imagePath(markdownFile: string, src: string): string | null {
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(src)) return null;
  let wanted: string;
  try {
    wanted = decodeURIComponent(src.replace(/[?#].*$/s, ''));
  } catch {
    return null;
  }
  if (!wanted) return null;
  // A leading slash starts at the repo root, as code hosts read it.
  const parts = wanted.startsWith('/') ? [] : markdownFile.split('/').slice(0, -1);
  for (const part of wanted.split('/')) {
    if (part === '..') {
      if (parts.pop() === undefined) return null;
    } else if (part && part !== '.') parts.push(part);
  }
  return parts.length > 0 ? parts.join('/') : null;
}

const parser = new MarkdownIt();

/** The repo paths of the images a Markdown file shows. */
export const imagesIn = (markdownFile: string, text: string) =>
  parser
    .parse(text, {})
    .flatMap(token => token.children ?? [])
    .filter(token => token.type === 'image')
    .map(token => imagePath(markdownFile, String(token.attrGet('src') ?? '')));
