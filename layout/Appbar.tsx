import { View, StyleSheet, Pressable, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import { DrawerHeaderProps } from '@react-navigation/drawer'

import logo from '../assets/logo.png';

const Appbar = ({ navigation }: DrawerHeaderProps) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.appbartop} />

            <View style={styles.appbar}>
                <View style={styles.content}>
                    <Image
                        source={logo}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Pressable
                        onPress={() => navigation.openDrawer()}
                        style={({ pressed }) => [
                            styles.menuButton,
                            pressed && styles.menuButtonPressed,
                        ]}
                        android_ripple={{
                            color: 'rgba(255,255,255,0.25)',
                            borderless: false,
                        }}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel="Menüyü aç"
                    >
                        <Icon color="#fff" size={24} name="menu" />
                    </Pressable>
                </View>

                <View style={styles.accentLine} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'transparent',
        // Gölgenin taşan kısmı kırpılmasın
        paddingBottom: 6,
    },

    appbartop: {
        backgroundColor: '#475569',
        width: '100%',
        height: 8,
    },

    appbar: {
        backgroundColor: '#dc2626',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',

        elevation: 8,
    },

    content: {
        height: 64,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    logo: {
        width: 120,
        height: 48,
    },

    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.16)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    menuButtonPressed: {
        backgroundColor: 'rgba(255,255,255,0.28)',
    },

    accentLine: {
        height: 3,
        backgroundColor: '#991b1b',
    },
})

export default Appbar