import React, { useLayoutEffect, useState, useEffect, useMemo } from "react";
import { View, TextInput, Text, FlatList, Pressable,Platform,Alert } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
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
import RNFS from 'react-native-fs';
import {faPaperPlane,faCamera,faStop,faMicrophoneLines,faPlay,faXmark,faPause} from '@fortawesome/free-solid-svg-icons';
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
    const [showPlayVoice,setShowPlayVoice] = useState(false)
    const [progressVoice,setProgressVoice] = useState(0)

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

   
    const handleNewMessage = async() => {

        let type = '';
        const hour =
        new Date().getHours() < 10
            ? `0${new Date().getHours()}`
            : `${new Date().getHours()}`;

        const mins =
        new Date().getMinutes() < 10
            ? `0${new Date().getMinutes()}`
            : `${new Date().getMinutes()}`;

        if(message.length > 0 && voice == undefined){
            type = 'TEXT'
            socket.emit("newMessage", {
                message,
                room_id: id,
                user,
                type: type,
                timestamp: { hour, mins },
            });
            setMessage(''); // clear message box
        }
        if(message.length == 0 && voice !== undefined){
            stopRecordingVoice(); // stop recording if is running!
            type = 'VOICE'
            try{
               await RNFS.readFile(voicePath, 'base64').then(contents => {
                    let file = contents;
                    if(file){
                        socket.emit("newMessage", {
                            message: file,
                            room_id: id,
                            user,
                            type: type ,
                            timestamp: { hour, mins },
                        });
                    }
                });
            }catch(e){
                console.log('Read file from the RNFS')
            }
            setVioce(undefined)
        }
        // if client dont sent anythings
        if((message.length == 0 || voice == undefined)&& type == ''){
            console.log(message.length,voice,type);
            Alert.alert("send something!");
        }
        // if client write message and record voice
       
    };

    const handleRecordVoice = ()=>{
        if(message.length == 0){
            if(!isRecordVoice){
                    // start recording!
                    startRecordingVoice()
            }else{
            // stop recording!
            stopRecordingVoice()
            }
        }else{
            setMessage('');
        }
        
    }

    const stopRecordingVoice = async()=>{
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
            setIsRecordVoice(false)
            setShowPlayVoice(true)
            setProgressVoice(0)

            // setVioce(audioRecorderPlayer)

        }).catch(e=> console.log("ERROR in stop:",e))

    }

    const startRecordingVoice = async()=>{

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

        
    }

    const handlePlayVoice = async (): Promise<void> => {
    
        try {
          const msg = await voice.startPlayer(voicePath);
    
          //? Default path
          const volume = await voice.setVolume(1.0);
        //   console.log(`path: ${msg}`, `volume: ${volume}`);
    
          voice.addPlayBackListener((e: PlayBackType) => {
            // console.log('playBackListener', e);
            setProgressVoice(e.currentPosition/e.duration)
            if(e.currentPosition/e.duration == 1) {
                setProgressVoice(0)            
            }
            // console.log(progress)
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
                {
                    !isRecordVoice && voice !== undefined && voicePath!== '' && showPlayVoice &&
                        <View  
                            style={{shadowColor:'darkred'}}
                            className='flex-row bg-gray-900/90  rounded-full backdrop-blur-lg p-[5px] shadow-md absolute w-[75%] items-center justify-end bottom-[77px]'
                        >
                            <Progress.Bar 
                            className='absolute left-3'
                            width={wp('62%')}
                            height={5}
                            color={progressVoice == 0 ?'rgba(0,0,0,0.5)':'darkred'} 
                            borderWidth={0}
                            progress={progressVoice ==0 ? 1:progressVoice} 
                            //   progress={1} 
                            indeterminateAnimationDuration={500}
                            />
                            <Icon_Botton icon={progressVoice !== 0? faPause :faPlay} color={'darkred'} func={handlePlayVoice}/>
                            {/* cancel icon */}
                            <View className='absolute right-[-15%] bg-gray-900/90 rounded-full justify-center items-center'>
                                <Icon_Botton icon={faXmark} color={'darkred'} func={()=>setVioce(undefined)}/>
                            </View>
                        </View>
                }
                <View
                    style={{shadowColor:'purple'}}
                    className='flex-row px-[15px] absolute bottom-5 w-[90%] shadow-md rounded-3xl bg-purple-950 justify-center items-center'
                >
                    <TextInput
                        className="flex-grow max-w-[60%] text-white"
                        placeholder="write..."
                        placeholderTextColor={'white'}
                        onChangeText={(value) => {if(voice === undefined){setMessage(value)}}}
                        value={message}
                    />
                    <View
                        style={{gap:10}}
                        className='flex-row w-fit'
                    >
                        <Icon_Botton activeShadow={false} colorShadow={''} icon={faCamera} color={'rgba(255,255,255,0.5)'} func={()=>console.log('useCamera!')}/>
                        <Icon_Botton activeShadow={isRecordVoice&& true} colorShadow={'red'} icon={isRecordVoice? faStop:faMicrophoneLines} color={isRecordVoice?'darkred':'rgba(255,255,255,0.5)'} func={handleRecordVoice}/>
                        <Icon_Botton backColor={'purple'}  activeShadow={true} colorShadow={''} icon={faPaperPlane} color={'white'} func={handleNewMessage}/>
                    </View>
            </View>
            </View>
        </View>
    );
};

export default Messaging;


