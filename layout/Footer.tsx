import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Footer = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.divider} />
            <Text style={styles.text}>
                {'Kanal 7\nMedya Grubu'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 30,
        paddingHorizontal: 16,
    },
    logo: {
        width: 90,
        height: 60,
        tintColor: '#8A8F9A', // logo gri görünsün; renkli kalsın istersen sil
    },
    divider: {
        width: 2,
        height: 50,
        backgroundColor: '#C9CCD3',
        marginHorizontal: 20,
    },
    text: {
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
        lineHeight: 26,
        color: '#6B7280',
    },
});

export default Footer;