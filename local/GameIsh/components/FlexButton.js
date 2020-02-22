import React, {useEffect, useState} from "react";
import {BODY_DIAMETER, BORDER_WIDTH, HEIGHT, WIDTH} from "../constants/Layout";
import {TouchableWithoutFeedback, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

export default function FlexButton({style, ...props}) {

    const [firstClick, setFirstClick] = useState(false);

    return (
        <TouchableWithoutFeedback style={{

        }} accessibilityIgnoresInvertColors={true} onPress={() => {

            if (firstClick) {


            } else
                props.pushAction();
                setTimeout(() => {

                    setFirstClick(false)
                }, 1000);

            setFirstClick(true);
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
                backgroundColor: style.backgroundColor || "#6A0DAD",
                opacity: 1
            }}>
                <Ionicons name={props.ionicon} size={BODY_DIAMETER / 2} color={style.color || "white"} />
            </View></View>
        </TouchableWithoutFeedback>
    );
}