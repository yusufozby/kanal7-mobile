import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Entypo';

import { baseApi, fullWidth } from '../constants/constants';
import RenderHTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import { useFocusEffect } from '@react-navigation/native';
import Footer from '../layout/Footer';
import { COLORS } from '../constants/colorschema';

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

const NAMED: Record<string, string> = {
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

const TABS = ['Genel Tanıtım', 'Künye', 'Bölümler'] as const;
type Tab = (typeof TABS)[number];

const VideoCard = ({
    item,
    onPress,
    style,
}: {
    item: SpecialContent;
    onPress: () => void;
    style?: object;
}) => (
    <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.videoCard, style]}
    >
        <Image source={{ uri: item.image }} style={styles.videoImage} />
        <View style={styles.videoShade} />

        <View style={styles.playCircle}>
            <View style={styles.playTriangle} />
        </View>

        <Text style={styles.videoTitle} numberOfLines={2}>
            {decodeHtml(item.title)}
        </Text>
    </TouchableOpacity>
);

const ProgramDetail = ({ route, navigation }: any) => {
    const { program } = route.params;
    const scrollRef = useRef<ScrollView>(null);

    const [contentDetail, setContentDetail] = useState<Program>();
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState<Tab>('Genel Tanıtım');
    const [selected, setSelected] = useState<{ title: string; embed: string } | null>(null);

    useFocusEffect(
        useCallback(() => {
            const getData = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${baseApi}/content-detail.php?slug=${encodeURIComponent(program.slug)}`
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                    }
                    const data: Program = await response.json();
                    console.log('KEYS:', Object.keys(data));
                    console.log('TAG:', JSON.stringify(data.tag));
                    setContentDetail(data);
                    setSelected(null);
                } catch (error) {
                    console.error('API Error:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            getData();
        }, [program.slug])
    );

    const cleanDetail = useMemo(
        () =>
            (contentDetail?.detail ?? '')
                .replace(/<p>(\s|&nbsp;)*<\/p>/gi, '')
                .trim(),
        [contentDetail?.detail]
    );

    const episodes = contentDetail?.['special-content'] ?? [];
    const current = selected ?? contentDetail?.izle7_content;

    const playVideo = (item: SpecialContent) => {
        setSelected({ title: item.title, embed: item.embed });
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    // Geri butonlu appbar (navigator'da headerShown: false olduğu için burada çiziliyor)
    const backBar = (
        <View style={styles.appbar}>
            <Pressable
                style={styles.backButton}
                hitSlop={8}
                onPress={() => navigation.goBack()}
            >
                <Icon name="chevron-left" size={34} color="#fff" />
            </Pressable>
        </View>
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {backBar}
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {backBar}

            <ScrollView
                ref={scrollRef}
                style={styles.screen}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <ImageBackground
                    style={styles.imageBackground}
                    source={{ uri: program.images.default }}
                >
                    {!!(contentDetail?.time ?? program.time) && (
                        <Text style={styles.heroTime}>
                            {contentDetail?.time ?? program.time}
                        </Text>
                    )}
                </ImageBackground>

                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {decodeHtml(contentDetail?.title ?? program.title)}
                        </Text>
                        <View style={styles.cardDivider} />

                        <View style={styles.cardBody}>
                            {!!contentDetail?.spot && (
                                <RenderHTML
                                    contentWidth={fullWidth - fullWidth * 0.041 * 2 - 16 * 2}
                                    source={{ html: contentDetail.spot }}
                                    baseStyle={styles.cardSpot}
                                    tagsStyles={{ p: { marginTop: 0, marginBottom: 0 } }}
                                />
                            )}
                            {!!current?.title && (
                                <Text style={styles.cardEpisode}>
                                    {decodeHtml(current.title)}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                {!!current?.embed && (
                    <View style={styles.player}>
                        <WebView
                            key={current.embed}
                            source={{ uri: current.embed }}
                            allowsFullscreenVideo
                            allowsInlineMediaPlayback
                            mediaPlaybackRequiresUserAction={false}
                            javaScriptEnabled
                            startInLoadingState
                            scrollEnabled={false}
                            renderLoading={() => (
                                <View style={styles.playerLoader}>
                                    <ActivityIndicator color={COLORS.primary} />
                                </View>
                            )}
                        />
                    </View>
                )}

                <View style={styles.tabsWrap}>
                    <View style={styles.tabsRow}>
                        {TABS.map((t) => {
                            const active = t === tab;
                            return (
                                <TouchableOpacity
                                    key={t}
                                    style={styles.tab}
                                    activeOpacity={0.7}
                                    onPress={() => setTab(t)}
                                >
                                    <Text style={styles.tabText}>{t}</Text>
                                    {active && (
                                        <>
                                            <View style={styles.tabBar} />
                                            <View style={styles.tabArrow} />
                                        </>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={styles.tabsLine} />
                </View>

                {tab === 'Genel Tanıtım' && (
                    <>
                        {episodes.length > 0 && (
                            <FlatList
                                data={episodes}
                                horizontal
                                keyExtractor={(item) => item.embed}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.hList}
                                initialNumToRender={4}
                                windowSize={5}
                                renderItem={({ item }) => (
                                    <VideoCard
                                        item={item}
                                        style={{ marginRight: fullWidth * 0.038 }}
                                        onPress={() => playVideo(item)}
                                    />
                                )}
                            />
                        )}

                        {!!cleanDetail && (
                            <View style={styles.textBlock}>
                                <RenderHTML
                                    contentWidth={fullWidth - fullWidth * 0.038 * 2}
                                    source={{ html: cleanDetail }}
                                    baseStyle={styles.bodyText}
                                    tagsStyles={{ p: { marginTop: 0, marginBottom: 22 } }}
                                />
                            </View>
                        )}
                    </>
                )}

                {tab === 'Künye' && (
                    <View style={[styles.textBlock, { marginTop: 24 }]}>
                        {contentDetail?.tag &&
                            contentDetail.tag.replace(/<[^>]*>|&nbsp;|\s/gi, '').length > 0 ? (
                            <RenderHTML
                                contentWidth={fullWidth - fullWidth * 0.038 * 2}
                                source={{ html: contentDetail.tag }}
                                baseStyle={styles.bodyText}
                                tagsStyles={{ p: { marginTop: 0, marginBottom: 14 } }}
                            />
                        ) : (
                            <Text style={styles.bodyText}>Künye bilgisi bulunamadı.</Text>
                        )}
                    </View>
                )}

                {tab === 'Bölümler' && (
                    <View style={styles.grid}>
                        {episodes.map((item) => (
                            <VideoCard
                                key={item.embed}
                                item={item}
                                style={{ marginBottom: fullWidth * 0.038 }}
                                onPress={() => playVideo(item)}
                            />
                        ))}
                        {episodes.length === 0 && (
                            <Text style={styles.bodyText}>Bölüm bulunamadı.</Text>
                        )}
                    </View>
                )}

                <Footer />
            </ScrollView>
        </View>
    );
};

export default ProgramDetail;

const styles = StyleSheet.create({
    /* Appbar (sadece geri butonu) */
    appbar: {
        backgroundColor: '#dc2626',
        paddingVertical: 6,
        paddingHorizontal: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

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

    imageBackground: {
        width: fullWidth,
        height: 230,
    },
    heroTime: {
        position: 'absolute',
        left: fullWidth * 0.041 + 16,
        bottom: 84 + 10,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    cardContainer: {
        paddingHorizontal: fullWidth * 0.041,
        marginTop: -84,
    },
    card: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        paddingTop: 16,
        paddingBottom: 20,
        overflow: 'hidden',
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 21,
        color: '#2b2b3a',
        marginHorizontal: 16,
    },
    cardDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#e6e6e6',
        marginTop: 14,
        marginBottom: 18,
    },
    cardBody: {
        paddingHorizontal: 16,
    },
    cardSpot: {
        fontSize: 16,
        lineHeight: 19,
        color: '#2b2b3a',
    },
    cardEpisode: {
        marginTop: 34,
        fontSize: 17,
        color: '#2b2b3a',
    },
    player: {
        width: fullWidth,
        height: (fullWidth * 9) / 16,
        backgroundColor: '#000',
    },
    playerLoader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    tabsWrap: {
        paddingHorizontal: fullWidth * 0.038,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    tabsRow: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 6,
        paddingBottom: 14,
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: COLORS.primary,
    },
    tabArrow: {
        position: 'absolute',
        bottom: 3,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 9,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: COLORS.primary,
    },
    tabsLine: {
        height: 1.5,
        backgroundColor: COLORS.primary,
        marginTop: -1.5,
    },
    hList: {
        paddingLeft: fullWidth * 0.038,
        paddingRight: fullWidth * 0.038,
        paddingTop: 22,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: fullWidth * 0.038,
        paddingTop: 22,
    },
    videoCard: {
        width: fullWidth * 0.44,
        height: fullWidth * 0.44 * 0.6,
        backgroundColor: '#222',
        overflow: 'hidden',
    },
    videoImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    videoShade: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.28)',
    },
    playCircle: {
        position: 'absolute',
        top: 14,
        left: 14,
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playTriangle: {
        marginLeft: 2,
        width: 0,
        height: 0,
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderLeftWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#fff',
    },
    videoTitle: {
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 8,
        color: '#fff',
        fontSize: 13,
        lineHeight: 17,
    },
    textBlock: {
        paddingHorizontal: fullWidth * 0.038,
        marginTop: 50,
    },
    bodyText: {
        fontSize: 18,
        lineHeight: 28,
        color: '#111',
    },
});