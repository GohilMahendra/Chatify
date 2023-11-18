import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatHome from '../screens/chat/ChatHome';
import Chat from '../screens/chat/Chat';
import FindChat from '../screens/chat/FindChat';
import { UserResult } from '../types/UserTypes';

export type chatStackParams=
{
    Chat:UserResult,
    ChatHome: undefined,
    FindChat: undefined
}
const ChatStackNavigator=()=>
{
    const chatStack = createNativeStackNavigator<chatStackParams>()
    return(
            <chatStack.Navigator
            screenOptions={{
                headerShown:false
            }}
            initialRouteName='ChatHome'
            >
                <chatStack.Screen
                name='ChatHome'
                component={ChatHome}
                />
                <chatStack.Screen
                name='Chat'
                component={Chat}
                />
                <chatStack.Screen
                name='FindChat'
                component={FindChat}
                />
            </chatStack.Navigator>
    )
}
export default ChatStackNavigator