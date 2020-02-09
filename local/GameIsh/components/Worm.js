import React, {useEffect, useState} from "react";
import {StyleSheet, View, Dimensions, Animated, Easing, TouchableHighlight, Image, Text} from "react-native";
import {useTrail, useSpring} from 'react-spring';
import {
    ImageAnimated,
    ViewAnimated,
    WIDTH,
    HEIGHT,
    BODY_DIAMETER,
    HALF_DIAMETER,
    MAX_WIDTH,
    MAX_HEIGHT,
    BORDER_WIDTH,
    COLLECTIBLE_DIAMETER, INDEX_MOD,
    MAX_WIDTH_COLLECTIBLE,
    MAX_HEIGHT_COLLECTIBLE
} from "../constants/Layout";
import {CSS_WORM as CSS} from "../constants/Styles";
import {COLORS} from "../constants/Colors";

export default function Worm(props) {

    const [{x, y}, setXY] = useState({x: 0, y: 0});
    const [maxTrailLength, setMaxTrailLength] = useState(40);
    const [bodyDecrementRatio, setBodyDecrementRatio] = useState(BODY_DIAMETER / (maxTrailLength + 20));
    const [trailLength, setTrailLength] = useState(0);
    const [trail, setTrail, stopTrail] = useTrail(maxTrailLength, () => ({left: 0, top: 0}));
    const [rotate, setRotate, stopRotate] = useSpring(() => ({from: {rotate: "45deg"}}));
    const [headRotate, setHeadRotate] = useSpring(() => ({from: {rotate: "180deg"}}));
    const [likeWobble, setLikeWobble] = useSpring(() => ({
        from: {z: 0},
        to: [{z: 1}, {z: 0}],
        config: {duration: 1000}
    }));
    const [collectiblePosition, setCollectiblePosition] = useState(null);
    const [consumeCollectible, setConsumeCollectible] = useState(false);
    const [needCollectible, setNeedCollectible] = useState(false);
    const [pauseCollectible, setPauseCollectible] = useState(false);
    const [collectibleQuadrant, setCollectibleQuadrant] = useState(0);

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

        if (trailLength < maxTrailLength) {

            const x = props.x < HALF_DIAMETER ? 1 : (props.x > MAX_WIDTH ? MAX_WIDTH - HALF_DIAMETER : props.x - HALF_DIAMETER);
            const y = props.y < 1 ? 1 : (props.y > MAX_HEIGHT - HALF_DIAMETER ? MAX_HEIGHT - HALF_DIAMETER : props.y);

            setXY({x: x, y: y});
        }
    }, [props.x, props.y]);

    useEffect(() => {

        if (needCollectible) {

            setCollectiblePosition((([left, top]) => {

                left += ([0, 3].indexOf(collectibleQuadrant) === -1 ? MAX_WIDTH_COLLECTIBLE / 2 : 0);
                top += ([0, 2].indexOf(collectibleQuadrant) === -1 ? MAX_HEIGHT_COLLECTIBLE / 2 : 0);

                left %= MAX_WIDTH_COLLECTIBLE;
                top %= MAX_HEIGHT_COLLECTIBLE;

                (left < COLLECTIBLE_DIAMETER) && (left = COLLECTIBLE_DIAMETER);
                (top < COLLECTIBLE_DIAMETER) && (top = COLLECTIBLE_DIAMETER);

                setNeedCollectible(false);
                setCollectibleQuadrant((collectibleQuadrant + 1) % 4);

                return {left, top};
            })([
                Math.floor(Math.random() * MAX_WIDTH_COLLECTIBLE / 2),
                Math.floor(Math.random() * MAX_HEIGHT_COLLECTIBLE / 2)
            ]));
            props.assets.collectCoinAudio.replayAsync();
        }
    }, [needCollectible]);

    useEffect(() => {

        if (consumeCollectible) {

            props.assets.colors[COLORS[trailLength % INDEX_MOD].audio].replayAsync();
            props.assets.biteAudio.replayAsync();

            setPauseCollectible(true);
            setTrailLength(trailLength + 1);

            if ((trailLength === maxTrailLength - 1)) {

                setTimeout(() => {

                    props.assets.cheersAudio.replayAsync();
                    props.assets.ohYeahAudio.replayAsync();
                    props.assets.clappingAudio.replayAsync();
                }, 500);
            } else {

                (trailLength % 7 === 0) && setTimeout(() => {
                    props.assets.cheersAudio.replayAsync()
                }, 500);
                (trailLength % 3 === 0) && props.assets.eatingAudio.replayAsync();
                (trailLength % 5 === 0) && props.assets.smackAudio.replayAsync();

                setTimeout(() => {

                    setConsumeCollectible(false);
                    setNeedCollectible(true);
                    setPauseCollectible(false);
                }, 1500);
            }
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
            props.assets.cheersAudio.stopAsync();
            props.assets.ohYeahAudio.stopAsync();
            props.assets.clappingAudio.stopAsync();
        }
    }, [props.focusState]);

    useEffect(() => {

        if (trailLength === maxTrailLength) {
            setLikeWobble({to: [{z: 1}, {z: 0}], config: {duration: 1000}});
        }
    }, [trailLength]);

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

