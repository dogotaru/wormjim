import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {CSS_AUDIO_SCREEN, CSS_WORM_SCREEN as CSS} from "../constants/Styles";
import {
    BODY_DIAMETER,
    BORDER_WIDTH,
    HEIGHT,
    TextAnimated,
    WIDTH
} from "../constants/Layout";
import {StackActions} from "react-navigation";
import Button from "../components/Button";
import {useSpring} from "react-spring";
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
                    {opacity: 1, scale: 1/*, height: HEIGHT*/}
                ], config: {easing: "d3-easing"}, reset: true, onRest: () => setShowColorName("")
            });
        }
    }, [showColorName]);

    useEffect(() => () => {
        // COLORS
        assets.wormBackgroundMusic_level_01.stopAsync();
        assets.homeBackgroundMusic.stopAsync();
    }, []);

    return (
        <View style={CSS.container}>

            <Button
                ionicon={"md-home"} position={{left: BORDER_WIDTH, top: BORDER_WIDTH * 5}}
                pushAction={() => props.navigation.popToTop()}/>
            <Button
                ionicon={"md-bug"} position={{left: BORDER_WIDTH, top: BORDER_WIDTH * 3 + BODY_DIAMETER}}
                pushAction={() => props.navigation.dispatch(StackActions.pop(1))}/>

            {(showColorName && showColorName !== "") ? [
                <View key='backgroundTransparent' style={{
                    ...CSS_AUDIO_SCREEN.effect.backgroundTransparent,
                    backgroundColor: namedColors[showColorName].hex
                }}/>,
                <View key='backgroundOpaque' style={CSS_AUDIO_SCREEN.effect.backgroundOpaque}>
                    <TextAnimated key='text' style={{
                        ...CSS_AUDIO_SCREEN.effect.text,
                        color: namedColors[showColorName].wobble,
                        opacity: textColorWobble.opacity,
                        transform: textColorWobble.scale.interpolate({
                            range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                            output: [1, 0.97, 0.9, 1.6, 0.9, 1.4, 1.03, 1]
                        }).interpolate(scale => [{scale}]),
                    }}
                    >{showColorName}</TextAnimated>
                </View>] : null}

            <View style={CSS_AUDIO_SCREEN.effect.buttonsContainerFlex}>
                {COLORS.map((item, index) => <FlexButton key={`color_${index}`} ionicon={"md-color-fill"} style={{
                    ...CSS_AUDIO_SCREEN.effect.button,
                    backgroundColor: item.hex,
                    borderColor: item.wobble,
                    color: 'white'
                }} playAction={() => {
                    setShowColorName(item.audio);
                    return assets.colors[item.audio].replayAsync();
                }} stopAction={() => assets.colors[item.audio].stopAsync()}/>)}
                {[
                    {ionicon: 'md-bug', audio: assets.eatingAudio},
                    {ionicon: 'md-pizza', audio: assets.smackAudio},
                    {ionicon: 'md-happy', audio: assets.cheersAudio},
                    {ionicon: 'md-glasses', audio: assets.ohYeahAudio},
                    {ionicon: 'md-hand', audio: assets.clappingAudio},
                    {ionicon: 'md-ice-cream', audio: assets.biteAudio},
                    {ionicon: 'md-mic', audio: assets.collectCoinAudio},
                    {ionicon: 'md-musical-note', audio: assets.wormBackgroundMusic_level_01},
                    {ionicon: 'md-musical-note', audio: assets.homeBackgroundMusic},
                ].map(({ionicon, audio}, index) =>
                    <FlexButton
                        key={`effect_${index}`} style={CSS_AUDIO_SCREEN.effect.button} ionicon={ionicon}
                        playAction={() => audio.replayAsync()} stopAction={() => audio.stopAsync()}/>
                )}
            </View>
        </View>
    );
}