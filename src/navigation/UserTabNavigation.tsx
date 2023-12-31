import * as React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";;
import ChatStackNavigator from "./ChatStackNavigation";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import UseTheme from '../globals/UseTheme';
import ProfileStackNavigator, { ProfileStackParams } from './ProfileStackNavigation';
import { NavigatorScreenParams } from '@react-navigation/native';
import StoryStackNavigator from './StoryStackNavigation';
export type userTabParams=
{
    ChatStack:undefined,
    StoryStack: undefined,
    ProfileStack: NavigatorScreenParams<ProfileStackParams>
    
}
const UserTabNavigator=()=>
{
    const userTab = createBottomTabNavigator<userTabParams>()
    const {theme} = UseTheme()
    return(
            <userTab.Navigator
            screenOptions={{
                headerShown:false,
                tabBarStyle:{backgroundColor:theme.background_color}
            }}
            initialRouteName='ChatStack'
            >
                <userTab.Screen
                name='StoryStack'
                component={StoryStackNavigator}
                options={{
                    tabBarLabel:()=>null,
                    tabBarIcon: ({ color, size,focused }) => (
                        <FontAwesome5 solid={focused} name="adjust" color={theme.primary_color} size={size} />
                      ),
                }}
                />
                <userTab.Screen
                name='ChatStack'
                options={{
                    tabBarLabel:()=>null,
                    tabBarIcon: ({ color, size,focused }) => (
                        <FontAwesome5 solid={focused} name="comment" color={theme.primary_color} size={size} />
                      ),
                }}
                component={ChatStackNavigator}
                />
                <userTab.Screen
                name='ProfileStack'
                component={ProfileStackNavigator}
                options={{
                    tabBarLabel:()=>null,
                    tabBarIcon: ({ color, size,focused }) => (
                        <FontAwesome5 solid={focused} name="user" color={theme.primary_color} size={size} />
                      ),
                }}
                />

            </userTab.Navigator>
    )
}
export default UserTabNavigator