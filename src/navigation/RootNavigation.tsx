import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp, NativeStackNavigatorProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import UserTabNavigator, { userTabParams } from './UserTabNavigation';
import SplashScreen from '../screens/splash/SplashScreen';
import CreateStory from '../screens/stories/CreateStory';
import ForgotPassword from '../screens/auth/ForgotPassword';

export type RootStackParams=
{
    SplashScreen: undefined,
    SignIn:undefined,
    SignUp:undefined,
    ForgotPassword: undefined,
    userTab: NavigatorScreenParams<userTabParams>
}
const RootNavigation=()=>
{
    const rootstack = createNativeStackNavigator<RootStackParams>()
    return(
        <NavigationContainer>
            <rootstack.Navigator
            screenOptions={{
                headerShown:false
            }}
            initialRouteName='SplashScreen'
            >
                <rootstack.Screen
                name='SplashScreen'
                component={SplashScreen}
                />
                <rootstack.Screen
                name='SignIn'
                component={SignIn}
                />
                <rootstack.Screen
                name='SignUp'
                component={SignUp}
                />
                 <rootstack.Screen
                name='ForgotPassword'
                component={ForgotPassword}
                />
                <rootstack.Screen
                name='userTab'
                component={UserTabNavigator}
                />
            </rootstack.Navigator>
        </NavigationContainer>
    )
}
export default RootNavigation