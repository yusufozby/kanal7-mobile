export type SpecialContent = {
    link: string;
    image: string;
    title: string;
    embed: string;
};

export type Program = {
    title: string;
    spot: string;
    category: { title: string; slug: string };
    slug: string;
    images: {
        default: string;
        thumbnail: string;
        medium: string;
        large: string;
    };
    izle7_content: { title: string; embed: string };
    time: string;
    detail: string;
    tag: string;
    'special-content': SpecialContent[];
};

export type PageData = {
    title: string;
    slug: string;
    detail: string;
    clear_detail?: string;
};

export type Section = {
    heading?: string;
    lines: string[];
};
export type ImprintResponse = {
    content_detail: {
        title: string;
        slug: string;
        detail: string;
        clear_detail?: string;
        rtuk?: string;
    };
};

export type RtukItem = { label: string; value: string };
export type RtukGroup = { heading: string; items: RtukItem[] };
export type Rtuk = { title: string; groups: RtukGroup[] };

