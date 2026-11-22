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

/** The type a file is previewed as, or undefined when the page has no preview for it. */
export function previewType(file: string): string | undefined {
  const extension = /\.([^./]+)$/.exec(file)?.[1]?.toLowerCase() ?? '';
  return Object.hasOwn(TYPES, extension) ? TYPES[extension] : undefined;
}
