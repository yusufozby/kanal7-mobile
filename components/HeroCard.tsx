import { View, Text, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native'
import React from 'react'

type HeroCardProps = {
    image: ImageSourcePropType
    time: string
    title: string
    subtitle?: string
}

const HeroCard = ({ image, time, title, subtitle }: HeroCardProps) => {
    return (
        <ImageBackground
            source={image}
            style={styles.container}
            imageStyle={styles.image}
            resizeMode="cover"
        >
            {/* Açık renkli görsellerde beyaz yazı okunsun diye koyu katman */}
            <View style={styles.overlay} />

            <View style={styles.content}>
                <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{time}</Text>
                </View>

                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                {subtitle ? (
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {subtitle}
                    </Text>
                ) : null}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 280,
        justifyContent: 'flex-end',
        backgroundColor: '#e5e5e0',
        overflow: 'hidden',
    },

    image: {
        width: '100%',
        height: '100%',
    },

    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },

    content: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },

    timeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#dc2626',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginBottom: 10,
    },

    timeText: {
        color: '#fff',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: -0.5,
    },

    title: {
        color: '#fff',
        fontSize: 34,
        fontWeight: '900',
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },

    subtitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        marginTop: 2,
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
})

export default HeroCard

/* Kullanım:
<HeroCard
    image={require('../assets/gelin.jpg')}
    time="19:00"
    title="Dizi ‘Gelin’"
    subtitle="Her gün – yeni bölüm"
/>
*/