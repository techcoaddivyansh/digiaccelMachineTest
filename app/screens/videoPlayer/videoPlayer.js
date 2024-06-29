import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Video from 'react-native-video';
import Accordion from '../../components/accordian';
import VideoController from '../../components/videoController';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useDispatch } from 'react-redux';
import { playDuration, playedDuration } from '../../redux/actions/mainActions';
import Feather from "react-native-vector-icons/Feather";
import { Box, Center, Pressable, useColorModeValue, TextArea, Button, Avatar } from 'native-base';
import Timeline from 'react-native-timeline-flatlist';
import Circle from '../../components/circle';

const FirstRoute = ({ queries }) => (
    <View style={{ flex: 1, height: "100%", backgroundColor: "white" }}>
        <View style={{ flex: 1, paddingVertical: 15, paddingHorizontal: 15, backgroundColor: "#f2f3f7", borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}>
            <TextArea
                h={20}
                placeholder="Ask your queries here"
                placeholderTextColor={"#f2f3f7"}
                shadow={2}
                w="100%"
                backgroundColor={"white"}
                borderColor={"white"} />
            <Button size="sm" mt={5} alignSelf={"flex-end"} borderRadius={6} backgroundColor={"blue.700"}>
                Submit Query
            </Button>
        </View>
        <View style={{ flex: 1, padding: 15, flexDirection: "row", marginTop: 15 }}>
            <Text style={{ color: "black" }}>Asked queries</Text>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
            {
                queries.map((val, idx) => {
                    console.log(val)
                    return (
                        <View style={{ flex: 1, width: val.sender ? "90%" : "100%", backgroundColor: "#f2f3f7", padding: 15, borderRadius: 15, marginBottom: 10, alignSelf: "flex-end" }} key={idx}>
                            {
                                !val.sender ?
                                    <>
                                        <Text style={{ color: "black" }}>{val.message}</Text>
                                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                                            <Text style={{ color: "black" }}>{val.time}</Text>
                                            <Text style={{ color: "black" }}>{val.name}</Text>
                                        </View>
                                    </>
                                    :
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Avatar bg="green.500" source={{
                                            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                                        }}></Avatar>
                                        <Text style={{ color: "black", marginLeft: 6 }}>{val.message}</Text>
                                    </View>
                            }
                        </View>
                    )
                })
            }
        </View>
    </View >
);

const SecondRoute = () => (
    <Center my="4">
        Handle notes here!
    </Center>
);


const initialLayout = {
    width: Dimensions.get('window').width / 2
};

const VideoPlayerScreen = ({ navigation, route }) => {
    const videoContent = route.params;
    const videoRef = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [muted, setMuted] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const dispatch = useDispatch();
    console.log(videoContent)

    const toggleMute = () => {
        setMuted(!muted);
    };

    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
        navigation.navigate("VideoPlayerAloneScreen", {
            ...videoContent,
            currentTime,
            duration,
            isPlaying,
            muted,
        });
    };

    const handleSeek = (time) => {
        videoRef.current.seek(time);
        setCurrentTime(time);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const onPlayerProgress = (progress) => {
        setCurrentTime(progress.currentTime);
        dispatch(playedDuration({ currentTime: progress.currentTime, data: videoContent }));
    };

    const [index, setIndex] = useState(0);
    const routes = [
        { key: 'first', title: 'Queries', icon: "" },
        { key: 'second', title: 'Notes' }
    ];

    const renderScene = SceneMap({
        first: () => <FirstRoute queries={videoContent.queries} />,
        second: SecondRoute
    });

    const renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        return (
            <Box flexDirection="row" paddingX={5}>
                {props.navigationState.routes.map((route, i) => {
                    const color = index === i ? useColorModeValue('#000', '#e5e5e5') : useColorModeValue('#1f2937', '#a1a1aa');
                    const borderColor = index === i ? 'cyan.500' : "transparent";
                    return (
                        <Pressable onPress={() => setIndex(i)} key={i}>
                            <Box borderBottomWidth="3" borderColor={borderColor} justifyContent={"center"} width={150} flexDirection={"row"} alignItems="center" p="3" cursor="pointer" key={route.key}>
                                <Feather name="message-circle" size={18} />
                                <Text style={{ color, marginLeft: 5 }}>{route.title}</Text>
                            </Box>
                        </Pressable>
                    );
                })}
            </Box>
        );
    };

    const renderMyItem = () => {
        return (
            <>
                <Accordion title="Content List" leftIconName="list" listData={videoContent.playlist}>
                    {/* Content inside accordion if any */}
                    
                </Accordion>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    renderTabBar={renderTabBar}
                    onIndexChange={setIndex}
                    style={{ marginTop: 15 }}
                />
            </>
        );
    };

    return (

        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 10, padding: 20 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginRight: 10 }}>
                    <Ionicons name="arrow-back" size={18} color="black" />
                </TouchableOpacity>
                <Text>Back</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingBottom: 15 }}>
                <View style={{ flex: 2 }}>
                    <Text style={{ fontSize: 18 }} numberOfLines={1}>{videoContent.courseName}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
                        <FontAwesome name="angle-left" size={15} color="blue" />
                        <Text style={{ marginLeft: 10, color: "blue" }}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginLeft: 25 }}>
                        <Text style={{ marginRight: 10, color: "blue" }}>Next</Text>
                        <FontAwesome name="angle-right" size={15} color={"blue"} />
                    </TouchableOpacity>
                </View>
            </View>



            <Video
                source={{ uri: videoContent.playlist[0].videoUrl }}
                paused={!isPlaying}
                pictureInPicture={true}
                playInBackground={true}
                muted={muted}
                ref={videoRef}
                onLoad={(value) => {
                    dispatch(playDuration({ totalDuration: value.duration, data: videoContent }));
                    setDuration(value.duration);
                }}
                onProgress={onPlayerProgress}
                onBuffer={() => { console.log("On Buffer") }}
                onError={() => { console.log("Error") }}
                style={styles.backgroundVideo}
            />

             <VideoController
                duration={duration}
                currentTime={currentTime}
                fullscreen={fullscreen}
                muted={muted}
                toggleFullscreen={toggleFullscreen}
                onSeek={handleSeek}
                toggleMute={toggleMute}
                onPlayPause={handlePlayPause}
                isPlaying={isPlaying}
            />
             <FlatList data={[1]} style={{flex:1}} renderItem={renderMyItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundVideo: {
        aspectRatio: 1920 / 1080
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 65,
        backgroundColor: 'white'
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
});

export default VideoPlayerScreen;
