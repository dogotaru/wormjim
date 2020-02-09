import {StyleSheet} from "react-native";
import {BODY_DIAMETER, BORDER_WIDTH, COLLECTIBLE_DIAMETER, HEIGHT, WIDTH, IS_SMALL_DEVICE} from "./Layout";

export const CSS_WORM = StyleSheet.create({
    body: {
        borderColor: "#FFF",
        width: BODY_DIAMETER,
        height: BODY_DIAMETER,
        position: "absolute",
        borderRadius: BODY_DIAMETER * 2,
    },
    anchor: {
        position: "absolute"
    },
    head: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#FF5877",
        borderColor: "#FFC1C1",
        borderWidth: BORDER_WIDTH,
        width: BODY_DIAMETER,
        height: BODY_DIAMETER,
        position: "absolute",
        borderRadius: BODY_DIAMETER * 2
    },
    collectible: {
        backgroundColor: "#83ff00",
        borderColor: "#FF75F9",
        borderWidth: BORDER_WIDTH,
        width: COLLECTIBLE_DIAMETER,
        height: COLLECTIBLE_DIAMETER,
        position: "absolute",
        // borderRadius: BODY_DIAMETER * 2,
        // transform: [{rotate: '45deg' }],
        zIndex: 99
    },
    likeWobble: {
        resizeMode: 'contain', width: IS_SMALL_DEVICE ? WIDTH / 1.5 : WIDTH / 2.5
    },
    likeWobbleImageWrapper: {
        resizeMode: "contain",
        zIndex: 199,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: "absolute",
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT
    },
    likeWobbleWrapper: {
        position: "absolute",
        zIndex: 197,
        left: 0,
        top: 0,
        width: WIDTH,
        height: HEIGHT
    },
    likeWobbleOverlay: {
        flex: 1, zIndex: 198, backgroundColor: "#000000", opacity: .7
    }
});

export const CSS_HOME_SCREEN = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: "#ffffff"
    },
    playButton: {
        height: 80, resizeMode: 'contain'
    },
    collectible: {
        backgroundColor: "#83ff00",
        borderColor: "#FF75F9",
        borderWidth: 10,
        width: 100,
        height: 100,
        zIndex: 1,
        margin: 30
    }
});

export const CSS_WORM_SCREEN = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    }
});