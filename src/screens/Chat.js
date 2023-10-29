import React from "react";
import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";

import ChatComponent from "../component/ChatComponent";
import { styles } from "../utils/styles";
import Modal from "../component/Modal";

const Chat = () => {
    const [visible, setVisible] = useState(false);

    //👇🏻 Dummy list of rooms
    const [rooms, setRooms] = useState([]);

    //👇🏻 Runs when the component mounts
    useLayoutEffect(() => {
        function fetchGroups() {
            fetch("http://localhost:4000/api")
                .then((res) => res.json())
                .then((data) => setRooms(data))
                .catch((err) => console.error(err));
        }
        fetchGroups();
    }, []);

    //👇🏻 Runs whenever there is new trigger from the backend
    useEffect(() => {
        socket.on("roomsList", (rooms) => {
            setRooms(rooms);
        });
    }, [socket]);

    return (
        <SafeAreaView style={styles.chatscreen}>
            <View style={styles.chattopContainer}>
                <View style={styles.chatheader}>
                    <Text style={styles.chatheading}>Chats</Text>

                    {/* Displays the Modal component when clicked */}
                    <Pressable onPress={() => setVisible(true)}>
                        <Feather name='edit' size={24} color='green' />
                    </Pressable>
                </View>
            </View>

            <View style={styles.chatlistContainer}>...</View>
            {/*
                Pass setVisible as prop in order to toggle 
                the display within the Modal component.
            */}
            {visible ? <Modal setVisible={setVisible} /> : ""}
        </SafeAreaView>
    );
};

export default Chat;