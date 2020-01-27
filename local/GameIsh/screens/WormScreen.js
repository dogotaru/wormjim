import React, { Component } from "react";
import { StyleSheet, Dimensions, StatusBar } from "react-native";
import { GameLoop } from "react-native-game-engine";
import Worm from "../components/Worm";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default class SingleTouch extends Component {
    constructor() {
        super();
        this.state = {
            x: WIDTH / 2,
            y: HEIGHT / 2,
        };
    }

    onUpdate = ({ touches }) => {
        let move = touches.find(event => event.type === "move");
        if (move) {
            const x = this.state.x + move.delta.pageX;
            const y = this.state.y + move.delta.pageY;
            this.setState({
                x: x < 0 ? 0 : (x > WIDTH ? WIDTH : x),
                y: y < 0 ? 0 : (y > HEIGHT ? HEIGHT : y),
            });
        }
    };

    render() {
        return (
            <GameLoop style={styles.container} onUpdate={this.onUpdate}>

                <StatusBar hidden={true} />

                <Worm {...this.state} />

            </GameLoop>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    }
});