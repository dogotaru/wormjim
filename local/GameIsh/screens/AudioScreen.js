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

const namedColors = COLORS.reduce((obj, item) => {
    obj[item.audio] = item
    return obj
}, {});

export default function AudioScreen(props) {

    const [assets] = useState(props.screenProps.assets);
    const [showColorName, setShowColorName] = useState("");

    const [textColorWobble, setTextColorWobble] = useSpring(() => ({
        from: {scale: 0, opacity: 0, height: 0}, to: []
    }));

    useEffect(() => {

        if (showColorName !== "") {

            setTextColorWobble({
                from: {scale: 0, opacity: 0, height: 0},
                to: [
                    {opacity: 1, scale: 1, height: HEIGHT}
                ], config: {easing: "d3-easing"}, reset: true, onRest: () => setShowColorName("")
            });
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
                <View key='background' style={{
                    backgroundColor: namedColors[showColorName].hex, position: "absolute", zIndex: 99,
                    opacity: 0.2, height: HEIGHT, width: WIDTH
                }}/>,
                <TextAnimated key='text'
                              style={{
                                  ...CSS_AUDIO_SCREEN.effect,
                                  // left: textColorWobble.left,
                                  // right: textColorWobble.right,
                                  color: namedColors[showColorName].wobble,
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
                {COLORS.map((item, index) => <FlexButton key={`color_${index}`} ionicon={"md-color-fill"} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80,
                    backgroundColor: item.hex,
                    borderColor: item.wobble,
                    color: 'white'
                }} pushAction={() => {
                    assets.colors[item.audio].replayAsync();
                    setShowColorName(item.audio);
                }}/>)}
                {[
                    {ionicon: 'md-pizza', pushAction: () => assets.eatingAudio.replayAsync()},
                    {ionicon: 'md-pizza', pushAction: () => assets.smackAudio.replayAsync()},
                    {ionicon: 'md-happy', pushAction: () => assets.cheersAudio.replayAsync()},
                    {ionicon: 'md-glasses', pushAction: () => assets.ohYeahAudio.replayAsync()},
                    {ionicon: 'md-hand', pushAction: () => assets.clappingAudio.replayAsync()},
                    {ionicon: 'md-ice-cream', pushAction: () => assets.biteAudio.replayAsync()},
                    {ionicon: 'md-mic', pushAction: () => assets.collectCoinAudio.replayAsync()},
                    {ionicon: 'md-musical-note', pushAction: () => assets.wormBackgroundMusic_level_01.stopAsync()},
                    {ionicon: 'md-musical-note', pushAction: () => assets.homeBackgroundMusic.stopAsync()},
                ].map((item, index) => <FlexButton key={`effect_${index}`} style={{
                    width: 12.5 * WIDTH / 60, height: 12.5 * WIDTH / 60,
                    margin: WIDTH / 80
                }} {...item} />)}
            </View>
        </View>
    );
}