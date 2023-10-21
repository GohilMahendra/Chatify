import * as React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp, NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { NavigationContainer } from '@react-navigation/native';
import ChatStackNavigator from "./ChatStackNavigation";
import Stories from '../screens/stories/Stories';
import UserProfile from '../screens/profile/UserProfile';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import UseTheme from '../globals/UseTheme';
export type userTabParams=
{
    ChatStack:undefined,
    Stories: undefined,
    UserProfile: undefined
    
}
export const UserTabNavigator=()=>
{
    const userTab = createBottomTabNavigator<userTabParams>()
    const {theme} = UseTheme()
    return(
            <userTab.Navigator
            screenOptions={{
                headerShown:false
            }}
            initialRouteName='ChatStack'
            >
                <userTab.Screen
                name='Stories'
                component={Stories}
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
                name='UserProfile'
                component={UserProfile}
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