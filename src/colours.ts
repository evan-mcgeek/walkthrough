// Syntax colours as the CLI hands them out, and how the page and the export put them on code that is already HTML.

/** A run of characters and its colour key, '' for the text's own colour; a line is a list of runs. */
export type Run = [number, string];

/** The answer for a language the CLI has no grammar for, or one it could not get. */
export const PLAIN = 'plain';

/** A key is the light and the dark colour, with -i for italic and -b for bold. */
const KEY = /^([0-9a-f]{6,8})-([0-9a-f]{6,8})(-i)?(-b)?$/;

export const classOf = (key: string) => `hl-${key}`;

/** The rule for a key's class, or null for a key that is not one; switching theme stays CSS only. */
export function ruleFor(key: string): string | null {
  const [, light, dark, italic, bold] = KEY.exec(key) ?? [];
  if (!light || !dark) return null;
  return `.${classOf(key)}{color:light-dark(#${light},#${dark})${italic ? ';font-style:italic' : ''}${bold ? ';font-weight:bold' : ''}}`;
}

/** A block's lines as one list of runs, with each line break plain. */
export const joinLines = (lines: Run[][]): Run[] => lines.flatMap((line, at) => (at ? [[1, ''] as Run, ...line] : line));

/**
 * Wraps the text of escaped HTML in a span per run, closing spans at every tag so marks such as diff2html's <ins> and <del> stay whole.
 * Null when the text is not as long as the runs, so code that is not what was coloured stays plain.
 */
export function colourHtml(html: string, runs: Run[]): string | null {
  let out = '';
  let at = 0;
  let run = -1;
  let end = 0;
  let open = '';
  const close = () => {
    if (open) out += '</span>';
    open = '';
  };
  for (const part of html.match(/<[^>]*>|&[^;\s]+;|[\s\S]/g) ?? []) {
    if (part.startsWith('<') && part.length > 1) {
      close();
      out += part;
      continue;
    }
    while (at >= end && run < runs.length) end += runs[++run]?.[0] ?? 0;
    const key = runs[run]?.[1] ?? '';
    if (key !== open) {
      close();
      if (ruleFor(key)) out += `<span class="${classOf(key)}">`;
      open = ruleFor(key) ? key : '';
    }
    out += part;
    at++;
  }
  close();
  return at === runs.reduce((sum, [length]) => sum + length, 0) ? out : null;
}
