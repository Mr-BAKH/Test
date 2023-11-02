import React,{useState, useEffect,useLayoutEffect, useMemo} from "react";
import { View, Text, Pressable, SafeAreaView, FlatList } from "react-native";
import socket from "../utils/socket";

//👇🏻 The Modal component
import Modal from "../components/Modal";
import ChatComponent from "../components/ChatComponent";
import { styles } from "../utils/styles";

//set socket valu for know about the chage in socket


socket.on("roomsList", async(data) => {
    let trust = await data;
    if(trust){
        console.log('from socket! >>>>> ',data)
        return data;
    }else{
        console.log('data did not find!')
        return null;
    }
});

const Chat = () => {


    const [visible, setVisible] = React.useState(false); //default false
    //👇🏻 Dummy list of rooms
  
    const [rooms, setRooms] = useState([]);
    
    let socketRead = socket;
    useMemo(()=>{
        socket.on("roomsList", async(data) => {
            let trust = await data;
            if(trust){
                console.log('from socket! >>>>> ',data)
                setRooms(data)
            }else{
                console.log('data did not find!')
                return null;
            }
        });
    },[socketRead])

//👇🏻 Runs when the component mounts
useLayoutEffect(() => {
    const ip = '192.168.77.100' //
    function fetchGroups() {
        fetch(`http:///${ip}:4000/api`)
            .then((res) => res.json())
            .then((data) => {setRooms(data)})
            .catch((err) => console.error(err));
    }
    fetchGroups();
    console.log('get data from server!<<<<<')
}, []);


    return (
        <SafeAreaView style={styles.chatscreen}>
            <View style={styles.chattopContainer}>
                <View style={styles.chatheader}>
                    <Text
                        className='text-red-500 text-xl'
                    >Chats</Text>

            {/* 👇🏻 Logs "ButtonPressed" to the console when the icon is clicked */}
                    <Pressable onPress={() => setVisible(true)}>
                        {/* <Feather name='edit' size={24} color='green' /> */}
                        <Text>CreateRoom</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.chatlistContainer}>
                {rooms.length > 0 ? (
                    <FlatList
                        data={rooms}
                        renderItem={({ item }) => <ChatComponent item={item} />}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <View style={styles.chatemptyContainer}>
                        <Text style={styles.chatemptyText}>No rooms created!</Text>
                        <Text>Click the icon above to create a Chat room</Text>
                    </View>
                )}
            </View>
              {/*
                Pass setVisible as prop in order to toggle 
                the display within the Modal component.
            */}
            {visible ? <Modal setVisible={setVisible} /> : ""}
        </SafeAreaView>
    );
};

export default Chat;