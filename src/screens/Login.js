import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { useState } from "react";
import {
    Text,
    SafeAreaView,
    View,
    TextInput,
    Pressable,
    Alert,
} from "react-native";

//👇🏻 Import the app styles
import { styles } from "../utils/styles";

const Login = ({ navigation }) => {
    const [username, setUsername] = useState("");

    //👇🏻 checks if the input field is empty
    const handleSignIn = () => {
        if (username.trim()) {
            navigation.navigate("Chat",{username});
        } else {
            Alert.alert("Username is required.");
        }
    };

    return (
        <SafeAreaView
            className=" flex-1 bg-white items-center justify-center p-[12px] w-full"
        >
            <View style={styles.loginscreen}>
                <Text style={styles.loginheading}>Sign in</Text>
                <View style={styles.logininputContainer}>
                    <TextInput
                        autoCorrect={false}
                        placeholder='Enter your username'
                        style={styles.logininput}
                        onChangeText={(value) => setUsername(value)}
                    />
                </View>
                <Pressable 
                    onPress={handleSignIn}
                    className="bg-green-600 p-[12px] my-[10px] w-[60%] rounded-[20px]"
                >
                    <View>
                        <Text style={styles.loginbuttonText}>Get Started</Text>
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default Login;