//     useEffect(() => {
//
//         // console.log(props.delta);
// // console.log(Math.floor(props.x - WIDTH / 2), Math.floor(props.y - HEIGHT / 2 - 1), Math.atan2(Math.floor(props.x - WIDTH / 2), Math.floor(props.y - HEIGHT / 2))/(Math.PI/180));
//         setHeadRotate({to: {rotate: Math.atan2(props.delta.x, props.delta.y) / (Math.PI / 180)}});
//     }, [props.delta]);

    return !(x && y) ? null : <View style={{zIndex: 0, height: HEIGHT, width: WIDTH}}>
        <View style={{
            zIndex: 0,
            backgroundColor: trailLength ? COLORS[(trailLength - 1) % INDEX_MOD].hex : "#FFFFFF",
            opacity: .5,
            height: HEIGHT,
            width: WIDTH
        }}/>
        {trail.map((props, index) => {

            return <ViewAnimated native key={index} style={{
                ...CSS.body,
                backgroundColor: index >= trailLength ? "#ffffff" : COLORS[(trailLength - 1 - index) % INDEX_MOD].hex,
                width: index >= trailLength ? 0 : BODY_DIAMETER - index * bodyDecrementRatio,
                height: index >= trailLength ? 0 : BODY_DIAMETER - index * bodyDecrementRatio,
                zIndex: trailLength - index,
                borderWidth: index < trailLength ? BORDER_WIDTH : 0,
                // left: trail[index].left.value,
                // top: trail[index].top.value,
                ...props
            }}/>
        })}
        {/*<View style={{...CSS.head, left: x, top: y, zIndex: trailLength + 1}}>
            <Image source={require('../assets/images/head.png')} style={{
                resizeMode: 'center', width: BODY_DIAMETER * 1.7,
                transform: [{rotate: Math.atan2(props.delta.x, props.delta.y) / (Math.PI / 180) + "deg" /*headRotate.rotate.interpolate((x) => `${x}deg`)*!/]
            }}/>
        </View>*/}
        <View style={{...CSS.head, left: x, top: y, zIndex: trailLength + 1}}/>
        {collectiblePosition && <ViewAnimated style={{
            ...CSS.collectible, ...collectiblePosition, opacity: pauseCollectible ? 0 : 1,
            zIndex: trailLength,
            backgroundColor: COLORS[trailLength % INDEX_MOD].hex,
            transform: pauseCollectible ? [] : [rotate]
        }}/>}
        {(trailLength === maxTrailLength) && <View style={CSS.likeWobbleWrapper}>
            <View style={CSS.likeWobbleOverlay}/>
            {likeWobble && <View style={CSS.likeWobbleImageWrapper}>
                <ImageAnimated
                    source={require('../assets/images/thumbs-up.png')}
                    style={{
                        ...CSS.likeWobble,
                        transform: likeWobble.z.interpolate({
                            range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                            output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1]
                        }).interpolate(z => [{scale: z}])
                    }}
                />
            </View>}
        </View>}
    </View>;
}