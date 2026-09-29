import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native';
import Appbar from '../layout/Appbar';
import Home from '../screens/Home';

const Drawer = createDrawerNavigator();

const DrawerContent = () => {
    return <View />
};
export default function DrawerNavigator() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={() => <DrawerContent />}
                screenOptions={{
                    drawerPosition: 'right',
                    header: (props) => <Appbar {...props} />
                }}
            >
                <Drawer.Screen component={Home} name='home' />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}