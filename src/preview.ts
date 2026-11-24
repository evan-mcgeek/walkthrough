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

export type PixelSize = { width: number; height: number };

// Reads the headers of PNG, GIF, BMP, WebP and JPEG only; other images, SVG among them, show without a size.
/** The pixel size an image's header gives, or null where it says none the page reads. */
export function pixelSize(bytes: Buffer): PixelSize | null {
  const ascii = (from: number, to: number) => bytes.toString('latin1', from, to);
  if (bytes.length >= 24 && ascii(1, 4) === 'PNG') return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  if (bytes.length >= 10 && ascii(0, 3) === 'GIF') return { width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8) };
  if (bytes.length >= 26 && ascii(0, 2) === 'BM') return { width: bytes.readInt32LE(18), height: Math.abs(bytes.readInt32LE(22)) };
  if (bytes.length >= 30 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    const chunk = ascii(12, 16);
    if (chunk === 'VP8X') return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3) };
    if (chunk === 'VP8 ') return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = bytes.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >>> 14) & 0x3fff) };
    }
    return null;
  }
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  // A JPEG's segments each give their length, up to the frame header that holds the size.
  for (let at = 2; at + 9 <= bytes.length && bytes[at] === 0xff; at += 2 + bytes.readUInt16BE(at + 2)) {
    const marker = bytes[at + 1] ?? 0;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
      return { width: bytes.readUInt16BE(at + 7), height: bytes.readUInt16BE(at + 5) };
  }
  return null;
}
