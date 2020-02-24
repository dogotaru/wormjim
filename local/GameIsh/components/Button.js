import React, {useEffect, useState} from "react";
import {BODY_DIAMETER, BORDER_WIDTH} from "../constants/Layout";
import {TouchableWithoutFeedback, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

export default function Button(props) {

    const [firstClick, setFirstClick] = useState(false);
    const [timeoutHandle, setTimeoutHandle] = useState(null);

    useEffect(() => {

        return () => {

            if (timeoutHandle)
                clearTimeout(timeoutHandle);

            if (firstClick)
                setFirstClick(false);
        }
    }, []);

    useEffect(() => {

        // console.log(timeoutHandle);
    }, [timeoutHandle]);

    return (
        <View style={{
            position: "absolute",
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            ...props.position
        }}><TouchableWithoutFeedback accessibilityIgnoresInvertColors={true} onPress={() => {

            if (firstClick || props.singleClick) {

                setFirstClick(false);
                clearTimeout(timeoutHandle);
                props.pushAction();
            } else {

                setTimeoutHandle(setTimeout(() => {

                    setFirstClick(false);
                    setTimeoutHandle(null);
                }, 1000));
                setFirstClick(true);
            }
        }} title="Go to Home">
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                borderWidth: BORDER_WIDTH,
                borderColor: "#00CC00",
                borderRadius: BODY_DIAMETER,
                width: BODY_DIAMETER / 1.3,
                height: BODY_DIAMETER / 1.3,
                backgroundColor: "#6A0DAD",
                opacity: !firstClick && !props.singleClick ? .4 : 1
            }}>
                <Ionicons name={props.ionicon} size={BODY_DIAMETER / 2} color="white"/>
            </View>
        </TouchableWithoutFeedback></View>
    );
}