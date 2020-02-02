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

        let move = touches.find(event => event.type === "move" );
        // let end = touches.find(event => event.type === "end");
        if (move) {

            this.setState({
                // x: x < 0 ? 0 : (x > WIDTH ? WIDTH : x),
                // y: y < 0 ? 0 : (y > HEIGHT ? HEIGHT : y),
                x: this.state.x + move.delta.pageX * 3,
                y: this.state.y + move.delta.pageY * 3
                // end: !!end
            }, () => {
                this.state.x < 0 && this.setState({ x: 0 });
                this.state.x > WIDTH && this.setState({ x: WIDTH });
                this.state.y < 0 && this.setState({ y: 0 });
                this.state.y > HEIGHT && this.setState({ y: HEIGHT });
            });
        }
    };

    render() {
        return (
            <GameLoop style={styles.container} onUpdate={this.onUpdate}>

                <StatusBar hidden={false} />

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