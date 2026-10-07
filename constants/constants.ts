import { Dimensions } from "react-native";
import Config from 'react-native-config';
import { Rtuk, RtukGroup, RtukItem, Section } from "../types/types";


export const fullWidth = Dimensions.get('window').width;
export const fullheight = Dimensions.get('window').height;


export const baseApi = Config.API_URL;

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
export const toText = (html: string): string =>
    html
        .replace(/<[^>]*>/g, '')
        .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
        .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
        .replace(/\s+/g, ' ')
        .trim();



export const decodeHtml = (text?: string): string =>
    (text ?? '')
        .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
        .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
        .replace(/\s+/g, ' ')
        .trim();


export const parseSections = (html: string): Section[] => {
    const parts = html.replace(/\r?\n/g, '').split(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)/gi);

    const sections: Section[] = [];
    let current: Section = { lines: [] };

    const push = () => {
        if (current.heading || current.lines.length > 0) sections.push(current);
    };

    for (const part of parts) {
        const match = part.match(/^<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>$/i);
        if (match) {
            push();
            current = { heading: toText(match[1]), lines: [] };
        } else {
            const lines = part
                .split(/<br\s*\/?>|<\/p>|<\/div>/i)
                .map(toText)
                .filter(Boolean);
            current.lines.push(...lines);
        }
    }
    push();

    return sections;
}
export const parseRtuk = (html: string): Rtuk => {
    const clean = html.replace(/<!--[\s\S]*?-->/g, '').replace(/\r?\n/g, '');

    const titleMatch = clean.match(/<span class="medium">([\s\S]*?)<\/span>/i);
    const title = toText(titleMatch ? titleMatch[1] : '');

    const groups: RtukGroup[] = [];
    const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
    let last = 0;
    let ul: RegExpExecArray | null;

    while ((ul = ulRegex.exec(clean))) {
        const before = clean.slice(last, ul.index);
        last = ul.index + ul[0].length;

        const pieces = before
            .split(/<\/p>|<p[^>]*>|<br\s*\/?>/i)
            .map(toText)
            .filter(Boolean);
        const heading = pieces.length > 0 ? pieces[pieces.length - 1] : '';

        const items: RtukItem[] = [];
        const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
        let li: RegExpExecArray | null;
        while ((li = liRegex.exec(ul[1]))) {
            const labelMatch = li[1].match(/<span class="left">([\s\S]*?)<\/span>/i);
            const label = toText(labelMatch ? labelMatch[1] : '');
            const value = toText(li[1].replace(/<span class="left">[\s\S]*?<\/span>/i, ''));
            if (label || value) items.push({ label, value });
        }

        groups.push({ heading, items });
    }

    return { title, groups };
};