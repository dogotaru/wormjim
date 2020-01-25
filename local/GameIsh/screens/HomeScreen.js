import { GameEngine } from "react-native-game-engine"

import React, { PureComponent } from "react";
import { StyleSheet, View, AppRegistry, StatusBar } from "react-native";

const RADIUS = 20;

class Finger extends PureComponent {
    render() {
        const x = this.props.position[0] - RADIUS / 2;
        const y = this.props.position[1] - RADIUS / 2;
        return (
            <View style={[styles.finger, { left: x, top: y }]} />
        );
    }
}

const styles = StyleSheet.create({
    finger: {
        borderColor: "#CCC",
        borderWidth: 4,
        borderRadius: RADIUS * 2,
        width: RADIUS * 2,
        height: RADIUS * 2,
        backgroundColor: "pink",
        position: "absolute"
    }
});

// export { Finger };

const MoveFinger = (entities, { touches }) => {

    //-- I'm choosing to update the game state (entities) directly for the sake of brevity and simplicity.
    //-- There's nothing stopping you from treating the game state as immutable and returning a copy..
    //-- Example: return { ...entities, t.id: { UPDATED COMPONENTS }};
    //-- That said, it's probably worth considering performance implications in either case.

    touches.filter(t => t.type === "move").forEach(t => {
        let finger = entities[t.id];
        if (finger && finger.position) {
            finger.position = [
                finger.position[0] + t.delta.pageX,
                finger.position[1] + t.delta.pageY
            ];
        }
    });

    return entities;
};

// export { MoveFinger };

export default class HomeScreen extends PureComponent {
    constructor() {
        super();
    }

    render() {
        return (
            <GameEngine
                style={gameStyles.container}
                systems={[MoveFinger]}
                entities={{
                    0: { position: [40,  200], renderer: <Finger />}, //-- Notice that each entity has a unique id (required)
                    1: { position: [100, 200], renderer: <Finger />}, //-- and a renderer property (optional). If no renderer
                    2: { position: [160, 200], renderer: <Finger />}, //-- is supplied with the entity - it won't get displayed.
                    3: { position: [220, 200], renderer: <Finger />},
                    4: { position: [280, 200], renderer: <Finger />}
                }}>

                <StatusBar hidden={true} />

            </GameEngine>
        );
    }
}

const gameStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    }
});

AppRegistry.registerComponent("BestGameEver", () => BestGameEver);