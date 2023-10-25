
import  React ,{useEffect}from 'react';
import { Text,View } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/RootNavigation';
import Auth from "@react-native-firebase/auth";
import { RootState, useAppDispatch } from '../../redux/store';
import { fetchUserData } from '../../redux/slices/UserSlice';
import { useSelector } from 'react-redux';
const SplashScreen = () =>
{
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<RootStackParams,"SplashScreen">>()
    const dispatch = useAppDispatch()
    const checkAuthStatus = async()=>
    {
        const user =  Auth().currentUser

        if(user)
        {
            await dispatch(fetchUserData(user.uid))
            navigation.navigate("userTab")
        }
        else
        {
            navigation.navigate("SignIn")
        }
    }
    useEffect(()=>{
        setTimeout(() => {
            checkAuthStatus()
        }, 2000);
    },[])
    return(
        <View style={{
            flex:1,
            justifyContent:"center",
            alignItems:"center",
            backgroundColor: theme.background_color
        }}>
            <Text style={{
                fontSize:25,
                fontWeight:"bold",
                color: theme.text_color
            }}> Chatify ! </Text>
        </View>
    )

}
export default SplashScreen
