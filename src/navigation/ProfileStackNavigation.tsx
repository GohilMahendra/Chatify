import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfile from '../screens/profile/UserProfile';
import EditProfile from '../screens/profile/EditProfile';

export type ProfileStackParams=
{
    UserProfile: undefined,
    EditProfile: {
        user_name:string,
        full_name: string,
        profile_image: string,
        bio:string
    },
    
}
const ProfileStackNavigator=()=>
{
    const ProfileStack = createNativeStackNavigator<ProfileStackParams>()
    return(
            <ProfileStack.Navigator
            screenOptions={{
                headerShown:false
            }}
            initialRouteName='UserProfile'
            >
                <ProfileStack.Screen
                name='UserProfile'
                component={UserProfile}
                />
                <ProfileStack.Screen
                name='EditProfile'
                component={EditProfile}
                />
            </ProfileStack.Navigator>
    )
}
export default ProfileStackNavigator