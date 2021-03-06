import {StackActions} from 'react-navigation';
import {useFocusState} from 'react-navigation-hooks';
import React, {useEffect, useState} from "react";
import {View, TouchableHighlight, Image} from "react-native";
import {animated, useSpring} from "react-spring";
import {CSS_HOME_SCREEN as CSS} from "../constants/Styles";

const ViewAnimatedCollectible = animated(View);

export default function HomeScreen(props) {

    const [rotate, setRotate] = useSpring(() => ({from: {rotate: "45deg"}}));
    const [collectibleInterval, setCollectibleInterval] = useState(null);
    const [audioTimeout, setAudioTimeout] = useState(null);
    const [assets] = useState(props.screenProps.assets);
    const [isFocused, setIsFocused] = useState(false);
    const focusState = useFocusState();

    const rotateDiamond = () => {

        setRotate({to: [{rotate: "405deg"}, {rotate: "45deg"}], config: {mass: 1, tension: 180, friction: 12}});
    };

    useEffect(() => {

        if (isFocused) {

            rotateDiamond();
            setCollectibleInterval(setInterval(rotateDiamond, 2500));
            setAudioTimeout(setTimeout(() => assets.homeBackgroundMusic.replayAsync(), 1000));
        } else {

            assets.homeBackgroundMusic.stopAsync();
            clearInterval(collectibleInterval);
            clearInterval(audioTimeout);
        }
    }, [isFocused]);

    useEffect(() => {
        setIsFocused(focusState.isFocused);
    }, [focusState]);

    useEffect(() => () => {

        assets.homeBackgroundMusic.stopAsync();
        clearInterval(collectibleInterval);
        clearInterval(audioTimeout);
        setIsFocused(false);
    }, []);

    return <View style={CSS.container}>
        <ViewAnimatedCollectible style={{
            ...CSS.collectible,
            transform: [((_rotate) => { /*console.log('-----------',_rotate);*/
                return _rotate;
            })(rotate)]
        }}/>
        <TouchableHighlight underlayColor={"#ffffff"} onPress={() => {

            const pushAction = StackActions.push({
                routeName: 'Worm'
            });
            assets.homeBackgroundMusic.stopAsync();
            props.navigation.dispatch(pushAction);
        }} title="Play">
            <View style={{resizeMode: "contain"}}><Image
                source={require('../assets/images/play-button.png')}
                style={CSS.playButton}
            /></View>
        </TouchableHighlight>
    </View>;
}