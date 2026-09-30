import { View, StyleSheet, Pressable, Image, StatusBar, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import { DrawerHeaderProps } from '@react-navigation/drawer'

import logo from '../assets/logo.png';

const Appbar = ({ navigation }: DrawerHeaderProps) => {
    return (
        <>


            <View style={styles.appbar}>
                <View style={styles.content}>
                    <Pressable
                        onPress={() => navigation.openDrawer()}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Icon color="#fff" size={32} name="menu" />
                            <Text style={styles.menuText}>MENÜ</Text>
                        </View>
                    </Pressable>

                    <Image
                        source={logo}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </>
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
        justifyContent: 'space-between',
    },

    logo: {
        width: 45,
        height: 45,
        margin: 'auto',
        transform: 'translateX(-10px)'
    },
    menuText: {
        color: '#fff'
    }

})

export default Appbar