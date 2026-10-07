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