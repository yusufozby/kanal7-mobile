// Resimlerin ortak yapısını temsil eden interface
export interface ImageSet {
    default: string;
    thumbnail: string;
    medium: string;
    large: string;
}

// Program detaylarının yapısını temsil eden interface
export interface ProgramDetail {
    program_status: string;
    program_day: string;
    program_time: string;
}

// Kategori bilgisini temsil eden interface (streaming ve highlights kısımlarında kullanılıyor)
export interface Category {
    title: string;
    slug: string;
}

// "headlines" dizisindeki her bir elemanın yapısı
export interface Headline {
    title: string;
    link: string;
    slug: string;
    images: ImageSet;
    program_detail: ProgramDetail;
}

// "streaming" dizisindeki her bir elemanın yapısı
export interface StreamingItem {
    title: string;
    spot: string;
    link: string;
    slug: string;
    category: Category;
    images: ImageSet;
    start_hour: string;
    status: string;
}

// "highlights_day" ve "highlights_week" dizilerindeki her bir elemanın yapısı
export interface Highlight {
    title: string;
    spot: string;
    link: string;
    slug: string;
    category: Category;
    images: ImageSet;
    start_hour: string;
    status: string;
}

// Tüm JSON verisinin ana yapısını temsil eden interface
export interface Kanal7Data {
    headlines: Headline[];
    streaming: StreamingItem[];
    highlights_day: Highlight[] | null; // JSON'da null olabilir
    highlights_week: Highlight[] | null; // JSON'da null olabilir
    dailymotion_id: string;
    live_stream_url: string;
}