import { View, StyleSheet, Pressable, Image, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import { DrawerHeaderProps } from '@react-navigation/drawer'

import logo from '../assets/logo.png';

const SIDE_WIDTH = 48; // sol (menü) ve sağ (boşluk) aynı genişlikte olsun ki orta alan tam ortalansın

const Appbar = ({ navigation, options }: DrawerHeaderProps) => {
    // Ekranın options.title değeri varsa başlık, yoksa logo gösterilir
    const title = options.title;

    return (
        <View style={styles.appbar}>
            <View style={styles.content}>
                <Pressable
                    style={styles.side}
                    onPress={() => navigation.openDrawer()}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Icon color="#fff" size={32} name="menu" />
                        <Text style={styles.menuText}>MENÜ</Text>
                    </View>
                </Pressable>

                <View style={styles.center}>
                    {title ? (
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    ) : (
                        <Image
                            source={logo}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    )}
                </View>

                <View style={styles.side} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#dc2626',
        overflow: 'hidden',
        padding: 2,
        paddingHorizontal: 6
    },

    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    side: {
        width: SIDE_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    logo: {
        width: 45,
        height: 45,
    },

    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '800',
    },

    menuText: {
        color: '#fff'
    }
})

export default Appbar