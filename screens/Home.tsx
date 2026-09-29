import {
    ActivityIndicator,
    ImageBackground,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'

import React, { useEffect, useRef, useState } from 'react'
import { Kanal7Data } from '../types/kanal7-data'
import { fullWidth } from '../constants/constants';
import { API_KEY, API_URL } from '@env';

const SLIDE_WIDTH = fullWidth - 16;
const HERO_HEIGHT = 280;

type HeroSliderProps = {
    headlines: Kanal7Data['headlines']
}

const HeroSlider = ({ headlines }: HeroSliderProps) => {
    const scrollRef = useRef<ScrollView>(null)
    const indexRef = useRef(0)
    const [activeIndex, setActiveIndex] = useState(0)

    // Otomatik kaydırma
    useEffect(() => {
        const total = headlines.length
        if (!total) return

        indexRef.current = 0
        setActiveIndex(0)
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: false })

        const interval = setInterval(() => {
            const next = (indexRef.current + 1) % total
            indexRef.current = next
            setActiveIndex(next)

            scrollRef.current?.scrollTo({
                x: next * SLIDE_WIDTH,
                y: 0,
                animated: true,
            })
        }, 4000)

        return () => clearInterval(interval)
    }, [headlines])

    // Elle kaydırınca noktalar ve sayaç güncellensin
    const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH)
        indexRef.current = index
        setActiveIndex(index)
    }

    return (
        <View style={styles.sliderWrapper}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScrollEnd}
            >
                {headlines.map((item, index) => (
                    <Pressable
                        key={item.slug}
                        style={styles.slide}
                    // onPress={() => navigation.navigate('Detail', { slug: item.slug })}
                    >
                        <View style={styles.heroContainer}>
                            <ImageBackground
                                source={{ uri: item.images.default }}
                                resizeMode="cover"
                                style={styles.heroImage}
                            >
                                <View style={styles.overlayBottom} />

                                <View style={styles.counterBadge}>
                                    <Text style={styles.counterText}>
                                        {index + 1} / {headlines.length}
                                    </Text>
                                </View>

                                <View style={styles.bottomContent}>
                                    <View style={styles.categoryBadge}>
                                        <Text style={styles.categoryText}>
                                            GÜNDEM
                                        </Text>
                                    </View>

                                    <Text
                                        style={styles.title}
                                        numberOfLines={3}
                                    >
                                        {item.title}
                                    </Text>

                                    <Text style={styles.readMore}>
                                        {item.program_detail.program_time}
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>

            <View style={styles.dots}>
                {headlines.map((item, index) => (
                    <View
                        key={item.slug}
                        style={[
                            styles.dot,
                            index === activeIndex && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    )
}

const Home = () => {
    const [data, setData] = useState<Kanal7Data>()

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(API_URL + '/main-page.php')
                const json: Kanal7Data = await response.json()
                setData(json)
            } catch (error) {
                console.log('HATA:', error)
            }
        }

        getData()
    }, [])

    const headlines = data?.headlines ?? []

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.screenContent}
            showsVerticalScrollIndicator={false}
        >
            {headlines.length ? (
                <HeroSlider headlines={headlines} />
            ) : (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#dc2626" />
                </View>
            )}

        </ScrollView>
    )
}

export default Home

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    screenContent: {
        padding: 8,
        paddingBottom: 24,
    },

    // Sadece slider alanı; flex:1 yok, içeriği kadar yer kaplar
    sliderWrapper: {
        width: SLIDE_WIDTH,
    },

    // Yüklenirken aynı yüksekliği tutar, içerik zıplamaz
    loading: {
        width: SLIDE_WIDTH,
        height: HERO_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },

    slide: {
        width: SLIDE_WIDTH,
    },

    heroContainer: {
        width: '100%',
        height: HERO_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#e5e5e0',

        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },

    heroImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },



    overlayBottom: {
        ...StyleSheet.absoluteFillObject,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },

    counterBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.55)',
    },

    counterText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    bottomContent: {
        paddingHorizontal: 18,
        paddingBottom: 18,
    },

    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#dc2626',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 10,
    },

    categoryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },

    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '900',
        lineHeight: 28,
        letterSpacing: -0.3,
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },

    readMore: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.8,
        marginTop: 12,
    },

    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#d0d0d0',
        marginHorizontal: 3,
    },

    activeDot: {
        width: 22,
        backgroundColor: '#dc2626',
    },
})