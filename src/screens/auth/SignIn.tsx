import React,{useState,} from 'react';
import { View,Text,SafeAreaView, TouchableOpacity,TextInput, StyleSheet, Dimensions} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { silver, white } from "../../globals/Colors";
import { useNavigation,NavigationProp } from "@react-navigation/native"
import { RootStackParams } from '../../navigation/RootNavigation';
import { useSelector  } from "react-redux";
import Auth,{FirebaseAuthTypes} from "@react-native-firebase/auth";
import { RootState, useAppDispatch } from '../../redux/store';
import { fetchUserData, selectCurrentUser, signInUser } from '../../redux/slices/UserSlice';
import Loader from '../../components/global/Loader';
const {height,width} = Dimensions.get("window")
const SignIn = () =>
{
    const [userEmail,setUserEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<RootStackParams,"SignIn">>()
    const dispatch = useAppDispatch()
    const user = useSelector(selectCurrentUser)
    const loading = useSelector((state:RootState)=>state.user.loading)
    const error = useSelector((state:RootState)=>state.user.error)
    const SignInCall = async() =>
    {
        const fullFilled = await dispatch(signInUser({email:userEmail,password:password}))
        if(signInUser.fulfilled.match(fullFilled))
        {
            navigation.navigate("userTab")
        }
    }
    return(
        <SafeAreaView
        style={styles.container}
        >
            {
                loading &&
                <Loader/>
            }
            <View style={[styles.innerContainer,{         
                backgroundColor: theme.background_color,
                justifyContent:"center"
            }]}>
                <Text style={{
                    fontSize:35,
                    fontWeight:"bold",
                    color: theme.primary_color,
                    marginVertical:40
                }}>
                    Chatify !
                </Text>
                <TextInput
                testID={"input_email"}
                value={userEmail}
                onChangeText={(text:string)=>setUserEmail(text)}
                placeholder='email ....'
                placeholderTextColor={silver}
                style={[styles.input,{
                    backgroundColor: theme.background_color,
                    borderColor:theme.primary_color,
                    color:theme.text_color
                }]}
                />
                <TextInput
                testID={"input_password"}
                value={password}
                onChangeText={(text:string)=>setPassword(text)}
                placeholder='password ....'
                placeholderTextColor={silver}
                style={[styles.input,{
                    backgroundColor: theme.background_color,
                    borderColor:theme.primary_color,
                    color: theme.text_color
                }]}
                />
                <Text
                style={{
                    alignSelf:"flex-end",
                    color:theme.primary_color,
                    marginBottom:20,
                    marginRight:20,
                    fontSize:18,
                    fontWeight:"300"
                }}
                >
                    forgot password ?
                </Text>

                <TouchableOpacity
                testID={"btn_signIn"}
                onPress={()=>SignInCall()}
                style={{
                    padding:20,
                    borderRadius:10,
                    margin:20,
                    width: width * 0.9,
                    justifyContent:"center",
                    alignItems:'center',
                    backgroundColor: theme.button_color
                }}
                >
                    <Text style={{
                        color:white,
                        fontSize:18,
                        fontWeight:"bold"
                    }}>Sign In</Text>
                </TouchableOpacity>

                <Text 
                onPress={()=>navigation.navigate("SignUp")}
                style={{
                    color: theme.primary_color,
                    fontSize:18,

                }}>Sign Up</Text>

            </View>

        </SafeAreaView>
    )
    
}
export default SignIn
const styles  = StyleSheet.create({
    container:
    {
        flex:1
    },
    innerContainer:
    {
        flex:1,
        alignItems:"center",
    },
    input:
    {
        width: width * 0.9,
        elevation:2,
        padding:15,
        borderRadius:10,
        marginVertical:20,
        fontSize:14,
        borderWidth:1
    }

}
)