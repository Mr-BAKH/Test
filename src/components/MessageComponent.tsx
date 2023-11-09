import { View, Text, Image } from "react-native";
import React,{useEffect,useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import AudioRecorderPlayer, {
  } from 'react-native-audio-recorder-player';
  import type {
    AudioSet,
    PlayBackType,
    RecordBackType,
  } from 'react-native-audio-recorder-player';
// import { Ionicons } from "@expo/vector-icons";
import { styles } from "../utils/styles";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import {Icon_Botton} from './Botton'
import RNFS from 'react-native-fs';
import {faPlay,faXmark,faPause} from '@fortawesome/free-solid-svg-icons';


export default function MessageComponent({ item, user,setVoice, voice, isrecording }) {
    const status = item.user !== user;    
    const [pathAudio, setPathAudio] = useState<string>('')
    const [pathPhoto, setPathPhoto] = useState<string>('')
    const [progressVoice, setProgressVoice] = useState<number>(0)
    const [isActive, SetIsActive] = useState<boolean>(false)
    
    const boxStyle=  status? 'rounded-bl-[0px] bg-purple-300': 'rounded-br-[0px] bg-sky-200'
    const boxStyleVoice=  status? 'rounded-bl-[0px] bg-purple-700': 'rounded-br-[0px] bg-sky-700'
    const boxStylePhoto=  status? 'rounded-bl-[0px] bg-purple-950': 'rounded-br-[0px] bg-sky-950'

    useEffect(()=>{
        if(item.type === 'VOICE' || item.type === "PHOTO"){
            const filePath = RNFS.DocumentDirectoryPath+(item.type =='VOICE'?`/${item.id}.mp3`: `/${item.id}.jpg`);

            RNFS.writeFile(filePath, item.text, 'base64')
            .then(() => {
                if(item.type === "VOICE"){
                    setPathAudio(filePath)
                    console.log('write audio file in  >> ',filePath)
                }else{
                    setPathPhoto('file://'+filePath)
                    console.log('write photo file in  >> ','file://'+filePath)
                }
            })
            .catch((error) => {
                console.error('Error saving audio file:', error);
            });
        }
    },[])



    const handlePlayVoice = async (): Promise<void> => {
        if(pathAudio !== ''&& !isActive && voice === undefined && !isrecording){
            setVoice(undefined); // clear chat room audio class
            SetIsActive(true)
            const voice = new AudioRecorderPlayer();
            try {
                await voice.startPlayer(pathAudio);
                voice.addPlayBackListener((e: PlayBackType) => {
                  setProgressVoice(e.currentPosition/e.duration)
                    if(e.currentPosition/e.duration == 1) {
                        setProgressVoice(0);  
                        SetIsActive(false)          
                    }
                });
              } catch (err) {
                console.log('startPlayer error', err);
              }      
        }
      };
    

    return (
        <View>
            <View
            style={
                status
                    ? styles.mmessageWrapper
                    : [styles.mmessageWrapper, { alignItems: "flex-end" }]
            }
        >
            {item?.type === "TEXT" &&
            <>
                <View className="flex-row items-end">
                {status && <FontAwesomeIcon style={{marginBottom:5}} icon={faUser} size={15} color={'gray'}/>}
                    <View
                        style={{shadowColor:'gray'}}
                        className={`max-w-[50%] px-[15px] py-[8px] shadow-lg rounded-lg  mb-1 ${boxStyle}`}
                        >
                    <Text className='text-[16px]'>{item.text}</Text>
                    {status && <Text className='text-[10px] tracking-wide text-gray-950/25'>{item.user}</Text>}
                    </View>
                </View>
                <Text className='text-xs'>{item.time}</Text>
            </>
            }
            {item?.type === "VOICE" &&
            <>
                <View className="flex-row items-end">
                {status && <FontAwesomeIcon style={{marginBottom:5}} icon={faUser} size={15} color={'gray'}/>}
                    <View
                        style={{shadowColor:'gray'}}
                        className={`px-[15px] py-[8px] shadow-lg rounded-lg  mb-1 ${boxStyleVoice}`}
                        >
                         <View  
                            style={{shadowColor:'darkred',gap:5}}
                            className='flex-row items-center justify-center'
                        >
                            <View className='jutify-center items-center relative'>
                                <Progress.Bar 
                                    width={wp('50%')}
                                    height={5}
                                    color={'rgba(0,0,0,0.2)'} 
                                    borderWidth={0}
                                    progress={1} 
                                    className='absolute'
                                />
                                <Progress.Bar 
                                width={wp('50%')}
                                height={5}
                                color={progressVoice > 0 && isActive ?'rgba(0,0,0,0.5)':'transparent'} 
                                borderWidth={0}
                                progress={progressVoice > 0 && isActive? progressVoice:0} 
                                indeterminateAnimationDuration={1000}
                                />

                            </View>
                            <Icon_Botton activeShadow={true} backColor={'#eeeeee'} colorShadow={''} icon={progressVoice !==0 && isActive ? faPause :faPlay} color={'rgba(0,0,0,0.7)'} func={handlePlayVoice}/>
                        </View>
                    {status && <Text className='text-[10px] tracking-wide text-slate-100/50'>{item.user}</Text>}
                    </View>
                </View>
                <Text className='text-xs'>{item.time}</Text>
            </>
            }
            {item?.type === "PHOTO" &&
            <>
            <View className={`flex-row items-end`}>
                {status &&<FontAwesomeIcon style={{marginBottom:5}} icon={faUser} size={15} color={'gray'}/>}
                <View
                    className={`overflow-hidden shadow-lg rounded-lg  mb-1 ${boxStyleVoice}`}
                >
                <Image
                    source={
                        pathPhoto?
                        {uri:pathPhoto}
                        :
                        require('../assets/image/mercedes-maybach-s-class-haute-voiture.jpg')
                    }
                    style={{width:wp(70),height:wp(70)}}
                    resizeMode="cover"
                    />
                {/* <Text className='text-[16px]'>{item.text}</Text> */}
                {status && <Text className='text-[10px] bg-purple-950/70 absolute left-2 top-2  p-1 px-3 rounded-lg tracking-wide text-white'>{item.user}</Text>}

                </View>
            </View>
            <Text className='text-xs'>{item.time}</Text>
        </>
            }
            </View>
           
        </View>
    );
}