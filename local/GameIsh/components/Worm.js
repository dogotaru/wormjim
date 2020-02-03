import React, {useEffect, useState, useRef} from "react";

import {StyleSheet, View, Dimensions, Animated, Easing, TouchableHighlight, Image, Text} from "react-native";
import {useTrail, animated, useSpring, interpolate} from 'react-spring';

const ViewAnimatedSpring = animated(View);
const ViewAnimatedCollectible = animated(View);
const {width: WIDTH, height: HEIGHT} = Dimensions.get("window");
const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.09);
const HALF_DIAMETER = BODY_DIAMETER / 2;
const MAX_WIDTH = Math.floor(WIDTH - HALF_DIAMETER);
const MAX_HEIGHT = Math.floor(HEIGHT - HALF_DIAMETER);
const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.08);
const COLLECTIBLE_DIAMETER = BODY_DIAMETER / 1.5;
const COLORS = ["#4815AA", "#3783FF", "#4DE94C", "#FFEE00", "#FF8C00", "#F60000", "#5F4493", "#FFEE00", "#EFA43A", "#E84947", "#8BC90B", "#F60000"];

export default function Worm(props) {

    const [{x, y}, setXY] = useState({x: 0, y: 0});
    const [maxTrailLength, setMaxTrailLength] = useState(40);
    const [bodyDecrementRatio, setBodyDecrementRatio] = useState(BODY_DIAMETER / (maxTrailLength + 20));
    const [trailLength, setTrailLength] = useState(-1);
    const [trail, setTrail, stopTrail] = useTrail(maxTrailLength, () => ({left: 0, top: 0}));
    const [rotate, setRotate, stopRotate] = useSpring(() => ({from: {rotate: "45deg"}}));
    const [collectiblePosition, setCollectiblePosition] = useState(null);
    const [consumeCollectible, setConsumeCollectible] = useState(false);
    const [needCollectible, setNeedCollectible] = useState(false);

    useEffect(() => {

        setTrail({left: x, top: y, config: {tension: 250, friction: 40}});
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

        const x = props.x < HALF_DIAMETER ? 1 : (props.x > MAX_WIDTH ? MAX_WIDTH - HALF_DIAMETER : props.x - HALF_DIAMETER);
        const y = props.y < HALF_DIAMETER ? 1 : (props.y > MAX_HEIGHT - BORDER_WIDTH ? MAX_HEIGHT - BORDER_WIDTH : props.y);

        setXY({x: x, y: y});
    }, [props.x, props.y]);

    useEffect(() => {

        if (needCollectible) {

            setCollectiblePosition((([left, top]) => {

                left %= (MAX_WIDTH - COLLECTIBLE_DIAMETER + 1);
                top %= (MAX_HEIGHT - COLLECTIBLE_DIAMETER + 1);

                (left < COLLECTIBLE_DIAMETER) && (left = COLLECTIBLE_DIAMETER);
                (top < COLLECTIBLE_DIAMETER) && (top = COLLECTIBLE_DIAMETER);
                setNeedCollectible(false);

                return {left, top};
            })([
                Math.floor(Math.random() * Math.floor(WIDTH)),
                Math.floor(Math.random() * Math.floor(HEIGHT))
            ]));
        }
    }, [needCollectible]);

    useEffect(() => {

        if (consumeCollectible) {

            props.assets.biteAudio.replayAsync();
            props.assets.collectCoinAudio.replayAsync();

            setConsumeCollectible(false);
            setNeedCollectible(true);
            (trailLength % 7 === 0) && props.assets.cheersAudio.replayAsync();
            (trailLength % 3 === 0) && props.assets.eatingAudio.replayAsync();
            (trailLength % 5 === 0) && props.assets.smackAudio.replayAsync();
            (trailLength === maxTrailLength - 1) && props.assets.ohYeahAudio.replayAsync();
            (trailLength === maxTrailLength - 1) && props.assets.clappingAudio.replayAsync();
            (trailLength < maxTrailLength) && setTrailLength(trailLength + 1);
        }
    }, [consumeCollectible]);

    useEffect(() => {

        setRotate({to: [{rotate: "405deg"}, {rotate: "45deg"}]});
    }, [collectiblePosition]);

    useEffect(() => {

        if (props.focusState.isFocused) {

            props.assets.wormBackgroundMusic_level_01.playAsync();
        } else {

            props.assets.wormBackgroundMusic_level_01.stopAsync();
        }
    }, [props.focusState]);

    useEffect(() => {

        setNeedCollectible(true);
    }, []);

    // function fitInViewport(left, top) {
    //
    //     ((left < HALF_DIAMETER) && (left = 1))
    //     || ((left > MAX_WIDTH) && (left = MAX_WIDTH - HALF_DIAMETER));
    //     ((top < HALF_DIAMETER) && (top += 1))
    //     || ((top > MAX_HEIGHT) && (top = MAX_HEIGHT - HALF_DIAMETER));
    //
    //     return {x, y};
    // }

    return !(x && y) ? null : <View>
        {trail.map((props, index) => {

                return <ViewAnimatedSpring native key={index} style={{
                    ...css.body,
                    backgroundColor: COLORS[((trailLength - index - 1) % 10) + 2],
                    // borderColor: COLORS[index],
                    width: index > trailLength ? 0 : BODY_DIAMETER - index * bodyDecrementRatio,
                    height: index > trailLength ? 0 : BODY_DIAMETER - index * bodyDecrementRatio,
                    zIndex: trailLength + 1 - index,
                    // left: trail[index].left.value,
                    // top: trail[index].top.value,
                    ...props
                }}/>
            }
        )}
        <View style={{...css.head, left: x, top: y, zIndex: trailLength + 1}}/>
        {collectiblePosition && <ViewAnimatedCollectible style={{
            ...css.collectible, ...collectiblePosition,
            zIndex: trailLength,
            backgroundColor: COLORS[(trailLength % 10) + 2],
            transform: [((_rotate) => { /*console.log('-----------',_rotate);*/
                return _rotate;
            })(rotate)]
        }}/>}
        {(trailLength === maxTrailLength) && <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: "absolute",
            left: 0,
            top: 0,
            width: WIDTH,
            height: HEIGHT
        }}><Image
            source={require('../assets/images/thumbs-up.png')}
            style={{resizeMode: 'center', zIndex: 199, width: 200}}
        /></View>}

    </View>;
}

const css = StyleSheet.create({
    body: {
        borderColor: "#FFF",
        borderWidth: BORDER_WIDTH,
        width: BODY_DIAMETER,
        height: BODY_DIAMETER,
        position: "absolute",
        borderRadius: BODY_DIAMETER * 2,
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
        width: COLLECTIBLE_DIAMETER,
        height: COLLECTIBLE_DIAMETER,
        position: "absolute",
        // borderRadius: BODY_DIAMETER * 2,
        // transform: [{rotate: '45deg' }],
        zIndex: 99
    },
});