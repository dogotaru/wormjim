import React, {useEffect, useState} from "react";
import {
    View
} from "react-native";
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
    MAX_HEIGHT_COLLECTIBLE, TextAnimated
} from "../constants/Layout";
import {CSS_AUDIO_SCREEN, CSS_WORM as CSS} from "../constants/Styles";
import {COLORS} from "../constants/Colors";
import {StackActions} from "react-navigation";
import Button from "./Button";
import {Ionicons} from "@expo/vector-icons";

export default function Worm(props) {

    const [{x, y}, setXY] = useState({x: 0, y: 0});
    const [maxTrailLength] = useState(22);
    const [bodyDecrementRatio] = useState(BODY_DIAMETER / (maxTrailLength + 20));
    const [trailLength, setTrailLength] = useState(0);
    const [trail, setTrail, stopTrail] = useTrail(maxTrailLength, () => ({left: 0, top: 0}));
    const [rotate, setRotate] = useSpring(() => ({from: {rotate: "45deg"}}));
    // const [headRotate, setHeadRotate] = useSpring(() => ({from: {rotate: "180deg"}}));
    const [likeWobble, setLikeWobble] = useSpring(() => ({
        from: {z: 0},
        to: [{z: 1}, {z: 0}],
        config: {duration: 1000}
    }));
    const [textColorWobble, setTextColorWobble] = useSpring(() => ({
        from: {scale: 0/*, right: -WIDTH * 1.5*/, opacity: 0}, to: []
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

            setTextColorWobble({
                to: [
                    /*{right: 0, opacity: 1},*/
                    {opacity: 1, scale: 1}, {scale: 1}, {scale: 0, opacity: 0},
                    /*{right: WIDTH * 1.5, opacity: 0},*/
                    /*{right: -WIDTH * 1.5,}, {opacity: 1}*/
                ], config: {easing: "d3-easing"}
            });

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
            setLikeWobble({to: [{z: 1}, {z: 0}, {z: 1}], config: {duration: 1000}});
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

    return !(x && y) ? null : <View style={{
        zIndex: 0,
        height: HEIGHT,
        width: WIDTH
    }}>
        <View style={{
            position: "absolute",
            zIndex: 0,
            opacity: .3,
            height: HEIGHT,
            width: WIDTH,
            backgroundColor: trailLength ? COLORS[(trailLength - 1) % INDEX_MOD].hex : "#FFFFFF"
        }}/>
        {/*<ImageBackground resizeMode={'repeat'} source={backgrounds[trailLength % 2]} style={{*/}
        {/*    zIndex: 0,*/}
        {/*    opacity: .8,*/}
        {/*    height: HEIGHT,*/}
        {/*    width: WIDTH*/}
        {/*}}/>*/}
        {trailLength ? [
            <View key='backgroundTransparent' style={{
                ...CSS_AUDIO_SCREEN.effect.backgroundTransparent,
                backgroundColor: COLORS[(trailLength - 1) % INDEX_MOD].hex
            }}/>,
            <View key='backgroundOpaque' style={CSS_AUDIO_SCREEN.effect.backgroundOpaque}>
                <TextAnimated key='text' style={{
                    ...CSS_AUDIO_SCREEN.effect.text,
                    color: COLORS[(trailLength - 1) % INDEX_MOD].wobble,
                    opacity: textColorWobble.opacity,
                    transform: textColorWobble.scale.interpolate({
                        range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
                        output: [1, 0.97, 0.9, 1.6, 0.9, 1.4, 1.03, 1]
                    }).interpolate(scale => [{scale}]),
                }}
                >{COLORS[(trailLength - 1) % INDEX_MOD].audio}</TextAnimated>
            </View>] : null}
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
        <View style={{...CSS.head, left: x, top: y, zIndex: trailLength + 1}}/>
        {collectiblePosition && [
            <ViewAnimated key={"collectible"} style={{
                ...CSS.collectible, ...collectiblePosition, opacity: pauseCollectible ? 0 : 1,
                zIndex: trailLength,
                backgroundColor: COLORS[trailLength % INDEX_MOD].hex,
                transform: pauseCollectible ? [] : [rotate]
            }}/>,
            <View key={"ionicon"} style={{
                display: "flex",
                flexDirection: 'row',
                alignContent: "center",
                alignItems: 'center',
                justifyContent: 'center',
                width: COLLECTIBLE_DIAMETER,
                height: COLLECTIBLE_DIAMETER,
                ...collectiblePosition, zIndex: trailLength, opacity: pauseCollectible ? 0 : 1
            }}>
                <Ionicons style={{}} name={"md-bug"} size={BODY_DIAMETER / 3.5}
                         color={COLORS[trailLength % INDEX_MOD].invert}/>
            </View>
        ]}
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
                <Button
                    singleClick={true}
                    ionicon={"ios-undo"} position={{top: HEIGHT / 1.6}}
                    pushAction={() => props.navigation.dispatch(StackActions.popToTop())}/>
            </View>}
        </View>}
    </View>;
}