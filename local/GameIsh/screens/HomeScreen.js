import {StackActions} from 'react-navigation';
import {useFocusState} from 'react-navigation-hooks';
import React, {useEffect, useState} from "react";
import {View, TouchableHighlight, Image} from "react-native";
import {animated, useSpring} from "react-spring";
import {CSS_HOME_SCREEN as CSS} from "../constants/Styles";

const ViewAnimatedCollectible = animated(View);

export default function HomeScreen(props) {

    const [rotate, setRotate, stopRotate] = useSpring(() => ({from: {rotate: "45deg"}}));
    const [collectibleInterval, setCollectibleInterval] = useState(null);
    const [assets] = useState(props.screenProps.assets);
    const focusState = useFocusState();

    const rotateDiamond = () => {

        setRotate({to: [{rotate: "405deg"}, {rotate: "45deg"}], config: {mass: 1, tension: 180, friction: 12}});
    };

    useEffect(() => {

        if (focusState.isFocused) {

            rotateDiamond();
            setCollectibleInterval(setInterval(rotateDiamond, 2500));
            assets.homeBackgroundMusic.playAsync();
        } else {

            assets.homeBackgroundMusic.stopAsync();
            clearInterval(collectibleInterval);
        }
    }, [focusState]);

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
            <Image
                source={require('../assets/images/play-button.png')}
                style={CSS.button}
            />
        </TouchableHighlight>
    </View>;
}