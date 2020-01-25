import React, { useEffect, useState } from "react";

import { StyleSheet, View, Dimensions } from "react-native";
import {useTrail, animated} from 'react-spring'

const ViewAnimated = animated(View);
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const BODY_DIAMETER = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.085);
const BORDER_WIDTH = Math.trunc(BODY_DIAMETER * 0.1);
const COLORS = ["#86E9BE", "#8DE986", "#B8E986", "#E9E986", "#86E9BE", "#8DE986", "#B8E986", "#E9E986", "#86E9BE", "#8DE986", "#B8E986"];
// const BORDER_COLORS = ["#C0F3DD", "#C4F6C0", "#E5FCCD", "#FCFDC1"];

export default function Worm(props) {

    const [{ x, y }, setXY] = useState({x: 0, y: 0});
    const [trailLength, setTrailLength] = useState(10);
    const [trail, setTrail, stopTrail] = useTrail(trailLength, () => ({ left: x, top: y }));

    useEffect(() => {

        setTrail({ left: x, top: y });
        return () => { stopTrail(); };
    }, [x, y]);

    useEffect(() => {

        setXY({ x: props.x - BODY_DIAMETER / 2, y: props.y - BODY_DIAMETER / 2 });
    }, [props.x, props.y]);

    return !(x && y) ? null : <View>
        {trail.map((props, index) => <ViewAnimated key={index} style={{
            ...css.body,
            backgroundColor: COLORS[(index % 10) + 1],
            // borderColor: COLORS[index],
            width: BODY_DIAMETER - index * 5,
            height: BODY_DIAMETER - index * 5,
            zIndex: trailLength + 1 - index,
            ...props
        }}/>)}
        <View style={{...css.head, left: x, top: y, zIndex: trailLength + 1}}/>

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
    }
});