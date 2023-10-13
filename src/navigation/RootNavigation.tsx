import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp, NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { NavigationContainer } from '@react-navigation/native';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import Home from '../screens/home/Home';
import Chat from '../screens/chat/Chat';

export type RootStackParams=
{
    SignIn:undefined,
    SignUp:undefined,
    Home: undefined,
    Chat:undefined
}
export const RootNavigation=()=>
{
    const rootstack = createNativeStackNavigator<RootStackParams>()
    return(
        <NavigationContainer>
            <rootstack.Navigator
            screenOptions={{
                headerShown:false
            }}
            initialRouteName='Chat'
            >
                <rootstack.Screen
                name='SignIn'
                component={SignIn}
                />
                <rootstack.Screen
                name='SignUp'
                component={SignUp}
                />
                 <rootstack.Screen
                name='Home'
                component={Home}
                />
                <rootstack.Screen
                name='Chat'
                component={Chat}
                />
            </rootstack.Navigator>
        </NavigationContainer>
    )
}
export default RootNavigation