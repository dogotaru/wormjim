import {AppLoading} from 'expo';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import React, {useState, useEffect} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
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
            assets.collectCoinAudio.setVolumeAsync(0.25);
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
            assets.collectCoinAudio.loadAsync(require("./assets/audio/collect-coin.mp3"))
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
