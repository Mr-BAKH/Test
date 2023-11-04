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
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                {status && <FontAwesomeIcon style={{marginBottom:5}} icon={faUser} size={15} color={'gray'}/>}
                    <View
                        className={`max-w-[50%] p-[15px] relative rounded-lg  mb-1 ${boxStyle}`}
                    >
                        
                        {status && <Text className='absolute bottom-[2px] left-[2px] text-[10px] tracking-wide text-gray-950/25'>{item.user}</Text>}
                        <Text>{item.text}</Text>
                    </View>
                </View>
                <Text style={{ marginLeft: 40 }}>{item.time}</Text>
            </View>
        </View>
    );
}