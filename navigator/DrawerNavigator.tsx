import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Appbar from '../layout/Appbar';
import Home from '../screens/Home';
import ProgramDetail from '../screens/ProgramDetail';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LiveStream from '../screens/LiveStream';
import BoardCasting from '../screens/BoardCasting';
import Frequencies from '../screens/Frequencies';
import ImprintScreen from '../screens/ImprintScreen';
import ContactScreen from '../screens/ContactPage';
const Drawer = createDrawerNavigator();
type MenuItem = {
    label: string;
    icon: string;
    route: string;
    divider?: boolean; // item'ın ALTINDA çizgi gösterilsin mi
};

const MENU_ITEMS: MenuItem[] = [
    { label: 'Ana Sayfa', icon: 'home-outline', route: 'home' },
    { label: 'Canlı Yayın', icon: 'television-play', route: 'liveStream', divider: true },
    { label: 'Yayın Akışı', icon: 'clock-outline', route: 'boardCasting', divider: true },
    { label: 'Frekans Bilgileri', icon: 'access-point', route: 'frequency', divider: true },
    { label: 'Yayıncı Künye Bilgileri', icon: 'account-group', route: 'publisher', divider: true },
    { label: 'Bize Ulaşın', icon: 'map-marker', route: 'contact' },
];



const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
    const insets = useSafeAreaInsets();
    const activeRoute = state.routes[state.index].name;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.logoWrapper}>
                <Image
                    source={require('../assets/image.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.menu}>
                {MENU_ITEMS.map((item, index) => {
                    const isActive = activeRoute === item.route;
                    const isLast = index === MENU_ITEMS.length - 1;
                    return (
                        <View key={item.route}>
                            <TouchableOpacity
                                style={styles.item}
                                activeOpacity={0.6}
                                onPress={() => {
                                    navigation.navigate(item.route);
                                    navigation.closeDrawer();
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={item.icon}
                                    size={24}
                                    color={isActive ? '#DB2227' : '#7B7F8C'}
                                    style={styles.icon}
                                />
                                <Text style={[styles.label, isActive && styles.labelActive]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                            {!isLast && <View style={styles.divider} />}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F3F7',
    },
    logoWrapper: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    logo: {
        width: 70,
        height: 50,
    },
    menu: {
        marginTop: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    icon: {
        width: 32,
        textAlign: 'center',
    },
    label: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#7B7F8C',
    },
    labelActive: {
        color: '#DB2227',
    },
    divider: {
        height: StyleSheet.hairlineWidth * 2,
        backgroundColor: '#C9CBD3',
        marginHorizontal: 16,
    },
});

export default function DrawerNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <DrawerContent {...props} />}
                screenOptions={{
                    drawerPosition: 'left',
                    header: (props) => <Appbar {...props} />
                }}
            >
                <Drawer.Screen component={Home} name='home' />
                <Drawer.Screen component={ProgramDetail} options={{ headerShown: false }} name='programDetail' />
                <Drawer.Screen component={LiveStream} name='liveStream' options={{ headerShown: false }} />
                <Drawer.Screen component={BoardCasting} name='boardCasting' />
                <Drawer.Screen component={Frequencies} name='frequency' />
                <Drawer.Screen component={ImprintScreen} name='publisher' />
                <Drawer.Screen component={ContactScreen} name='contact' />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}



