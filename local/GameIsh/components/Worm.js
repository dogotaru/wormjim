import React, {useEffect, useState} from "react";

import {StyleSheet, View, Dimensions, Animated, Easing} from "react-native";
import {useTrail, animated, useSpring} from 'react-spring'
import {Asset} from "expo-asset";
import * as Font from "expo-font";
import {Ionicons} from "@expo/vector-icons";
import {Audio} from "expo-av";

const ViewAnimatedSpring = animated(View);
const ViewAnimatedCollectible = animated(View);
const {width: WIDTH, height: HEIGHT} = Dimensions.get("window");
const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.085);
const HALF_DIAMETER = BODY_DIAMETER / 2;
const MAX_WIDTH = Math.floor(WIDTH - HALF_DIAMETER);
const MAX_HEIGHT = Math.floor(HEIGHT - HALF_DIAMETER);
const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.1);
const COLORS = ["#86E9BE", "#8DE986", "#B8E986", "#E9E986", "#86E9BE", "#8DE986", "#B8E986", "#E9E986", "#86E9BE", "#8DE986", "#B8E986"];
// const BORDER_COLORS = ["#C0F3DD", "#C4F6C0", "#E5FCCD", "#FCFDC1"];

export default function Worm(props) {

    const [{x, y}, setXY] = useState({x: 0, y: 0});
    const [trailLength, setTrailLength] = useState(2);
    const [trail, setTrail, stopTrail] = useTrail(trailLength, () => ({left: x, top: y}));
    const [rotate, setRotate, stopRotate] = useSpring(() => ({ from: { rotate: "45deg" } }));
    const [collectiblePosition, setCollectiblePosition] = useState(null);
    const [consumeCollectible, setConsumeCollectible] = useState(false);
    const [needCollectible, setNeedCollectible] = useState(false);
    const [biteAudio, setBiteAudio] = useState(null);
    const [eatingAudio, setEatingAudio] = useState(null);
    const [cheersAudio, setCheersAudio] = useState(null);
    const [smackAudio, setSmackAudio] = useState(null);
// console.log(rotate);
    // const spinAnimationValue = new Animated.Value(0);
    // Animated.timing(spinAnimationValue, {
    //     toValue: 1,
    //     duration: 500,
    //     easing: Easing.elastic()
    // }).start();
    // const spinAnimation = spinAnimationValue.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: ['45deg', '405deg']
    // });

    useEffect(() => {

        setTrail({left: x, top: y});
        collectiblePosition && (Math.floor(x) > collectiblePosition.left - HALF_DIAMETER)
        && (Math.floor(x) < collectiblePosition.left + HALF_DIAMETER)
        && (Math.floor(y) > collectiblePosition.top - HALF_DIAMETER)
        && (Math.floor(y) < collectiblePosition.top + HALF_DIAMETER)
        && setConsumeCollectible(true);
        return () => {
            stopTrail();
        };
    }, [x, y]);

    useEffect(() => {

        const x = props.x < HALF_DIAMETER ? HALF_DIAMETER + 1 : (props.x > MAX_WIDTH ? MAX_WIDTH : props.x);
        const y = props.y < HALF_DIAMETER ? HALF_DIAMETER + 1 : (props.y > MAX_HEIGHT ? MAX_HEIGHT : props.y);

        setXY({x: x - HALF_DIAMETER, y: y - HALF_DIAMETER});
    }, [props.x, props.y]);

    useEffect(() => {

        if (needCollectible) {

            setCollectiblePosition((([left, top]) => {

                left %= MAX_WIDTH;
                top %= MAX_HEIGHT;

                ((left < BODY_DIAMETER) && (left = BODY_DIAMETER))
                || ((left > MAX_WIDTH) && (left = MAX_WIDTH));
                ((top < BODY_DIAMETER) && (top += BODY_DIAMETER))
                || ((top > MAX_HEIGHT) && (top = MAX_HEIGHT));
                setNeedCollectible(false);

                return {left, top};
            })([
                /*collectiblePosition ? xorShift(collectiblePosition.left) : */Math.floor(Math.random() * Math.floor(WIDTH)),
                /*collectiblePosition ? xorShift(collectiblePosition.top) : */Math.floor(Math.random() * Math.floor(HEIGHT))
            ]));
        }
    }, [needCollectible]);

    useEffect(() => {

        if (consumeCollectible) {

            biteAudio.replayAsync();
            setConsumeCollectible(false);
            setNeedCollectible(true);
            (trailLength % 7 === 0) && cheersAudio.replayAsync();
            (trailLength % 3 === 0) && eatingAudio.replayAsync();
            (trailLength % 5 === 0) && smackAudio.replayAsync();
            (trailLength < 40) && setTrailLength(trailLength + 1);
        }
    }, [consumeCollectible]);

    useEffect(() => {

        setNeedCollectible(true);

        const _assets = {
            biteAudio: new Audio.Sound(),
            eating: new Audio.Sound(),
            cheers: new Audio.Sound(),
            smack: new Audio.Sound()
        };
        Promise.all([
            _assets.biteAudio.loadAsync(
                require("../assets/audio/Bite.wav")
            ),
            _assets.eating.loadAsync(
                require("../assets/audio/chips-eating.mp3")
            ),
            _assets.cheers.loadAsync(
                require("../assets/audio/kids-cheering.wav")
            ),
            _assets.smack.loadAsync(
                require("../assets/audio/villian-smack.wav")
            ),
        ]).then(() => {
            _assets.biteAudio.setVolumeAsync(0.5);
            _assets.cheers.setVolumeAsync(0.5);
            _assets.eating.setVolumeAsync(0.6);
            _assets.smack.setVolumeAsync(1);

            setBiteAudio(_assets.biteAudio);
            setEatingAudio(_assets.eating);
            setCheersAudio(_assets.cheers);
            setSmackAudio(_assets.smack);
        });
    }, []);

    useEffect(() => {

        setRotate({ to: [{rotate: "405deg"}, {rotate: "45deg"}] });
    }, [collectiblePosition]);

    useEffect(() => {

    }, [trail]);

    function xorShift(seed) {

        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        const _return = (seed < 0) ? ~seed + 1 : seed;

        return _return; //2's complement of the negative result to make all numbers positive.
    }
// console.log(1);
    return !(x && y) ? null : <View>
        {trail.map((props, index) => <ViewAnimatedSpring key={index} style={{
            ...css.body,
            backgroundColor: COLORS[(index % 10) + 1],
            // borderColor: COLORS[index],
            width: BODY_DIAMETER - index * 3,
            height: BODY_DIAMETER - index * 3,
            zIndex: trailLength + 1 - index,
            ...props
        }}/>)}
        <View style={{...css.head, left: x, top: y, zIndex: trailLength + 1}}/>
        {collectiblePosition && <ViewAnimatedCollectible style={{
            ...css.collectible, ...collectiblePosition,// ...rotate
            transform: [((_rotate) => { /*console.log('-----------',_rotate);*/ return _rotate;})(rotate)]
        }}/>}

    </View>;
}

const css = StyleSheet.create({
    body: {
        borderColor: "#FFF",
        borderWidth: BORDER_WIDTH,
        width: BODY_DIAMETER,
        height: BODY_DIAMETER,
        position: "absolute",
        borderRadius: BODY_DIAMETER * 2
    },
    anchor: {
        position: "absolute"
    },
    head: {
        backgroundColor: "#FF5877",
        borderColor: "#FFC1C1",
        borderWidth: BORDER_WIDTH,
        width: BODY_DIAMETER,
        height: BODY_DIAMETER,
        position: "absolute",
        borderRadius: BODY_DIAMETER * 2
    },
    collectible: {
        backgroundColor: "#83ff00",
        borderColor: "#FF75F9",
        borderWidth: BORDER_WIDTH,
        width: BODY_DIAMETER / 1.5,
        height: BODY_DIAMETER / 1.5,
        position: "absolute",
        // borderRadius: BODY_DIAMETER * 2,
        // transform: [{rotate: '45deg' }],
        zIndex: 1
    },
});