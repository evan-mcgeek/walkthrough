export const plural = (count: number, word: string) => `${String(count)} ${word}${count === 1 ? '' : 's'}`;
