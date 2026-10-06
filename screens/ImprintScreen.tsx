import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { baseApi } from '../constants/constants';
import Footer from '../layout/Footer';
import { COLORS } from '../constants/colorschema';

/* ---------- Tipler ---------- */
type ImprintResponse = {
    content_detail: {
        title: string;
        slug: string;
        detail: string;
        clear_detail?: string;
        rtuk?: string;
    };
};

type Section = { heading?: string; lines: string[] };
type RtukItem = { label: string; value: string };
type RtukGroup = { heading: string; items: RtukItem[] };
type Rtuk = { title: string; groups: RtukGroup[] };

/* ---------- HTML yardımcıları ---------- */
const NAMED: Record<string, string> = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    rsquo: '’',
    lsquo: '‘',
    ndash: '–',
    mdash: '—',
};

const toText = (html: string): string =>
    html
        .replace(/<[^>]*>/g, '')
        .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
        .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
        .replace(/\s+/g, ' ')
        .trim();

// <h3>BAŞLIK</h3> + <p>satır<br />satır</p> yapısını bölümlere ayırır
const parseSections = (html: string): Section[] => {
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
};

// RTÜK bloğu: başlık + (başlık, <ul><li><span.left>etiket</span> değer</li></ul>) grupları
const parseRtuk = (html: string): Rtuk => {
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

        // Listenin hemen öncesindeki son dolu metin = grup başlığı
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

/* ---------- Ekran ---------- */
const ImprintScreen = ({ navigation }: { navigation: any }) => {
    const [data, setData] = useState<ImprintResponse['content_detail']>();
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({ title: 'KÜNYE' });
    }, [navigation]);

    useEffect(() => {
        let cancelled = false;

        const getData = async () => {
            setIsLoading(true);
            setHasError(false);
            try {
                const response = await fetch(`${baseApi}/about-us.php`);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const json: ImprintResponse = await response.json();
                if (!cancelled) setData(json.content_detail);
            } catch (error) {
                console.error('API Error:', error);
                if (!cancelled) setHasError(true);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        getData();

        return () => {
            cancelled = true;
        };
    }, []);

    const sections = useMemo(() => parseSections(data?.detail ?? ''), [data?.detail]);
    const rtuk = useMemo(
        () => (data?.rtuk ? parseRtuk(data.rtuk) : undefined),
        [data?.rtuk]
    );

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                {hasError || sections.length === 0 ? (
                    <Text style={styles.line}>İçerik yüklenemedi.</Text>
                ) : (
                    sections.map((section, i) => (
                        <View key={i} style={styles.section}>
                            {!!section.heading && (
                                <Text style={styles.heading}>{section.heading}</Text>
                            )}
                            {section.lines.map((line, j) => (
                                <Text key={j} style={styles.line}>
                                    {line}
                                </Text>
                            ))}
                        </View>
                    ))
                )}

                {/* RTÜK - Medya Hizmet Sağlayıcı Kuruluş Kimlik Bilgisi */}
                {!!rtuk && rtuk.groups.length > 0 && (
                    <View style={styles.section}>
                        {!!rtuk.title && <Text style={styles.heading}>{rtuk.title}</Text>}

                        {rtuk.groups.map((group, i) => (
                            <View key={i} style={styles.rtukGroup}>
                                {!!group.heading && (
                                    <Text style={styles.rtukHeading}>{group.heading}</Text>
                                )}
                                {group.items.map((item, j) => (
                                    <Text key={j} style={styles.rtukItem}>
                                        <Text style={styles.rtukLabel}>{item.label} </Text>
                                        {item.value}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <Footer />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 17,
        paddingTop: 13,
    },
    section: {
        marginBottom: 64,
    },
    heading: {
        fontSize: 21,
        lineHeight: 29,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 41,
    },
    line: {
        fontSize: 17,
        lineHeight: 23,
        color: '#000',
    },

    /* RTÜK bloğu */
    rtukGroup: {
        marginBottom: 28,
    },
    rtukHeading: {
        fontSize: 17,
        lineHeight: 23,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    rtukItem: {
        fontSize: 17,
        lineHeight: 23,
        color: '#000',
        marginBottom: 8,
    },
    rtukLabel: {
        fontWeight: 'bold',
    },
});

export default ImprintScreen;