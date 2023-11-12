import React, { useLayoutEffect, useState, useEffect, useMemo } from "react";
import { View, TextInput,Image, Text, FlatList, Pressable,Platform,Alert } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
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
import {faPaperPlane,faVideo,faCamera,faStop,faMicrophoneLines,faPlay,faXmark,faPause} from '@fortawesome/free-solid-svg-icons';
import socket from "../utils/socket";
import {Icon_Botton} from '../components/Botton'
import MessageComponent from "../components/MessageComponent";
import {fileToBase64} from '../utils/blob'

const Messaging = ({ route, navigation }) => {

    var lesonSocket = socket; 

    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState('');
    const [isRecordVoice, setIsRecordVoice] = useState(false)
    const [voice, setVoice] = useState<any>()
    const [voicePath, setVoicePath] = useState<any>('')
    const [showPlayVoice,setShowPlayVoice] = useState(false)
    const [progressVoice,setProgressVoice] = useState(0)
    // set camera state
    const [photo,setPhoto] = useState<string>('')
    const [photoFile,setPhotoFile] = useState<string>('')
    const [showImage, setShowImage]= useState<boolean>(false);// default is fualse
    //set video state
    const [video,setVideo] = useState<string>('')
    const [videoFile,setVideoFile] = useState<string>('')
    const [showVideo, setShowVideo]= useState<boolean>(false);// default

    const { name, id, username } = route.params;
    

    useLayoutEffect(() => {
        navigation.setOptions({ title: name });
        socket.emit("findRoom", id);
        socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
        setUser(username)
    }, []);

    useMemo(() => {
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
            setVoice(undefined)
        }
        if(message.length ==0 && voice == undefined && photoFile !== ''){
            type ='PHOTO';
            if(photo){
                socket.emit("newMessage", {
                    message: photoFile,
                    room_id: id,
                    user,
                    type: type ,
                    timestamp: { hour, mins },
                });
            }
            // clear photo and show photo
            setPhoto('');setShowImage(false)
        }
        if(message.length ==0 && voice == undefined && photoFile == '' && videoFile !== ''){
            type ='VIDEO';
            socket.emit("newMessage", {
                message: videoFile,
                room_id: id,
                user,
                type: type ,
                timestamp: { hour, mins },
            });
            // clear video state
            setVideo('')
            setVideoFile('')
        }
        // if client dont sent anythings
        if((message.length == 0 || photoFile == ''|| voice == undefined) && type == ''){
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
        setPhoto('');setPhotoFile('')
        
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

            // setVoice(audioRecorderPlayer)

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
                    // console.log('bakhListener>>>',e.currentPosition,audioRecorderPlayer.mmssss(
                    //     Math.floor(e.currentPosition)))
                });
            }else{
                rej('ERROR in recording!')
            }
            // setVoice(audioRecorderPlayer)
            // setIsRecordVoice(!isRecordVoice)
        })
        .then(val => {
            console.log("promise Responce from Start Recording >>>",val)
            setIsRecordVoice(!isRecordVoice)
            setVoice(audioRecorderPlayer)
            // setVoice(val)
        })
        .catch(error => console.log("ERROR in Recording Voice!",error))

        
    }

    const handlePlayVoice = async (): Promise<void> => {
        if(voice && !isRecordVoice){
            try {
              await voice.startPlayer(voicePath);
              voice.addPlayBackListener((e: PlayBackType) => {
                setProgressVoice(e.currentPosition/e.duration)
                if(e.currentPosition/e.duration == 1) {
                    setTimeout(() => {
                        setProgressVoice(0)            
                    }, 500);
                }
                // console.log(progress)
              });
            } catch (err) {
              console.log('startPlayer error', err);
            }
        }
      };

    const handleCamera = async(): Promise<void> =>{
        // clear all input
        setMessage('');
        if(voice){
            stopRecordingVoice();
            setVoice(undefined);
        }
        try{
            await launchCamera(
                {
                    mediaType:'photo',
                    includeBase64:true,
                    quality: 0.2 // set quality of the image
                },
            ).then(val=>{
                if(val.assets[0]){
                    // console.log(result.assets[0].originalPath)
                    RNFS.writeFile(val.assets[0].uri, val.assets[0].base64,'base64')
                    .then(() =>
                        console.log('write file successfully!')
                    ).catch(e =>{
                        console.log('Error in reading file',e)
                    })
                    setShowImage(true)
                    setPhoto(val.assets[0].uri);
                    setPhotoFile(val.assets[0].base64);
                }
            })
        }catch(e){
            console.log('ERROR in lunch camrea!',e)
        }
    }

    const handleVideoRecord = async(): Promise<void> =>{
        // clear all input
        setMessage('');
        setPhoto('');setPhotoFile('');setShowImage(false);
        if(voice){
            stopRecordingVoice();
            setVoice(undefined);
        }

        try{
            await launchCamera(
                {
                    mediaType:'video',
                    videoQuality:'low',
                },
            ).then(async(val:any)=>{
                if(val.assets[0].uri){
                    const file = await fileToBase64(val.assets[0].uri);
                    if(file){
                        setVideoFile(file)
                        console.log(file.length)
                    }else{
                        console.log('video file is not useable <<<')
                    }
                }
            })
        }catch(e){
            console.log('ERROR in lunch Video Record!',e)
        }
    }

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
                            <MessageComponent item={item} user={user} isrecording={isRecordVoice} voice={voice} setVoice={setVoice} />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                )}
                </View>
                {/* Voice Preview */}
                {
                    !isRecordVoice && voice !== undefined && voicePath!== '' && showPlayVoice &&
                        <View  
                            style={{shadowColor:'darkred'}}
                            className='flex-row bg-gray-900/90  rounded-full backdrop-blur-lg p-[5px] shadow-md absolute w-fit items-center justify-end bottom-[77px]'
                        >
                            <View className='jutify-center items-center ml-[10px]'>
                                <Progress.Bar 
                                    width={wp('50%')}
                                    height={5}
                                    color={'rgba(255,255,255,0.1)'} 
                                    borderWidth={0}
                                    progress={1} 
                                    className='absolute'
                                />
                                <Progress.Bar 
                                width={wp('50%')}
                                height={5}
                                color={progressVoice > 0  ?'rgba(0,0,0,0.9)':'transparent'} 
                                borderWidth={0}
                                progress={progressVoice > 0 ? progressVoice:0} 
                                indeterminateAnimationDuration={1000}
                                />

                            </View>
                            <Icon_Botton icon={progressVoice !== 0? faPause :faPlay} color={'darkred'} func={handlePlayVoice}/>
                            {/* cancel icon */}
                            <View className='absolute right-[-20%] bg-gray-900/90 rounded-full justify-center items-center'>
                                <Icon_Botton icon={faXmark} color={'darkred'} func={()=>setVoice(undefined)}/>
                            </View>
                        </View>
                }
                {/* image preview */}
                {showImage && photoFile && photo  && 
                    <View  
                    style={{shadowColor:'black',width:wp(60),height:wp(60)}}
                    className='flex-row overflow-hidden bg-white  rounded-lg object-cover backdrop-blur-lg  shadow-md p-2 pb-5 absolute w-fit items-center justify-end bottom-[80px]'
                    >
                      <View className= 'w-full h-full relative'>
                        <Image
                          source={photo?{uri: photo}:require('../assets/image/mercedes-maybach-s-class-haute-voiture.jpg')}
                          className='w-full h-full'
                        //   resizeMode="cover"
                        />
                         {/* cancel icon */}
                         <View className='absolute right-1 top-1 bg-gray-900/90 rounded-full justify-center items-center'>
                            <Icon_Botton icon={faXmark} color={'darkred'} func={()=>{setPhoto('');setPhotoFile('')}}/>
                        </View>
                      </View>
                    </View>
                }
                {/* controll botton and inpute */}
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
                        <Icon_Botton activeShadow={false} colorShadow={''} icon={faVideo} color={'rgba(255,255,255,0.5)'} func={handleVideoRecord}/>
                        <Icon_Botton activeShadow={false} colorShadow={''} icon={faCamera} color={'rgba(255,255,255,0.5)'} func={handleCamera}/>
                        <Icon_Botton activeShadow={isRecordVoice&& true} colorShadow={'red'} icon={isRecordVoice? faStop:faMicrophoneLines} color={isRecordVoice?'darkred':'rgba(255,255,255,0.5)'} func={handleRecordVoice}/>
                       {!isRecordVoice && <Icon_Botton backColor={'purple'}  activeShadow={true} colorShadow={''} icon={faPaperPlane} color={'white'} func={handleNewMessage}/>}
                    </View>
            </View>
            </View>
        </View>
    );
};

export default Messaging;


