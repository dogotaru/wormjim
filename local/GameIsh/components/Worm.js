import React, {useEffect, useState, useRef} from "react";

import {StyleSheet, View, Dimensions, Animated, Easing} from "react-native";
import {useTrail, animated, useSpring, interpolate} from 'react-spring';
import {Trail} from 'react-spring/renderprops'
import {Asset} from "expo-asset";
import * as Font from "expo-font";
import {Ionicons} from "@expo/vector-icons";
import {Audio} from "expo-av";

const ViewAnimatedSpring = animated(View);
const ViewAnimatedCollectible = animated(View);
const {width: WIDTH, height: HEIGHT} = Dimensions.get("window");
const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.09);
const HALF_DIAMETER = BODY_DIAMETER / 2;
const MAX_WIDTH = Math.floor(WIDTH - HALF_DIAMETER);
const MAX_HEIGHT = Math.floor(HEIGHT - HALF_DIAMETER);
const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.08);
const COLLECTIBLE_DIAMETER = BODY_DIAMETER / 1.5;
const COLORS = ["#4815AA", "#3783FF", "#4DE94C", "#FFEE00", "#FF8C00", "#F60000",  "#5F4493", "#FFEE00", "#EFA43A", "#E84947", "#8BC90B", "#F60000"];
// const BORDER_COLORS = ["#C0F3DD", "#C4F6C0", "#E5FCCD", "#FCFDC1"];

// function usePreviousXY(value) {
//     const ref = useRef();
//     useEffect(() => {
//         ref.current = value;
//     });
//     return ref.current;
// }

export default function Worm(props) {

    const [{x, y}, setXY] = useState({x: 0, y: 0});
    // const [{realX, realY}, setRealXY] = useState({realX: props.x, realY: props.y});
    // const [{xDiff, yDiff}, setXYDiff] = useState({xDiff: 0, yDiff: 0});
    const [maxTrailLength, setMaxTrailLength] = useState(40);
    const [bodyDecrementRatio, setBodyDecrementRatio] = useState(BODY_DIAMETER / (maxTrailLength + 20));
    const [trailLength, setTrailLength] = useState(-1);
    const [trail, setTrail, stopTrail] = useTrail(maxTrailLength, () => ({left: 0, top: 0}));
    const [rotate, setRotate, stopRotate] = useSpring(() => ({from: {rotate: "45deg"}}));
    const [collectiblePosition, setCollectiblePosition] = useState(null);
    const [consumeCollectible, setConsumeCollectible] = useState(false);
    const [needCollectible, setNeedCollectible] = useState(false);
    const [biteAudio, setBiteAudio] = useState(null);
    const [eatingAudio, setEatingAudio] = useState(null);
    const [cheersAudio, setCheersAudio] = useState(null);
    const [smackAudio, setSmackAudio] = useState(null);
    const [goOn, setGoOn] = useState(null);
    // const previousXY = usePreviousXY({ x: props.x, y: props.y });

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

        setTrail({left: x, top: y, config: { tension: 250, friction: 40 }});
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
        const y = props.y < HALF_DIAMETER ? 1 : (props.y > MAX_HEIGHT ? MAX_HEIGHT - HALF_DIAMETER : props.y - HALF_DIAMETER);

        setXY({x: x, y: y});
    }, [props.x, props.y]);

    // useEffect(() => {
    //
    //     let _x = x + xDiff;
    //     let _y = y + yDiff;
    //     // _x = _x < HALF_DIAMETER ? HALF_DIAMETER + 1 : (_x > MAX_WIDTH ? MAX_WIDTH : _x);
    //     // _y = _y < HALF_DIAMETER ? HALF_DIAMETER + 1 : (_y > MAX_HEIGHT ? MAX_HEIGHT : _y);
    //
    //     // console.log(x, y, xDiff, yDiff, _x, _y);
    //
    //     setXY({x: _x, y: _y});
    // }, [xDiff, yDiff]);
    //
    // useEffect(() => {
    //
    //     const xDiff = Math.floor(props.x - realX);
    //     const yDiff = Math.floor(props.y - realY);
    //     // console.log('------', x, y, props.x, props.y, realX, realY);
    //
    //     setRealXY({
    //         realX: (xDiff > 1 || xDiff < -1) ? realX + xDiff : realX,
    //         realY: (yDiff > 1 || yDiff < -1) ? realY + yDiff : realY
    //     });
    //     setXYDiff({ xDiff, yDiff });
    // }, [props.x, props.y]);

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

            biteAudio.replayAsync();
            setConsumeCollectible(false);
            setNeedCollectible(true);
            (trailLength % 7 === 0) && cheersAudio.replayAsync();
            (trailLength % 3 === 0) && eatingAudio.replayAsync();
            (trailLength % 5 === 0) && smackAudio.replayAsync();
            (trailLength < maxTrailLength) && setTrailLength(trailLength + 1);
            // (trailItems.length % 7 === 0) && cheersAudio.replayAsync();
            // (trailItems.length % 3 === 0) && eatingAudio.replayAsync();
            // (trailItems.length % 5 === 0) && smackAudio.replayAsync();
            // (trailItems.length < 40) && setTrailItems([...trailItems, {key: `_${(trailItems.length + 1)}`}]);
            // console.log(trailItems.length);
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

        setRotate({to: [{rotate: "405deg"}, {rotate: "45deg"}]});
    }, [collectiblePosition]);

    // useEffect(() => {
    //
    // }, [props.end]);

    function fitInViewport(left, top) {

        ((left < HALF_DIAMETER) && (left = 1))
        || ((left > MAX_WIDTH) && (left = MAX_WIDTH - HALF_DIAMETER));
        ((top < HALF_DIAMETER) && (top += 1))
        || ((top > MAX_HEIGHT) && (top = MAX_HEIGHT - HALF_DIAMETER));

        return {x, y};
    }

    // function xorShift(seed) {
    //
    //     seed ^= seed << 13;
    //     seed ^= seed >> 17;
    //     seed ^= seed << 5;
    //     const _return = (seed < 0) ? ~seed + 1 : seed;
    //
    //     return _return; //2's complement of the negative result to make all numbers positive.
    // }

// console.log(1);
    return !(x && y) ? null : <View>
        {/*   <Trail items={trailItems} keys={item => item.key} to={{left: x, top: y}}>
            {(item, index) => {console.log("---", index); return (props => <View key={index} style={{
                ...css.body,
                backgroundColor: COLORS[(index % 10) + 1],
                // borderColor: COLORS[index],
                width: BODY_DIAMETER - index * 3,
                height: BODY_DIAMETER - index * 3,
                zIndex: trailItems.length + 1 - index,
                ...props
            }}/>)}}
        </Trail>*/}
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
            }}/>}
        )}
        <View style={{...css.head, left: x, top: y, zIndex: trailLength + 1}}/>
        {collectiblePosition && <ViewAnimatedCollectible style={{
            ...css.collectible, ...collectiblePosition, zIndex: trailLength, backgroundColor: COLORS[(trailLength % 10) + 2],
            transform: [((_rotate) => { /*console.log('-----------',_rotate);*/
                return _rotate;
            })(rotate)]
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