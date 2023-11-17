import { View, Text, TextInput, Pressable,Alert } from "react-native";
import React, { useState } from "react";
import { styles } from "../utils/styles";
import {Text_Botton} from "./Botton"

//👇🏻 Import socket from the socket.js file in utils folder
import socket from "../utils/socket";

const Modal = ({ setVisible }) => {
    const [groupName, setGroupName] = useState("");

    //👇🏻 Function that closes the Modal component
    const closeModal = () => setVisible(false);

    //👇🏻 Logs the group name to the console
    const handleCreateRoom = () => {
        if(groupName.length > 0){
            socket.emit("createRoom", groupName);
            closeModal();
        }else{
            Alert.alert("Write something!");
        }
    };
    return (
        <View
            className='w-screen h-fit bottom-0 rounded-t-[50px] bg-purple-300 absolute z-10 py-[50] px-[20px]'
        >
            
            <Text 
                 className='text-3xl text-purple-900 font-bold m-5 text-center'
            >Create Group</Text>
            <TextInput
                className='p-6 bg-white text-md text-slate-900 rounded-full'
                placeholder='Enter a group name ...'
                placeholderTextColor={'gray'}
                onChangeText={(value) => setGroupName(value)}
            />

            <View
                style={{gap:10}}
                className='flex-row justify-center mt-5'
            >
                <Text_Botton title={'CANSEL'} textColor={'text-slate-950'} color={'bg-transparent'} func={closeModal}/>
                <Text_Botton title={'CREATE'} textColor={'text-slate-950'} color={'bg-green-500'} func={handleCreateRoom}/>
            </View>
        </View>
    );
};

export default Modal;