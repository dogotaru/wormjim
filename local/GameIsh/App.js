import {AppLoading} from 'expo';
import {Asset} from 'expo-asset';
import React, {useState, useEffect} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import AppContainer from './navigation/AppNavigator';
import {Audio} from "expo-av";

export default function App(props) {
    const [isLoadingComplete, setLoadingComplete] = useState(false);
    const [assets, setAssets] = useState({
        wormBackgroundMusic_level_01: new Audio.Sound(),
        homeBackgroundMusic: new Audio.Sound(),
        biteAudio: new Audio.Sound(),
        cheersAudio: new Audio.Sound(),
        eatingAudio: new Audio.Sound(),
        smackAudio: new Audio.Sound(),
        clappingAudio: new Audio.Sound(),
        ohYeahAudio: new Audio.Sound(),
        collectCoinAudio: new Audio.Sound(),
        colors: {
            red: new Audio.Sound(),
            black: new Audio.Sound(),
            green: new Audio.Sound(),
            yellow: new Audio.Sound(),
            white: new Audio.Sound(),
            pink: new Audio.Sound(),
            purple: new Audio.Sound(),
            orange: new Audio.Sound(),
            violet: new Audio.Sound(),
            blue: new Audio.Sound(),
            grey: new Audio.Sound()
        }
    });

    useEffect(() => {
        if (isLoadingComplete) {
            assets.homeBackgroundMusic.setIsLoopingAsync(true);
            assets.homeBackgroundMusic.setVolumeAsync(0.15);
            assets.wormBackgroundMusic_level_01.setIsLoopingAsync(true);
            assets.wormBackgroundMusic_level_01.setVolumeAsync(0.15);

            assets.biteAudio.setVolumeAsync(0.5);
            assets.cheersAudio.setVolumeAsync(0.5);
            assets.eatingAudio.setVolumeAsync(0.6);
            assets.smackAudio.setVolumeAsync(1);
            assets.clappingAudio.setVolumeAsync(1);
            assets.ohYeahAudio.setVolumeAsync(1);
            assets.collectCoinAudio.setVolumeAsync(0.09);
        }
        return () => {
            Object.keys(assets).map((key) => {
                if (assets[key].hasOwnProperty('stopAsync'))
                    assets[key].stopAsync();
            });
        };
    }, [isLoadingComplete]);

    if (!isLoadingComplete && !props.skipLoadingScreen) {
        return (
            <AppLoading
                startAsync={loadResourcesAsync}
                onError={handleLoadingError}
                onFinish={() => setLoadingComplete(true)}
                // autoHideSplash={false}
            />
        );
    } else {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                <AppContainer screenProps={{assets}}/>
            </View>
        );
    }

    async function loadResourcesAsync() {
        await Promise.all([
            assets.wormBackgroundMusic_level_01.loadAsync(require("./assets/audio/cheerful-upbeat.mp3")),
            assets.homeBackgroundMusic.loadAsync(require("./assets/audio/comic-cartoon.mp3")),

            assets.biteAudio.loadAsync(require("./assets/audio/Bite.wav")),
            assets.eatingAudio.loadAsync(require("./assets/audio/chips-eating.mp3")),
            assets.cheersAudio.loadAsync(require("./assets/audio/kids-cheering.wav")),
            assets.smackAudio.loadAsync(require("./assets/audio/villian-smack.wav")),
            assets.clappingAudio.loadAsync(require("./assets/audio/small-group-clapping-hands.mp3")),
            assets.ohYeahAudio.loadAsync(require("./assets/audio/oh-yeah.mp3")),
            assets.collectCoinAudio.loadAsync(require("./assets/audio/collect-coin.mp3")),

            assets.colors.red.loadAsync(require("./assets/audio/colors/01-red.mp3")),
            assets.colors.black.loadAsync(require("./assets/audio/colors/02-black.mp3")),
            assets.colors.green.loadAsync(require("./assets/audio/colors/03-green.mp3")),
            assets.colors.yellow.loadAsync(require("./assets/audio/colors/04-yellow.mp3")),
            assets.colors.white.loadAsync(require("./assets/audio/colors/05-white.mp3")),
            assets.colors.pink.loadAsync(require("./assets/audio/colors/06-pink.mp3")),
            assets.colors.purple.loadAsync(require("./assets/audio/colors/07-purple.mp3")),
            assets.colors.orange.loadAsync(require("./assets/audio/colors/08-orange.mp3")),
            assets.colors.violet.loadAsync(require("./assets/audio/colors/09-violet.mp3")),
            assets.colors.blue.loadAsync(require("./assets/audio/colors/10-blue.mp3")),
            assets.colors.grey.loadAsync(require("./assets/audio/colors/11-grey.mp3")),

            Asset.loadAsync([
                require('./assets/images/thumbs-up.png'),
                require('./assets/images/play-button.png')
            ])
        ]);
    }

    function handleLoadingError(error) {
        // In this case, you might want to report the error to your error reporting
        // service, for example Sentry
        // console.warn(error);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
