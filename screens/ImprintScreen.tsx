import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { baseApi, parseRtuk, parseSections } from '../constants/constants';
import Footer from '../layout/Footer';
import { COLORS } from '../constants/colorschema';
import { ImprintResponse } from '../types/types';



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