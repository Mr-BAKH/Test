import { View, Text } from "react-native";
import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
// import { Ionicons } from "@expo/vector-icons";
import { styles } from "../utils/styles";

export default function MessageComponent({ item, user }) {
    const status = item.user !== user;

    return (
        <View>
            <View
                style={
                    status
                        ? styles.mmessageWrapper
                        : [styles.mmessageWrapper, { alignItems: "flex-end" }]
                }
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesomeIcon icon={faUser} size={15} color={'gray'}/>
                    <View
                        className='max-w-[50%] bg-purple-300 p-[15px] rounded-lg rounded-br-[0] mb-1'
                    >
                        <Text>{item.text}</Text>
                    </View>
                </View>
                <Text style={{ marginLeft: 40 }}>{item.time}</Text>
            </View>
        </View>
    );
}