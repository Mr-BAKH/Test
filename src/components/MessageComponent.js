import { View, Text } from "react-native";
import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
// import { Ionicons } from "@expo/vector-icons";
import { styles } from "../utils/styles";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Progress from 'react-native-progress';
import {Icon_Botton} from './Botton'
import {faPlay,faXmark,faPause} from '@fortawesome/free-solid-svg-icons';



export default function MessageComponent({ item, user }) {
    const status = item.user !== user;    
    const boxStyle=  status? 'rounded-bl-[0px] bg-purple-300': 'rounded-br-[0px] bg-sky-200'
    const boxStyleVoice=  status? 'rounded-bl-[0px] bg-purple-700': 'rounded-br-[0px] bg-sky-700'
    const file = item.type === 'VOICE'? item.text : '...'
    // console.log(file)
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
                            <Icon_Botton activeShadow={true} backColor={'#eeeeee'} colorShadow={''} icon={0? faPause :faPlay} color={'rgba(0,0,0,0.7)'} func={()=>console.log("request to play voice")}/>
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