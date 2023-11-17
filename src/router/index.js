import React,{useMemo} from "react";

//👇🏻 app screens
import Login from "../screens/Login";
import Chat from "../screens/Chat";
import Messaging from "../screens/Messaging";
import Test from '../test/indes'

import {SchemaContext} from '../models/main'
import {useAuth} from '../hooks/useAuth'
import {Firebase_App } from '../config/firebase'

//👇🏻 React Navigation configurations
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const {useRealm } = SchemaContext;
Firebase_App // config app


export default function App() {
    
    // if user is exist in the realm<<
    const realm = useRealm();
    const storeuser = realm.objects('User')[0]
    const {user} = useAuth()
   

    return user||storeuser ?
    
    (
        <NavigationContainer>
            <Stack.Navigator>
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
    )
    :
    (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Login'
                    component={Login}
                    options={{ headerShown: false }}
                />
                {/* <Stack.Screen
                    name='Test'
                    component={Test}
                    options={{ headerShown: false }}
                /> */}
            </Stack.Navigator>
        </NavigationContainer>
        )
}