import React, {useEffect, useState} from "react";
import {StyleSheet, Dimensions, StatusBar, View, Image, Text, TouchableHighlight} from "react-native";
import {GameLoop} from "react-native-game-engine";
import {useFocusState} from 'react-navigation-hooks';
import Worm from "../components/Worm";
import {CSS_WORM_SCREEN as CSS} from "../constants/Styles";
import {BODY_DIAMETER, BORDER_WIDTH, HEIGHT, WIDTH} from "../constants/Layout";
import {StackActions} from "react-navigation";
import {Ionicons} from '@expo/vector-icons';
import {TouchableWithoutFeedback} from "react-native";
import Button from "../components/Button";

export default function WormScreen(props) {

    const [assets] = useState(props.screenProps.assets);
    const [firstClickHome, setFirstClickHome] = useState(false);
    const [firstClickAudio, setFirstClickAudio] = useState(false);
    const [{x, y}, setXY] = useState({x: WIDTH / 2, y: HEIGHT / 2});
    // const [delta, setDelta] = useState({x: 0, y: 0});
    const focusState = useFocusState();

    const onUpdate = ({touches}) => {

        let move = touches.find(event => event.type === "move");
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

            <StatusBar hidden={false}/>

            <Button
                ionicon={"md-home"} position={{left: BORDER_WIDTH, top: BORDER_WIDTH * 5}}
                pushAction={() => props.navigation.dispatch(StackActions.popToTop())}/>
            <Button
                ionicon={"md-happy"} position={{left: BORDER_WIDTH, top: BORDER_WIDTH * 3 + BODY_DIAMETER}}
                pushAction={() => props.navigation.dispatch(StackActions.push({routeName: 'Audio'}))}/>
            <Worm style={{zIndex: 0}} x={x} y={y} assets={assets} focusState={focusState}/>

        </GameLoop>
    );
}