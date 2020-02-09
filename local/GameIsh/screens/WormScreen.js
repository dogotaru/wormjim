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

export default function SingleTouch(props) {

    const [assets] = useState(props.screenProps.assets);
    const [firstClick, setFirstClick] = useState(false);
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

            <View style={{
                position: "absolute",
                zIndex: 1,
                width: BODY_DIAMETER,
                height: BODY_DIAMETER,
                alignItems: 'center',
                justifyContent: 'center'
            }}><TouchableWithoutFeedback accessibilityIgnoresInvertColors={true} onPress={() => {

                if (firstClick) {

                    const pushAction = StackActions.push({ routeName: 'Home' });
                    props.navigation.dispatch(pushAction);
                } else
                    setTimeout(() => {

                        setFirstClick(false)
                    }, 1000);

                setFirstClick(true);
            }} title="Go to Home">
                <View style={{
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: BORDER_WIDTH,
                    borderColor: "#00CC00",
                    borderRadius: BODY_DIAMETER,
                    width: BODY_DIAMETER / 1.3,
                    height: BODY_DIAMETER / 1.3,
                    backgroundColor: "#6A0DAD",
                    opacity: !firstClick ? .4 : 1
                }}>
                    <Ionicons name="md-home" size={BODY_DIAMETER / 2} color="white"/>
                </View>
            </TouchableWithoutFeedback></View>
            <Worm style={{zIndex: 0}} x={x} y={y} assets={assets} focusState={focusState}/>

        </GameLoop>
    );
}