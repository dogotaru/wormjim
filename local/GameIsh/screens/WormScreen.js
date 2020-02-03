import React, {useEffect, useState} from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { GameLoop } from "react-native-game-engine";
import {useFocusState} from 'react-navigation-hooks';
import Worm from "../components/Worm";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function SingleTouch(props) {

    const [assets] = useState(props.screenProps.assets);
    const [{x, y}, setXY] = useState({x: WIDTH / 2, y: HEIGHT / 2});
    const focusState = useFocusState();

    const onUpdate = ({ touches }) => {

        let move = touches.find(event => event.type === "move" );
        if (move) {

            setXY({x: x + move.delta.pageX * 3, y: y + move.delta.pageY * 3});
        }
    };

    useEffect(() => {
        x < 0 && setXY({x: 0, y});
        x > WIDTH && setXY({x: WIDTH, y});
        y < 0 && setXY({x, y: 0});
        y > HEIGHT && setXY({x, y: HEIGHT});
    }, [x, y]);

    return (
        <GameLoop style={styles.container} onUpdate={onUpdate}>

            <StatusBar hidden={false} />

            <Worm x={x} y={y} assets={assets} focusState={focusState} />

        </GameLoop>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    }
});