import { View, Text, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {Icon_Botton} from './Botton'
// import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../utils/styles";

const ChatComponent = ({ item, username }) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState({});

    //👇🏻 Retrieves the last message in the array from the item prop
    useLayoutEffect(() => {
        setMessages(item.messages[item.messages.length - 1]);
    }, []);

    ///👇🏻 Navigates to the Messaging screen
    const handleNavigation = () => {
        navigation.navigate("Messaging", {
            id: item.id,
            name: item.roomName,
            username
        });
    };

    return (
        <Pressable
            className='w-full flex-row bg-gray-100 items-center rounded-md px-[15px] h-[80px] mb-[10px] '
            onPress={handleNavigation}>
            
            <View style={styles.crightContainer}>
                <View>

                    <Text style={styles.cusername}>{item.roomName}</Text>
                    <Text style={styles.cmessage}>
                        {messages? messages?.type === 'VOICE'? 'voice': (messages.text?.length > 20? messages.text.slice(0,20)+'...': messages.text) : "Tap to start chatting"}
                    </Text>
                </View>
                <View>
                    <Text style={styles.ctime}>
                        last change /{messages?.time ? messages.time : "now"}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ChatComponent;