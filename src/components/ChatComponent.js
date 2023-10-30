import { View, Text, Pressable } from "react-native";
import React, { useLayoutEffect, useState } from "react";
// import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../utils/styles";

const ChatComponent = ({ item }) => {
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
        });
    };

    return (
        <Pressable style={styles.cchat} onPress={handleNavigation}>
            
            <View style={styles.crightContainer}>
                <View>
                    <Text style={styles.cusername}>{item.roomName}</Text>

                    <Text style={styles.cmessage}>
                        {messages?.text ? messages.text : "Tap to start chatting"}
                    </Text>
                </View>
                <View>
                    <Text style={styles.ctime}>
                        {messages?.time ? messages.time : "now"}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default ChatComponent;