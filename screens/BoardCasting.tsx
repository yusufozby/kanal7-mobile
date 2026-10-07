import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { baseApi } from '../constants/constants';
import Footer from '../layout/Footer';
import { COLORS } from '../constants/colorschema';

export type ScheduleItem = {
    title: string;
    spot: string;
    link: string;
    slug: string;
    category: { title: string; slug: string };
    images: { thumbnail: string; medium: string; large: string };
    start_hour: string;
    status: string;
};

const tabTitles = ['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CTS', 'PZR'];
const getTodayIndex = () => (new Date().getDay() + 6) % 7;

const BoardCasting = ({ navigation }: { navigation: any }) => {
    const [currentTab, setCurrentTab] = useState<number>(getTodayIndex());
    const [schedules, setSchedules] = useState<ScheduleItem[][]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(baseApi + '/all-schedules.php');
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const json: ScheduleItem[][] = await response.json();
                setSchedules(json);
            } catch (error) {
                console.error('API Error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        getData();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({ title: 'YAYIN AKIŞI' });
    }, [navigation]);

    const items = schedules[currentTab] ?? [];

    return (
        <View style={styles.screen}>
            <View style={styles.tabsRow}>
                {tabTitles.map((title, i) => {
                    const active = i === currentTab;
                    return (
                        <Pressable
                            key={title}
                            style={styles.tab}
                            onPress={() => setCurrentTab(i)}
                        >
                            <Text style={[styles.tabText, active && styles.activeTabText]}>
                                {title}
                            </Text>
                            <View style={active ? styles.activeTabIndicator : styles.indicator} />
                        </Pressable>
                    );
                })}
            </View>
            <View style={styles.tabsLine} />
            {isLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {items.map((item, index) => (
                        <View
                            key={`${item.slug}-${item.start_hour}-${index}`}
                            style={styles.row}
                        >
                            <Text style={styles.time}>{item.start_hour}</Text>

                            <View style={styles.info}>
                                <Text style={styles.category}>{item.category.title}</Text>
                                <Text style={styles.title}>{item.title}</Text>
                            </View>
                        </View>
                    ))}

                    {items.length === 0 && (
                        <Text style={styles.empty}>Bu gün için yayın akışı bulunamadı.</Text>
                    )}

                    <Footer />
                </ScrollView>
            )}
        </View>
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
    },

    tabsRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    tab: {
        flex: 1,
    },
    tabText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f1f1f',
        textAlign: 'center',
        paddingTop: 14,
        paddingBottom: 12,
    },
    activeTabText: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    indicator: {
        width: '100%',
        height: 1.5,
    },
    activeTabIndicator: {
        backgroundColor: COLORS.primary,
        height: 3,
        transform: [{ translateY: 0.75 }],
    },
    tabsLine: {
        backgroundColor: COLORS.primary,
        height: 1.5,
        width: '100%',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    time: {
        width: 84,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    info: {
        flex: 1,
        paddingRight: 12,
    },
    category: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8e8e93',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2b2b3a',
    },
    empty: {
        textAlign: 'center',
        fontSize: 16,
        color: '#8e8e93',
        marginTop: 32,
    },
});

export default BoardCasting;