import { View, Text } from "react-native";
import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
// import { Ionicons } from "@expo/vector-icons";
import { styles } from "../utils/styles";

export default function MessageComponent({ item, user }) {
    const status = item.user !== user;
    const boxStyle=  status? 'rounded-bl-[0px] bg-purple-300': 'rounded-br-[0px] bg-sky-200'

    return (
        <View>
            <View
                style={
                    status
                        ? styles.mmessageWrapper
                        : [styles.mmessageWrapper, { alignItems: "flex-end" }]
                }
            >
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
            </View>
        </View>
    );
}