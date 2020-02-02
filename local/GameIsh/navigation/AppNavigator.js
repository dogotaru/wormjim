import React from 'react';
import {Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import WormScreen from "../screens/WormScreen";

const config = Platform.select({
    web: {headerMode: 'screen'},
    default: {},
});

const WormStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: {
                headerShown: false
            }
        },
        Worm: {
            screen: WormScreen, //HomeScreen,
            navigationOptions: {
                headerShown: false
            }
        }
    },
    config
);
WormStack.path = '';

export default createAppContainer(WormStack);