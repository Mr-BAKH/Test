import React, { Children } from "react"
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { Pressable,Text } from "react-native";


export const Icon_Botton = ({icon,func,color,activeShadow,colorShadow,backColor,Longfunc})=>{
    return(
        <Pressable
            onPress={func}
            onLongPress={Longfunc}
            style={[
                colorShadow !== ''?{shadowColor:colorShadow}:{shadowColor:'#000'},
                backColor?{backgroundColor:backColor}: activeShadow&&{backgroundColor:'#000'},
            ]}
            className={`p-[8px] rounded-full ${activeShadow&& 'shadow-lg'}`}
        >
            <FontAwesomeIcon icon={icon} size={20} color={color}/>
        </Pressable>
    )
}
export const Text_Botton = ({title,func,color,textColor,children})=>{
    return(
        <Pressable 
          style={{gap:8}}
          className={`w-fit flex-row ${color} px-[30px] py-[10px] rounded-full justify-center items-center `}
          onPress={func}
        >
          <Text className={`${textColor}`}>{title}</Text>
          {children}
        </Pressable>
    )
}
