import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Video from 'react-native-video';
import VideoController from '../../components/videoController';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const VideoPlayerAloneScreen = ({ navigation, route }) => {
    // Retrieve video details from route params
    const videoContent = route.params;
    const videoRef = useRef();
    const [currentTime, setCurrentTime] = useState(route.params.currentTime);
    const [duration, setDuration] = useState(route.params.duration);
    const [isPlaying, setIsPlaying] = useState(route.params.isPlaying);
    const [muted, setMuted] = useState(route.params.muted);
    const [showController, setShowController] = useState(false);
    const isFocused = useIsFocused()
    // console.log(route.params, "Route")

    useFocusEffect(
        useCallback(() => {
            if (isFocused) {
                if (videoRef.current && currentTime) {
                    videoRef.current.seek(currentTime); // Seek to the specified currentTime
                }
            }
        }, [])
    )

    const translateY = useRef(new Animated.Value(0)).current;

    // Function to toggle full-screen mode
    const toggleFullScreen = () => {
        navigation.goBack(); // Navigate back to previous screen
    };

    // Function to handle seek in the video
    const handleSeek = (time) => {
        videoRef.current.seek(time);
        setCurrentTime(time);
    };

    // Function to handle play/pause of the video
    const handlePlayPause = () => {
        setIsPlaying(!isPlaying); // Toggle play/pause state
    };

    // Function to update current time during playback
    const onPlayerProgress = (progress) => {
        setCurrentTime(progress.currentTime);
    };

    // Function to toggle video controller visibility with smooth animation
    const toggleController = () => {
        Animated.timing(translateY, {
            toValue: showController ? 0 : 100,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setShowController(!showController);
    };

    return (
        <View style={styles.container}>
            {/* Video Container */}
            <TouchableOpacity
                style={[styles.videoContainer, styles.fullScreenVideo]}
                onPress={toggleController} // Show controller on tap
                activeOpacity={1} // Disable tap feedback
            >
                {/* Video Component */}
                <Video
                    source={{ uri: videoContent.playlist[0].videoUrl }}
                    controls={false} // Controls managed by VideoController component
                    paused={!isPlaying} // Ensure proper handling of play/pause state
                    pictureInPicture={true}
                    playInBackground={true}
                    muted={muted}
                    ref={videoRef}
                    onLoad={(value) => setDuration(value.duration)}
                    onProgress={onPlayerProgress}
                    onError={(error) => console.log("Video Player Error: ", error)} // Log any errors
                    style={styles.backgroundVideo}
                />
            </TouchableOpacity>

            {/* Video Controller */}
            <Animated.View style={[styles.controller, { transform: [{ translateY }] }]}>
                <VideoController
                    duration={duration}
                    currentTime={currentTime}
                    muted={muted}
                    fullscreen={false} // Not in fullscreen mode here
                    toggleFullscreen={toggleFullScreen}
                    onSeek={handleSeek}
                    toggleMute={() => setMuted(!muted)}
                    onPlayPause={handlePlayPause}
                    isPlaying={isPlaying}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenVideo: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controller: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white', // Background color for controller
        zIndex: 3,
    },
});

export default VideoPlayerAloneScreen;