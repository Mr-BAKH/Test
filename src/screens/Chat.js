import React,{useState, useEffect,useLayoutEffect, useMemo} from "react";
import { View, Text, Pressable, SafeAreaView, FlatList,StatusBar } from "react-native";
import {Icon_Botton} from '../components/Botton'
import {faUserGroup,faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import socket from "../utils/socket";

//👇🏻 The Modal component
import Modal from "../components/Modal";
import ChatComponent from "../components/ChatComponent";
import { styles } from "../utils/styles";
import CheckPermision from '../utils/checkpermission'

//set socket valu for know about the chage in socket


socket.on("roomsList", async(data) => {
    let trust = await data;
    if(trust){
        return data;
    }else{
        console.log('data did not find!')
        return null;
    }
});

const Chat = ({route}) => {
    
    const { username } = route.params;
    const [visible, setVisible] = React.useState(false); //default false
    const [rooms, setRooms] = useState([]);
    
    let socketRead = socket;
    useMemo(()=>{
        socket.on("roomsList", async(data) => {
            let trust = await data;
            if(trust){
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
    CheckPermision(); // check permision!
}, []);


    return (
        <SafeAreaView
            className='bg-white flex-1 relative p-[10px]'
        >
            <StatusBar barStyle={'dark-content'} backgroundColor={'white'}/>
            <View
                className='bg-purple-900 rounded-md h-[70px] w-full p-[20px] justify-center mb-[15px]'
            >
                <View
                    className="flex-row justify-between items-center "
                >
                    <Text
                        className='text-purple-400 font-bold text-xl'
                    >Chat Application</Text>

            {/* 👇🏻 Logs "ButtonPressed" to the console when the icon is clicked */}
                <View className="flex-row">
                    <Icon_Botton icon={faUserGroup} color={'lightgray'} func={() => setVisible(true)}/>
                    <Icon_Botton icon={faMagnifyingGlass} color={'lightgray'} func={() => console.log('search...')}/>
                </View>
                </View>
            </View>

            <View style={styles.chatlistContainer}>
                {rooms.length > 0 ? (
                    <FlatList
                        data={rooms}
                        renderItem={({ item }) => <ChatComponent item={item} username={username} />}
                        keyExtractor={(item) => item.id}
                    />
                ) : (
                    <View style={styles.chatemptyContainer}>
                        <Text style={styles.chatemptyText}>No rooms created!</Text>
                        <Text>Click the icon above to create a Chat room</Text>
                    </View>
                )}
            </View>
           
            {visible ? <Modal setVisible={setVisible} /> : ""}
        </SafeAreaView>
    );
};

export default Chat;