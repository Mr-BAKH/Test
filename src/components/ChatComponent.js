import { View, Text, Pressable } from "react-native";
import React, { useState, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../utils/styles";

const ChatComponent = ({ item, username }) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState();
    const [lastuser, setLastUser] = useState('')

    //👇🏻 Retrieves the last message in the array from the item prop
    useMemo(() => {
        if(item.messages[item.messages.length - 1]){
            setMessages(item.messages[item.messages.length - 1]);
            setLastUser(item.messages[item.messages.length - 1].user)
        }
    },[item]);

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
            className='w-full flex-row bg-gray-200 items-center rounded-md px-[15px] h-[80px] mb-[10px] '
            onPress={handleNavigation}>
            
            <View style={styles.crightContainer}>
                <View>

                    <Text 
                        className='text-lg text-purple-700 font-bold mb-3'
                    >{item.roomName}</Text>
                    <Text 
                        className='text-md text-slate-700'
                    >
                        {messages?.type === 'VOICE'&& `voice from ${lastuser?.length>7? lastuser.slice(0,7)+'...': lastuser}`}
                        {messages?.type === 'VIDEO'&& `video from ${lastuser?.length>7? lastuser.slice(0,7)+'...': lastuser}`}
                        {messages?.type === 'PHOTO'&& `photo from ${lastuser?.length>7? lastuser.slice(0,7)+'...': lastuser}`}
                        {messages?.type === 'TEXT'&& (messages.text?.length > 10? messages.text.slice(0,10)+'...': messages.text)+` from ${lastuser?.length>7? lastuser.slice(0,7)+'...': lastuser}`}
                        {messages== undefined && "Tap to start chatting" }
                    </Text>
                </View>
                <View>
                    <Text 
                        className='text-slate-400'
                    >
                        last change /{messages?.time ? messages.time : "now"}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ChatComponent;