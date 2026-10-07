export const NAMED: Record<string, string> = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
    ndash: '–',
    mdash: '—',
    hellip: '…',
};

export const decodeHtml = (text?: string): string =>
    (text ?? '')
        .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
        .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
        .replace(/\s+/g, ' ')
        .trim();