import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, StatusBar } from 'react-native'
import React from 'react'
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { ProgressBar, MD3Colors } from 'react-native-paper';
import { Box, Progress } from 'native-base';
import { navigationRef } from '../../navigations/mainNavigation'
import { useSelector } from 'react-redux'

const renderItem = ({ item }) => (
    <View style={styles.itemProgress}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "flex-start" }} onPress={() => {
            navigationRef.navigate("VideoPlayerScreen", {
                ...item
            })
        }}>
            <View style={{ width: 110, height: 120, borderRadius: 10, overflow: "hidden" }}>
                <Image source={{ uri: item.imageUrl }} style={{ height: 120, width: 110, objectFit: "cover" }} />
            </View>
            <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 18 }}>{item.courseName}</Text>
                <Text style={{ color: "blue", marginTop: 5 }}>{`${sumPlaylistDuration(item.playlist).hours}h ${sumPlaylistDuration(item.playlist).minutes > 0 ? sumPlaylistDuration(item.playlist).minutes + "m Learning left" : "Learning left"}`}</Text>
                <Box w="100%" mt={6} >
                    <Progress value={sumPlaylistDurationWatched(item.playlist)} colorScheme="primary" />
                </Box>
                <Text style={{ fontSize: 18 }}>{sumPlaylistDurationWatched(item.playlist)}%</Text>

            </View>
        </TouchableOpacity>
    </View>
);

const renderItemRecentlyCompleted = ({ item }) => (
    <View style={styles.item}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "flex-start" }} onPress={() => {
            navigationRef.navigate("VideoPlayerScreen", {
                ...item
            })
        }} >
            <View style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden" }}>
                <Image source={{ uri: item.imageUrl }} style={{ height: 60, width: 60, objectFit: "cover" }} />
            </View>
            <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 18 }}>{item.courseName}</Text>
                <Text style={{ color: "green", marginTop: 5, textAlignVertical: "center" }}>{`${sumPlaylistDuration(item.playlist).hours}h ${sumPlaylistDuration(item.playlist).minutes > 0 ? sumPlaylistDuration(item.playlist).minutes + "m completed" : "completed"}`} <AntDesign name={"checkcircle"} size={14} color="green" /></Text>
            </View>
        </TouchableOpacity>
    </View>
);

const renderItemVertical = ({ item }) => (

    <View style={styles.itemVertical}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "flex-start" }} onPress={() => {
            navigationRef.navigate("VideoPlayerScreen", {
                ...item
            })
        }}>
            <View style={{ width: 90, height: 90, borderRadius: 10, overflow: "hidden" }}>
                <Image source={{ uri: item.imageUrl }} style={{ height: 90, width: 90, objectFit: "cover" }} />
            </View>
            <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 18 }}>{item.courseName}</Text>
                {item.isFree ?
                    <>
                        <Text style={{ color: "blue", marginTop: 5 }}>{`${sumPlaylistDuration(item.playlist).hours}h ${sumPlaylistDuration(item.playlist).minutes > 0 ? sumPlaylistDuration(item.playlist).minutes + "m Learning left" : "Learning left"}`}</Text>
                        <Box w="100%" mt={6} >
                            <Progress value={sumPlaylistDurationWatched(item.playlist)} colorScheme="primary" />
                        </Box>
                    </>
                    :
                    <View style={{ marginTop: 5, flexDirection: "row", alignItems: "center" }}>
                        <SimpleLineIcons name="lock" size={18} />
                        <Text style={{ fontSize: 16, marginLeft: 8 }}>Locked</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    </View>
);

function sumPlaylistDuration(playlist) {
    if (playlist.reduce((total, video) => total + video.completed, 0) === 0) {
        return {
            hours: 0,
            minutes: 0
        }
    }
    const totalDurationInSeconds = playlist.reduce((total, video) => total + video.duration, 0) - playlist.reduce((total, video) => total + video.completed, 0);
    // const totalDurationWatchedInSeconds = playlist.reduce((total, video) => total + video.completed, 0);
    const hours = Math.floor(totalDurationInSeconds / 3600);
    const minutes = Math.floor((totalDurationInSeconds % 3600) / 60);
    return { hours, minutes };
}

function sumPlaylistDurationWatched(playlist) {
    const totalDurationInSeconds = playlist.reduce((total, video) => total + video.duration, 0);
    const totalDurationWatchedInSeconds = playlist.reduce((total, video) => total + video.completed, 0);
    return Math.floor(totalDurationWatchedInSeconds / totalDurationInSeconds * 100)
}

const DashboardScreen = ({ navigation }) => {

    const dummyData = useSelector(state=> state.mainReducer.dummyData)
    // console.log(dummyData[0].playlist[0], "Hello")
    return (
        <View style={{ flex: 1 }}>
            <StatusBar
                barStyle={"light-content"}
                backgroundColor={"black"}
            />
            <View style={{ flex: 2, padding: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingBottom: 10 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginRight: 10 }}>
                        <Ionicons name="arrow-back" size={18} color="black" />
                    </TouchableOpacity>
                    <Text>Back to Dashbard</Text>
                </View>

                <Text style={styles.heading}>In Progress</Text>
                <FlatList
                    data={dummyData}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                        flexGrow: 0,
                        height: 400,
                        marginBottom: 10
                    }}
                />
                <Text style={styles.heading}>Recent Completed</Text>
                <FlatList
                    data={dummyData.filter((val) => {
                        return val.playlist.reduce((total, video) => total + video.completed, 0)
                    })}
                    renderItem={renderItemRecentlyCompleted}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalList}
                />
            </View>
            <View style={{ flex: 1.5, backgroundColor: "white", padding: 20 }}>
                <Text style={styles.heading}>Upcoming Modules</Text>
                <FlatList
                    data={dummyData}
                    renderItem={renderItemVertical}
                    showsVerticalScrollIndicator={false}
                    style={styles.verticalList}
                />
            </View>
        </View>
    )
}

export default DashboardScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    horizontalList: {
        flexGrow: 0,
        height: 250,
        marginBottom: 10,
    },
    verticalList: {
        flex: 1,
    },
    itemProgress: {
        flex: 1,
        backgroundColor: 'white',
        marginVertical: 8,
        padding: 15,
        marginRight: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    item: {
        backgroundColor: 'white',
        paddingRight: 20,
        padding: 15,
        marginVertical: 8,
        marginRight: 16,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    itemVertical: {
        backgroundColor: 'white',
        marginVertical: 8,
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    },
    title: {
        fontSize: 16,
    },
});