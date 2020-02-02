import {StackActions} from 'react-navigation';
import React, {PureComponent, useEffect, useState} from "react";
import {StyleSheet, View, Button, Text, TouchableHighlight, Image, AppRegistry, StatusBar} from "react-native";
import {animated, useSpring} from "react-spring";

const ViewAnimatedCollectible = animated(View);

export default function HomeScreen(props) {

    const [rotate, setRotate, stopRotate] = useSpring(() => ({from: {rotate: "45deg"}}));
    const [collectibleInterval, setCollectibleInterval] = useState(null);

    useEffect(() => {

        setCollectibleInterval(setInterval(() => {

            setRotate({to: [{rotate: "405deg"}, {rotate: "45deg"}], config: {mass: 1, tension: 180, friction: 12}});
        }, 3000));
        return () => {

            clearInterval(collectibleInterval);
        }
    }, []);

    return <View style={styles.container}>
        <ViewAnimatedCollectible style={{
            ...styles.collectible,
            transform: [((_rotate) => { /*console.log('-----------',_rotate);*/
                return _rotate;
            })(rotate)]
        }}/>
        <TouchableHighlight underlayColor={"#ffffff"} onPress={() => {

            const pushAction = StackActions.push({
                routeName: 'Worm'
            });
            props.navigation.dispatch(pushAction);
        }} title="Play">
            <Image
                source={require('../assets/images/play-button.png')}
                style={styles.button}
            />
        </TouchableHighlight>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: "#ffffff"
    },
    button: {
        height: 140, resizeMode: 'center'
    },
    collectible: {
        backgroundColor: "#83ff00",
        borderColor: "#FF75F9",
        borderWidth: 10,
        width: 100,
        height: 100,
        zIndex: 1
    }
});