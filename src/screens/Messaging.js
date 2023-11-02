import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, Pressable } from "react-native";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPaperPlane,faCamera,faMicrophoneLines} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "../utils/socket";
import MessageComponent from "../components/MessageComponent";
import { styles } from "../utils/styles";

const Messaging = ({ route, navigation }) => {

    var lesonSocket = socket; // lesson to socket;

    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState("");

    //👇🏻 Access the chatroom's name and id
    const { name, id } = route.params;

//👇🏻 This function gets the username saved on AsyncStorage
    // const getUsername = async () => {
    //     try {
    //         const value = await AsyncStorage.getItem("username");
    //         if (value !== null) {
    //             setUser(value);
    //         }
    //     } catch (e) {
    //         console.error("Error while loading username!");
    //     }
    // };

    //👇🏻 This runs only initial mount
useLayoutEffect(() => {
    navigation.setOptions({ title: name });
    socket.emit("findRoom", id);
    socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
}, []);

//👇🏻 This runs when the messages are updated.
useEffect(() => {
    socket.on("foundRoom", (roomChats) => {
        setChatMessages(roomChats);
        console.log(roomChats)
    });
}, [lesonSocket])

    /*👇🏻 
        This function gets the time the user sends a message, then 
        logs the username, message, and the timestamp to the console.
     */
    const handleNewMessage = () => {
        setMessage(''); // clear message box
        const hour =
            new Date().getHours() < 10
                ? `0${new Date().getHours()}`
                : `${new Date().getHours()}`;

        const mins =
            new Date().getMinutes() < 10
                ? `0${new Date().getMinutes()}`
                : `${new Date().getMinutes()}`;

                socket.emit("newMessage", {
                    message,
                    room_id: id,
                    user,
                    timestamp: { hour, mins },
                });
    };

    return (
        <View   
            className='flex-1'
        >
            <View className="flex-1 relative items-center">
            <View className="flex-1 w-full">
                {chatMessages[0] && (
                    <FlatList
                        data={chatMessages}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{padding:15, paddingBottom:70}}
                        renderItem={({ item }) => (
                            <MessageComponent item={item} user={user} />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                )}
                </View>
                {/* controll botton */}
                <View
                    className='flex-row px-[5px] shadow-2xl absolute bottom-5 w-[90%] rounded-3xl bg-white justify-center items-center'
                >
                    <TextInput
                        className="flex-grow max-w-[60%]"
                        placeholder="write..."
                        onChangeText={(value) => setMessage(value)}
                        value={message}
                    />
                    <View
                        style={{gap:10}}
                        className='flex-row w-fit'
                    >
                        <Botton icon={faCamera} color={'gray'} func={()=>console.log('useCamera!')}/>
                        <Botton icon={faMicrophoneLines} color={'gray'} func={()=>console.log('useMicrophone!')}/>
                        <Botton icon={faPaperPlane} color={'darkblue'} func={handleNewMessage}/>
                    </View>
            </View>
            </View>
        </View>
    );
};

export default Messaging;


const Botton = ({icon,func,color})=>{
    return(
        <Pressable
            onPress={func}
            className="p-[8px] rounded-full"
        >
            <FontAwesomeIcon icon={icon} size={20} color={color}/>
        </Pressable>
    )
}