
import  React ,{useEffect}from 'react';
import { Text,View,StyleSheet } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/RootNavigation';
import Auth from "@react-native-firebase/auth";
import { useAppDispatch } from '../../redux/store';
import { fetchUserData } from '../../redux/slices/UserSlice';
import { white } from '../../globals/Colors';
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
            navigation.reset({
                index: 0,
                routes: [{ name: 'userTab' }],
              });
        }
        else
        {
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              });
        }
    }
    useEffect(()=>{
        setTimeout(() => {
            checkAuthStatus()
        }, 2000);
    },[])
    return(
        <View style={[styles.container,{
            backgroundColor: theme.primary_color
        }]}>
            <Text style={styles.textAppName}> Chatify ! </Text>
        </View>
    )
}
export default SplashScreen
const styles = StyleSheet.create({
    container:
    {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    textAppName:
    {
        fontSize:50,
        fontWeight:"bold",
        color: white
    }

})
