import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp, NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { NavigationContainer } from '@react-navigation/native';
import ChatHome from '../screens/chat/ChatHome';
import Chat from '../screens/chat/Chat';
import FindChat from '../screens/chat/FindChat';
import Stories from '../screens/stories/Stories';
import CreateStory from '../screens/stories/CreateStory';
import StoryViewer from '../screens/stories/StoryViewer';
export type craeteStoryParams = 
{
    uri: string,
    type: string
}
export type storyStackParams=
{
    Stories: undefined,
    CreateStory: craeteStoryParams,
    StoryViewer: {
        user_id:string
    }
}
export const StoryStackNavigator=()=>
{
    const storyStack = createNativeStackNavigator<storyStackParams>()
    return(
            <storyStack.Navigator
            screenOptions={{
                headerShown:false
            }}
            initialRouteName='Stories'
            >
                <storyStack.Screen
                name='Stories'
                component={Stories}
                />
                <storyStack.Screen
                name='CreateStory'
                component={CreateStory}
                />
                <storyStack.Screen
                name='StoryViewer'
                component={StoryViewer}
                />
                
            </storyStack.Navigator>
    )
}
export default StoryStackNavigator