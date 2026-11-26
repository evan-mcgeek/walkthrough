// Syntax colours as the CLI hands them out, and how the page and the export put them on code that is already HTML.

/** A run of characters and its kind of code (`c` comment, `k` keyword, …), '' for plain; a line is a list of runs. */
export type Run = [number, string];

/** The answer for a language the CLI has no grammar for, or one it could not get. */
export const PLAIN = 'plain';

/** Each kind's class, `sx-c` and so on, takes its syntax token from the page's stylesheet. */
const KINDS = new Set(['c', 'k', 'n', 'e', 't', 's', 'r', 'v', 'x']);

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
    const kind = runs[run]?.[1] ?? '';
    if (kind !== open) {
      close();
      if (KINDS.has(kind)) {
        out += `<span class="sx-${kind}">`;
        open = kind;
      }
    }
    out += part;
    at++;
  }
  close();
  return at === runs.reduce((sum, [length]) => sum + length, 0) ? out : null;
}
