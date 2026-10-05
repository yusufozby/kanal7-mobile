import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { baseApi } from '../constants/constants';
import Footer from '../layout/Footer';

const tabTitles = ['PAZ', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PZR'];

const BoardCasting = () => {
    const [currentTab, setCurrentTab] = useState('PAZ');
    useEffect(() => {

        const getData = async () => {
            const response = await fetch(baseApi + '/all-schedules.php');
            const json = await response.json();



        };
        getData();
    }, []);
    return (
        <View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                {
                    tabTitles.map((item, i) => (
                        <View style={{ flex: 1 }}>
                            <Pressable onPress={() => setCurrentTab(item)}>

                                <Text style={item === currentTab ? [styles.tabText, styles.activeTabText] : styles.tabText}>{item}</Text>
                                <View style={item === currentTab ? styles.activeTabIndicator : styles.indicator} />
                                <View />

                            </Pressable>
                        </View >
                    ))
                }


            </View>
            <View style={{ backgroundColor: '#DB2227', height: 1, width: '100%' }} >
                <Text>321</Text>
            </View>
            <Footer />
        </View >
    )
}
const styles = StyleSheet.create({
    activeTabText: {
        fontWeight: 'bold',
        color: '#DB2227'
    },
    activeTabIndicator: {
        backgroundColor: '#DB2227',
        height: 2,
        transform: [{ translateY: 0.7 }]
    },
    tabText: {
        fontWeight: 'normal',
        color: '#353535',
        textAlign: 'center',
        marginVertical: 5
    },
    indicator: {
        width: '100%',
        height: 1
    }
});



export default BoardCasting;