import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { baseApi, parseSections } from '../constants/constants';
import Footer from '../layout/Footer';
import { COLORS } from '../constants/colorschema';
import { PageData } from '../types/types';

const PAGE_ENDPOINT = `${baseApi}/page-detail.php?slug=`;





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