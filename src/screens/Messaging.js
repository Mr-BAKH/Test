import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, Pressable } from "react-native";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPaperPlane,faCamera,faMicrophoneLines} from '@fortawesome/free-solid-svg-icons';
import socket from "../utils/socket";
import {Icon_Botton} from '../components/Botton'
import MessageComponent from "../components/MessageComponent";

const Messaging = ({ route, navigation }) => {

    var lesonSocket = socket; 

    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState('')

    const { name, id, username } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({ title: name });
        socket.emit("findRoom", id);
        socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
        setUser(username)
    }, []);

    useEffect(() => {
        socket.on("foundRoom", (roomChats) => {
            setChatMessages(roomChats);
        });
    }, [lesonSocket])

   
    const handleNewMessage = ({username}) => {
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
            className='flex-1 bg-white'
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
                    className='flex-row px-[15px] shadow-2xl absolute bottom-5 w-[90%] rounded-3xl bg-purple-900 justify-center items-center'
                >
                    <TextInput
                        className="flex-grow max-w-[60%] text-white"
                        placeholder="write..."
                        placeholderTextColor={'white'}
                        onChangeText={(value) => setMessage(value)}
                        value={message}
                    />
                    <View
                        style={{gap:10}}
                        className='flex-row w-fit'
                    >
                        <Icon_Botton icon={faCamera} color={'lightgray'} func={()=>console.log('useCamera!')}/>
                        <Icon_Botton icon={faMicrophoneLines} color={'lightgray'} func={()=>console.log('useMicrophone!')}/>
                        <Icon_Botton icon={faPaperPlane} color={'white'} func={handleNewMessage}/>
                    </View>
            </View>
            </View>
        </View>
    );
};

export default Messaging;


