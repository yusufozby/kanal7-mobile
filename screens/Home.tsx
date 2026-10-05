import {
    ImageBackground,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native'

import React, { useEffect, useRef, useState } from 'react'
import { Kanal7Data } from '../types/kanal7-data'
import { API_URL } from '@env';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import { fullWidth } from '../constants/constants';
import { COLORS } from '../constants/colorschema';
import Feather from 'react-native-vector-icons/Feather';
import Footer from '../layout/Footer';
import { decode } from 'html-entities';

const Home = ({ navigation }: { navigation: any }) => {
    const [data, setData] = useState<Kanal7Data>();
    const [pagination, setPagination] = useState(0);
    const { width } = useWindowDimensions();

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(API_URL + '/main-page.php')
                let json: Kanal7Data = await response.json()
                json.headlines = json.headlines.map((headline) => (
                    {
                        ...headline,
                        title: decode(headline.title)
                    }
                ));
                setData(json)
            } catch (error) {
                console.log('HATA:', error)
            }
        }

        getData()
    }, []);

    const onScrollMount = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / fullWidth);
        setPagination(index);
    };
    useEffect(() => {
        if (!data?.headlines?.length) return;

        const interval = setInterval(() => {
            setPagination(prev => {
                const nextIndex = prev + 1 >= data.headlines.length ? 0 : prev + 1;

                scrollRef.current?.scrollTo({
                    x: nextIndex * fullWidth,
                    animated: true,
                });

                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [data]);

    return (
        <ScrollView style={{ flex: 1 }}>
            <LinearGradient
                colors={['#2563EB', '#7C3AED', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ padding: 10, paddingBottom: 30 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name='play-circle-outline' size={32} color={'#fff'} />
                    <Text style={styles.liveText}>CANLI YAYIN</Text>
                </View>

                <WebView
                    source={{ uri: 'https://www.kanal7.com/canli-yayin-iframe.php' }}
                    style={{ height: 200 }}
                    allowsFullscreenVideo
                    mediaPlaybackRequiresUserAction={false}
                />
            </LinearGradient>
            <View>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    onMomentumScrollEnd={onScrollMount}
                    showsHorizontalScrollIndicator={false}
                >
                    {data?.headlines?.map((program, index) => (
                        <Pressable onPress={() => {
                            navigation.navigate('programDetail', { program });
                        }}>
                            <ImageBackground
                                key={index}
                                style={{ width: fullWidth, height: 200 }}
                                source={{ uri: program.images.default }}
                                resizeMode="cover"
                            >
                                <View style={styles.ImageBackgroundTextContainer}>
                                    <Text style={styles.ImageBackgroundText}>{program.title}</Text>
                                </View>
                            </ImageBackground>
                        </Pressable>
                    ))}
                </ScrollView>
                <View style={styles.paginatorRow}>
                    {data?.headlines?.map((_, i) => (
                        <View
                            key={i}
                            style={pagination === i ? [styles.paginator, styles.paginatorActive] : styles.paginator}
                        />
                    ))}
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#353535' }}>YAYIN AKIŞI</Text>
                <Feather name="clock" style={{ marginLeft: 8 }} size={24} />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scheduleContainer}
            >
                {data?.streaming?.map((item, i) => (
                    <View key={i} style={styles.scheduleItemWrapper}>
                        <View style={styles.scheduleItem}>
                            <Text style={styles.scheduleTime}>{item.start_hour}</Text>
                            <View style={styles.scheduleLine} />
                            <Text style={styles.scheduleTitle} numberOfLines={2}>
                                {item.title}
                            </Text>
                        </View>
                        <View style={styles.scheduleDivider} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.featuredHeader}>
                <Feather name="calendar" size={28} color="#fff" />
                <Text style={styles.featuredHeaderText}>BUGÜNÜN ÖNE ÇIKANLARI</Text>
            </View>

            {data?.highlights_day?.map((item, i) => {
                const statusText = item.status?.trim() ? item.status.trim() : 'BUGÜN';

                return (
                    <ImageBackground
                        key={i}
                        source={{ uri: item.images.default }}
                        style={styles.featuredCard}
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.featuredOverlay}
                        >
                            <View style={styles.featuredRow}>
                                <Text style={styles.featuredLive}>{statusText}</Text>
                                <Text style={styles.featuredTime}>{item.start_hour}</Text>
                            </View>
                            <View style={styles.featuredLine} />
                            <Text style={styles.featuredTitle}>{item.title}</Text>
                        </LinearGradient>
                    </ImageBackground>
                );
            })}
            <Footer />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    liveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24,
        marginVertical: 8,
        marginLeft: 5,
        fontFamily: 'Poppins-Medium',
    },
    paginatorRow: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    paginator: {
        backgroundColor: '#fff',
        width: 7,
        height: 7,
        borderRadius: 3.5,
    },
    paginatorActive: {
        backgroundColor: COLORS.primary,
    },
    ImageBackgroundTextContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        backgroundColor: COLORS.primary,
        padding: 5,
    },
    ImageBackgroundText: {
        color: '#FFF',
        fontWeight: 'bold',
    },

    scheduleContainer: {
        backgroundColor: '#EEF0F4',
    },
    scheduleItemWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 14,
    },
    scheduleItem: {
        width: 150,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    scheduleTime: {
        fontFamily: 'Poppins-Bold',
        fontSize: 22,
        color: COLORS.primary,
    },
    scheduleLine: {
        width: 50,
        height: 3,
        backgroundColor: '#8A8F9A',
        borderRadius: 2,
        marginVertical: 8,
    },
    scheduleTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: '#353535',
        textAlign: 'center',
    },
    scheduleDivider: {
        width: 2,
        height: 45,
        backgroundColor: '#C9CCD3',
        marginTop: 8,
    },

    featuredHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    featuredHeaderText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    featuredCard: {
        width: fullWidth,
        height: 200,
        justifyContent: 'flex-end',
        marginBottom: 2,
    },
    featuredOverlay: {
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 14,
    },
    featuredRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredLive: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    featuredTime: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    featuredLine: {
        height: 1,
        backgroundColor: '#fff',
        marginVertical: 8,
    },
    featuredTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default Home;