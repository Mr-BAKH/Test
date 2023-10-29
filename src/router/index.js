import React from "react";

//👇🏻 app screens
import Login from "../screens/Login";
import Chat from "../screens/Chat";
import Messaging from "../screens/Messaging";

//👇🏻 React Navigation configurations
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Login'
                    component={Login}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name='Chat'
                    component={Chat}
                    options={{
                        title: "Chats",
                        headerShown: false,
                    }}
                />
                <Stack.Screen name='Messaging' component={Messaging} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}