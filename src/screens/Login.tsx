import {Text_Botton,Icon_Botton} from '../components/Botton'
import {faEye,faLock} from '@fortawesome/free-solid-svg-icons';
import {
    GoogleSignin,
    statusCodes,
  } from '@react-native-google-signin/google-signin';

import { useNetInfo } from "@react-native-community/netinfo";
import uuid from 'react-native-uuid';

import React, { useState, useEffect, useMemo} from "react";
import {
    Text,
    SafeAreaView,
    View,
    TextInput,
    Pressable,
    Image,
    Alert,
} from "react-native";

//👇🏻 Import the app styles
import { styles } from "../utils/styles";

GoogleSignin.configure({
    androidClientId: '1080041864924-p3fmbm7pl81odvup7cd01uvf2589umk1.apps.googleusercontent.com',
});

type user = {
    ID: string,
    userName: string , 
}

const Login = ({ navigation }) => {
    const [username, setUsername] = useState<string>("");
    const [passWord, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(true)
    const [userInfo, setUserInfo ] = useState<user>()
    const {isConnected} = useNetInfo();
    
    const googleSignIN = async() => {
        try {
          await GoogleSignin.hasPlayServices();
          await GoogleSignin.signIn()
          .then((val)=>{
              if(val.user.id){
                // set redux slice for user
                //     {
                //         ID: val.user.id,
                //         userName: val.user.name? val.user.name : val.user.id,
                //     }
                navigation.navigate("Chat",{
                    username: val.user.name,
                    userID: val.user.id,
                });
                
              }
          })
        } catch (error:any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('log in canseld!')
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('connect to google...')
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('is not avalable!')
          } else {
            console.log(error)
          }
        }
      };


    //👇🏻 checks if the input field is empty
    const handleSignIn = async() => {
        // check if use existing
        const uniqId = uuid.v4()
        if (username.trim()) {
            navigation.navigate("Chat",{
                username,
                userID: uniqId,
            });
        } else {
            Alert.alert("Username is required.");
        }
    };

    
    useMemo(()=>{
        if(isConnected == false ){
            Alert.alert('connet to Internet!')
        }
        console.log('cal use memo!')
    },[userInfo])



    return (
        <SafeAreaView
            className=" flex-1 relative bg-white items-center justify-center p-[12px] w-full"
        >
            <View style={styles.loginscreen}>
                <Text className='text-purple-900 text-3xl font-bold'>ByChat App</Text>
                <View 
                    style={{gap:10}}
                    className='w-full mt-5 items-center justify-center'
                >
                    <TextInput
                        autoCorrect={false}
                        placeholder='User Name ...'
                        placeholderTextColor={'rgba(0,0,0,0.5)'}
                        className=' w-full px-3 rounded-xl border-[1px] border-black/5 text-slate-900 text-md tracking-wider'
                        onChangeText={(value) => setUsername(value)}
                        value={username}
                    />
                    <View className='w-full justify-center items-center'>
                        <TextInput
                            autoCorrect={false}
                            placeholder='Password ...'
                            placeholderTextColor={'rgba(0,0,0,0.5)'}
                            secureTextEntry={showPassword}
                            className=' w-full px-3 rounded-xl border-[1px] border-black/5 text-slate-900 text-md tracking-wider'
                            onChangeText={(value) => setPassword(value)}
                            value={passWord}
                            >
                        </TextInput>
                        <View className='absolute right-5'>
                            <Icon_Botton color={'rgba(0,0,0,0.2)'}  icon={showPassword?faEye:faLock} func={()=>setShowPassword(!showPassword)}/>
                        </View>
                    </View>
                    
                </View>
                <View
                    style={{gap:10}}
                    className='flex-row mt-5'
                >
                    {/* log in btn */}
                    <Text_Botton
                        color={'bg-transparent'}
                        func={()=>console.log('now click!')}
                        textColor={'text-purple-950'}
                        title={'Regester'}
                    />
                    <Text_Botton
                        color={'bg-green-200'}
                        func={handleSignIn}
                        textColor={'text-slate-900'}
                        title={'LOGIN'}
                    />
                    {/* Sign in btn */}
                </View>
                {/* google log in  */}
                <View className='w-full mt-10'>
                    <Text_Botton
                        color={'bg-transparent'}
                        func={googleSignIN}
                        textColor={'text-slate-600'}
                        title={'Log in with google'}
                    >
                    <Image
                        source={{uri:'https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1633218227'}}
                        className='w-[40px] h-[40px]'
                        resizeMode="contain"
                    />
                    </Text_Botton>

                </View>
                {/* forgot password! */}
                <View
                    className='absolute z-50 bottom-0  '
                >
                    <Text_Botton
                        color={'bg-transparent'}
                        title={'I forgot password !'}
                        textColor={'text-black/25'}
                        func={()=> console.log('forgot password!')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Login;

