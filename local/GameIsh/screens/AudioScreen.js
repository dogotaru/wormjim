import React, {useEffect, useState, useCallback, useRef} from "react";
import {StyleSheet, Dimensions, StatusBar, View, Image, Text, TouchableHighlight} from "react-native";
import {GameLoop} from "react-native-game-engine";
import {useFocusState} from 'react-navigation-hooks';
import Worm from "../components/Worm";
import {CSS_AUDIO_SCREEN, CSS_WORM_SCREEN as CSS} from "../constants/Styles";
import {
    BODY_DIAMETER,
    BORDER_WIDTH,
    HEIGHT,
    ImageAnimated, INDEX_MOD,
    TextAnimated,
    ViewAnimated,
    WIDTH
} from "../constants/Layout";
import {StackActions} from "react-navigation";
import {Ionicons} from '@expo/vector-icons';
import {TouchableWithoutFeedback} from "react-native";
import Button from "../components/Button";
import {useSpring, useTransition, animated, interpolate} from "react-spring";
import FlexButton from "../components/FlexButton";
import {COLORS} from "../constants/Colors";

export default function AudioScreen(props) {

    const [assets] = useState(props.screenProps.assets);
    const [showColorName, setShowColorName] = useState("");
    const [firstClickAudio, setFirstClickAudio] = useState(false);
    const [{x, y}, setXY] = useState({x: WIDTH / 2, y: HEIGHT / 2});
    // const [delta, setDelta] = useState({x: 0, y: 0});
    const focusState = useFocusState();

    const [textColorWobble, setTextColorWobble] = useSpring(() => ({
        from: {scale: 0/*, right: -WIDTH * 1.5*/, opacity: 0, height: 0}, to: []
    }));

    useEffect(() => {

        if (showColorName !== "") {
            console.log(showColorName);
            setTextColorWobble({
                to: [
                    /*{right: 0, opacity: 1},*/
                    {opacity: 1, scale: 1, height: HEIGHT}, {scale: 1}, {scale: 0, opacity: 0, height: 0},
                    /*{right: WIDTH * 1.5, opacity: 0},*/
                    /*{right: -WIDTH * 1.5,}, {opacity: 1}*/
                ], config: {easing: "d3-easing"}
            });
            setTimeout(() => {

                setShowColorName("");
            }, 2000);
        }
    }, [showColorName]);

    return (
        <View style={CSS.container}>

            <Button
                ionicon={"md-home"} position={{left: BORDER_WIDTH, top: BORDER_WIDTH * 5}}
                pushAction={() => props.navigation.popToTop()}/>
            <Button
                ionicon={"md-bug"} position={{left: BORDER_WIDTH, top: BORDER_WIDTH * 3 + BODY_DIAMETER}}
                pushAction={() => props.navigation.dispatch(StackActions.pop(1))}/>

            {(showColorName && showColorName !== "") ? [
                <View style={{
                    backgroundColor: "white", position: "absolute", zIndex: 99,
                    opacity: 0.7, height: HEIGHT, width: WIDTH
                }}/>,
                <TextAnimated
                    style={{
                        ...CSS_AUDIO_SCREEN.effect,
                        // left: textColorWobble.left,
                        // right: textColorWobble.right,
                        // color: COLORS[showColorName].wobble,
                        // textShadowColor: COLORS[(trailLength - 1) % INDEX_MOD].hex,
                        opacity: textColorWobble.opacity,
                        transform: textColorWobble.scale.interpolate({
                            range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                            output: [1, 0.97, 0.9, 1.6, 0.9, 1.4, 1.03, 1]
                        }).interpolate(scale => [{scale}]),
                    }}
                >{showColorName}</TextAnimated>] : null}

            <View style={{
                height: HEIGHT,
                width: WIDTH,
                display: "flex",
                flexDirection: 'row',
                flex: 1,
                // justifyContent: "space-evenly",
                alignContent: "center",
                alignItems: 'center',
                flexWrap: 'wrap',
                padding: WIDTH / 30
            }}>
                {COLORS.map((item, index) => <FlexButton key={index}
                                                         ionicon={"md-color-fill"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80,
                    backgroundColor: item.hex,
                    borderColor: item.wobble,
                    color: 'white'
                }}
                                                         pushAction={() => {
                                                             assets.colors[item.audio].replayAsync();
                                                             setShowColorName(item.audio);
                                                             console.log(1);
                                                         }}/>)}

                <FlexButton
                    ionicon={"md-pizza"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.eatingAudio.replayAsync()}/>
                <FlexButton
                    ionicon={"md-pizza"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.smackAudio.replayAsync()}/>
                <FlexButton
                    ionicon={"md-happy"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.cheersAudio.replayAsync()}/>
                <FlexButton
                    ionicon={"md-glasses"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.ohYeahAudio.replayAsync()}/>
                <FlexButton
                    ionicon={"md-hand"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.clappingAudio.replayAsync()}/>
                <FlexButton
                    ionicon={"md-ice-cream"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.biteAudio.replayAsync()}/>
                <FlexButton
                    ionicon={"md-mic"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.collectCoinAudio.replayAsync()}/>
                <FlexButton
                    ionicon={"md-musical-note"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.wormBackgroundMusic_level_01.stopAsync()}/>
                <FlexButton
                    ionicon={"md-musical-note"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }}
                    pushAction={() => assets.homeBackgroundMusic.stopAsync()}/>
            </View>
        </View>
    );
}