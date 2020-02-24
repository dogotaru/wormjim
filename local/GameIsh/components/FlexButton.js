import React, {useEffect, useState} from "react";
import {BODY_DIAMETER, BORDER_WIDTH, WIDTH} from "../constants/Layout";
import {TouchableWithoutFeedback, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

export default function FlexButton({style, ...props}) {

    const [firstClick, setFirstClick] = useState(false);
    const [timeoutHandle, setTimeoutHandle] = useState(null);

    useEffect(() => () => timeoutHandle && clearTimeout(timeoutHandle), [])

    return (
        <TouchableWithoutFeedback accessibilityIgnoresInvertColors={true} onPress={async () => {

            if (firstClick) {

                setFirstClick(false);
                clearTimeout(timeoutHandle);
                setTimeoutHandle(null);
                props.stopAction();
            } else {

                props.playAction().then((playbackStatus) => {
                    !playbackStatus.isLooping && setTimeoutHandle(setTimeout(() => {

                        setFirstClick(false);
                    }, playbackStatus.durationMillis));
                });
                setFirstClick(true);
            }
        }} title={props.title}><View style={{
            ...style,
            backgroundColor: style.backgroundColor || "#ecf8e9",
            borderColor: style.borderColor || "#486a44",
            borderWidth: 1,
            borderStyle: 'dashed',
            borderRadius: WIDTH / 20,
            alignItems: 'center', justifyContent: 'center',
            opacity: !firstClick ? .4 : 1
        }}>
            <View style={{
                alignItems: 'center', justifyContent: 'center',
                borderWidth: BORDER_WIDTH,
                borderColor: "#00CC00",
                borderRadius: BODY_DIAMETER,
                width: BODY_DIAMETER / 1.3,
                height: BODY_DIAMETER / 1.3,
                backgroundColor: firstClick ? style.backgroundColor || "#6A0DAD" : "#6A0DAD",
                opacity: 1
            }}>
                <Ionicons name={props.ionicon} size={BODY_DIAMETER / 2} color={style.color || "white"} />
            </View></View>
        </TouchableWithoutFeedback>
    );
}