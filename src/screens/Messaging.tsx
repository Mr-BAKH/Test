import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, TextInput, Text, FlatList, Pressable,Platform } from "react-native";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    OutputFormatAndroidType,
  } from 'react-native-audio-recorder-player';
  import type {
    AudioSet,
    PlayBackType,
    RecordBackType,
  } from 'react-native-audio-recorder-player';

import {faPaperPlane,faCamera,faMicrophoneLines} from '@fortawesome/free-solid-svg-icons';
import socket from "../utils/socket";
import {Icon_Botton} from '../components/Botton'
import MessageComponent from "../components/MessageComponent";

const Messaging = ({ route, navigation }) => {

    var lesonSocket = socket; 

    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState('');
    const [isRecordVoice, setIsRecordVoice] = useState(false)
    const [voice, setVioce] = useState<any>()
    const [voicePath, setVoicePath] = useState<any>('')

    
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

    const handleRecordVoice = async()=>{
        
        if(!isRecordVoice){
           const audioRecorderPlayer = new AudioRecorderPlayer(); 
           const path = Platform.select({
                ios: undefined,
                android: undefined,
                // android: `${this.dirs.CacheDir}/hello.mp3`,
              });
              const audioSet: AudioSet = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 2,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
                OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
              };
            // start recording!
            return new Promise((res,rej)=>{
                const result = audioRecorderPlayer.startRecorder(path,audioSet);
                if(result){
                    res(result)
                    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
                        console.log('bakhListener>>>',e.currentPosition,audioRecorderPlayer.mmssss(
                            Math.floor(e.currentPosition)))
                      });
                }else{
                    rej('ERROR in recording!')
                }
                // setVioce(audioRecorderPlayer)
                // setIsRecordVoice(!isRecordVoice)
            })
            .then(val => {
                console.log("promise Responce from Start Recording >>>",val)
                setIsRecordVoice(!isRecordVoice)
                setVioce(audioRecorderPlayer)
                // setVioce(val)
            })
            .catch(error => console.log("ERROR in Recording Voice!",error))
        }else{
            // console.log(voice)
            // stop recording!
            // setIsRecordVoice(!isRecordVoice)
            return new Promise(async(res,rej)=>{
                const result = await voice.stopRecorder();
                if(result){
                    res(result)
                    voice.removeRecordBackListener();
                    // voice.setState({recordSecs: 0,});
                }else{rej('ERROR in stop!')};
              }).then(val => {
                console.log("promise Responce from Stop >>>",val)
                setVoicePath(val)
                setIsRecordVoice(!isRecordVoice)
                // setVioce(audioRecorderPlayer)

            }).catch(e=> console.log("ERROR in stop:",e))
        }
    }

    const handlePlayVoice = async (): Promise<void> => {
        console.log('onStartPlay',voicePath);
    
        try {
          const msg = await voice.startPlayer(voicePath);
    
          //? Default path
          // const msg = await this.audioRecorderPlayer.startPlayer();
          const volume = await voice.setVolume(1.0);
          console.log(`path: ${msg}`, `volume: ${volume}`);
    
          voice.addPlayBackListener((e: PlayBackType) => {
            console.log('playBackListener', e);
          });
        } catch (err) {
          console.log('startPlayer error', err);
        }
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
                    className='flex-row px-[15px] shadow-2xl absolute bottom-[100px] w-[90%] rounded-3xl bg-sky-900 justify-center items-center'
                >
                    <Text>play</Text>
                </View>
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
                        {/* <Icon_Botton icon={faPaperPlane} color={'white'} func={handlePlayVoice}/> */}
                        <Icon_Botton icon={faCamera} color={'lightgray'} func={()=>console.log('useCamera!')}/>
                        <Icon_Botton icon={faMicrophoneLines} color={isRecordVoice?'red':'lightgray'} func={handleRecordVoice}/>
                        <Icon_Botton icon={faPaperPlane} color={'white'} func={handleNewMessage}/>
                    </View>
            </View>
            </View>
        </View>
    );
};

export default Messaging;


