import React, {useEffect, useState, useCallback, useRef} from "react";
import {StyleSheet, Dimensions, StatusBar, View, Image, Text, TouchableHighlight} from "react-native";
import {GameLoop} from "react-native-game-engine";
import {useFocusState} from 'react-navigation-hooks';
import Worm from "../components/Worm";
import {CSS_AUDIO_SCREEN, CSS_WORM_SCREEN as CSS} from "../constants/Styles";
import {BODY_DIAMETER, BORDER_WIDTH, HEIGHT, TextAnimated, ViewAnimated, WIDTH} from "../constants/Layout";
import {StackActions} from "react-navigation";
import {Ionicons} from '@expo/vector-icons';
import {TouchableWithoutFeedback} from "react-native";
import Button from "../components/Button";
import {useSpring, useTransition, animated} from "react-spring";

export default function AudioScreen(props) {

    const [assets] = useState(props.screenProps.assets);
    const [firstClickHome, setFirstClickHome] = useState(false);
    const [firstClickAudio, setFirstClickAudio] = useState(false);
    const [{x, y}, setXY] = useState({x: WIDTH / 2, y: HEIGHT / 2});
    // const [delta, setDelta] = useState({x: 0, y: 0});
    const focusState = useFocusState();

    const ref = useRef([]);
    const [open, toggle] = useState(false);
    const [items, set] = useState([]);
    const transitions = useTransition(items, null, {
        from: { opacity: 0, height: 0, innerHeight: 0, transform: [{rotateX: "0deg"}], color: '#8fa5b6' },
        enter: [
            { opacity: 1, height: 80, innerHeight: 80 },
            { transform: [{rotateX: "180deg"}], color: '#28d79f' },
            { transform: [{rotateX: "0deg"}] },
        ],
        leave: [{ color: '#c23369' }, { innerHeight: 0 }, { opacity: 0, height: 0 }],
        update: { color: '#28b4d7' }
    })

    const reset = useCallback(() => {
        ref.current.map(clearTimeout)
        ref.current = []
        set([])
        ref.current.push(setTimeout(() => set(['Apples', 'Oranges', 'Kiwis']), 2000))
        ref.current.push(setTimeout(() => set(['Apples', 'Kiwis']), 5000))
        ref.current.push(setTimeout(() => set(['Apples', 'Bananas', 'Kiwis']), 8000))
        ref.current.push(setTimeout(() => set([]), 12000))
    }, [])

    useEffect(() => void reset(), [])

    return (
        <View style={CSS.container}>

            <Button
                ionicon={"md-home"} position={{left: BORDER_WIDTH, top: BORDER_WIDTH * 5}}
                pushAction={() => props.navigation.dispatch(StackActions.push({routeName: 'Home'}))}/>
            <Button
                ionicon={"md-bug"} position={{left: BORDER_WIDTH, top: BORDER_WIDTH * 3 + BODY_DIAMETER}}
                pushAction={() => props.navigation.dispatch(StackActions.push({routeName: 'Worm'}))}/>

            <View pushAction={reset}>
                {transitions.map(({ item, props: { innerHeight, color, ...rest }, key }) => (
                    <ViewAnimated key={key} style={{...CSS_AUDIO_SCREEN.effect, ...rest}}>
                        <TextAnimated style={{height: innerHeight, color: color, fontSize: 60 }}>{item}</TextAnimated>
                    </ViewAnimated>
                ))}
            </View>
        </View>
    );
}