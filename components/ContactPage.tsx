import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { baseApi } from '../constants/constants';
import Footer from '../layout/Footer';
import { COLORS } from '../constants/colorschema';

const PAGE_ENDPOINT = `${baseApi}/page-detail.php?slug=`;

type PageData = {
    title: string;
    slug: string;
    detail: string;
    clear_detail?: string;
};

type Section = {
    heading?: string;
    lines: string[];
};
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
};

type Props = {
    navigation: any;
    slug: string;
    title: string;
};

const ContentPage = ({ navigation, slug, title }: Props) => {
    const [data, setData] = useState<PageData>();
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({ title });
    }, [navigation, title]);

    useEffect(() => {
        let cancelled = false;

        const getData = async () => {
            setIsLoading(true);
            setHasError(false);
            try {
                const response = await fetch(baseApi + "/contact.php");
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const json = await response.json();
                if (!cancelled) setData(json.content_detail ?? json);
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
    }, [slug]);

    const sections = useMemo(() => parseSections(data?.detail ?? ''), [data?.detail]);

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
});

export default ContentPage;