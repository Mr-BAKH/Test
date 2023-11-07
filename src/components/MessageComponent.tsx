import { View, Text } from "react-native";
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


export default function MessageComponent({ item, user }) {
    const status = item.user !== user;    
    const boxStyle=  status? 'rounded-bl-[0px] bg-purple-300': 'rounded-br-[0px] bg-sky-200'
    const boxStyleVoice=  status? 'rounded-bl-[0px] bg-purple-700': 'rounded-br-[0px] bg-sky-700'
    const [pathAudio, setPathAudio] = useState<string>('')

    useEffect(()=>{
        // let file = item.type === 'VOICE' && base64.decode(item.text)
        // console.log(file)
        if(item.type === 'VOICE'){
            const filePath = RNFS.DocumentDirectoryPath + `/${item.id}.mp3`;
            RNFS.writeFile(filePath, item.text, 'base64')
            .then(() => {
                console.log('Audio file saved to:', filePath);
                setPathAudio(filePath)
            })
            .catch((error) => {
                console.error('Error saving audio file:', error);
            });
        }
    },[])

    const handlePlayVoice = async (): Promise<void> => {
        if(pathAudio !== ''){
            const voice = new AudioRecorderPlayer();
            try {
                const msg = await voice.startPlayer(pathAudio);
                //? Default path
                const volume = await voice.setVolume(1.0);
                console.log(`path: ${msg}`, `volume: ${volume}`);
                voice.addPlayBackListener((e: PlayBackType) => {
                  console.log('playBackListener', e);
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
                            <Progress.Bar 
                            width={wp('50%')}
                            height={5}
                            color={1 ?'rgba(0,0,0,0.5)':'darkred'} 
                            borderWidth={0}
                            progress={1} 
                            //   progress={1} 
                            indeterminateAnimationDuration={500}
                            />
                            <Icon_Botton activeShadow={true} backColor={'#eeeeee'} colorShadow={''} icon={0? faPause :faPlay} color={'rgba(0,0,0,0.7)'} func={handlePlayVoice}/>
                        </View>
                    {status && <Text className='text-[10px] tracking-wide text-slate-100/50'>{item.user}</Text>}
                    </View>
                </View>
                <Text className='text-xs'>{item.time}</Text>
            </>
            }
            </View>
           
        </View>
    );
}