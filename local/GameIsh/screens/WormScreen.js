import React, {useEffect, useState} from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { GameLoop } from "react-native-game-engine";
import {useFocusState} from 'react-navigation-hooks';
import Worm from "../components/Worm";
import {CSS_WORM_SCREEN as CSS} from "../constants/Styles";
import {HEIGHT, WIDTH} from "../constants/Layout";

export default function SingleTouch(props) {

    const [assets] = useState(props.screenProps.assets);
    const [{x, y}, setXY] = useState({x: WIDTH / 2, y: HEIGHT / 2});
    // const [delta, setDelta] = useState({x: 0, y: 0});
    const focusState = useFocusState();

    const onUpdate = ({ touches }) => {

        let move = touches.find(event => event.type === "move" );
        if (move) {
            // console.log(move);
            // setDelta({x: 0 - Math.floor(move.delta.pageX * 1), y: Math.floor(move.delta.pageY * 1)});
            setXY({x: x + move.delta.pageX * 2, y: y + move.delta.pageY * 2});
        }
    };

    useEffect(() => {
        x < 0 && setXY({x: 0, y});
        x > WIDTH && setXY({x: WIDTH, y});
        y < 0 && setXY({x, y: 0});
        y > HEIGHT && setXY({x, y: HEIGHT});
    }, [x, y]);

    return (
        <GameLoop style={CSS.container} onUpdate={onUpdate}>

            <StatusBar hidden={false} />

            <Worm x={x} y={y} assets={assets} focusState={focusState} />

        </GameLoop>
    );
}