import React,{useState,} from 'react';
import { View,Text,SafeAreaView, TouchableOpacity,TextInput, StyleSheet, Dimensions} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { silver, white } from "../../globals/Colors";
import { useNavigation,NavigationProp } from "@react-navigation/native"
import { RootStackParams } from '../../navigation/RootNavigation';
import firestore from '@react-native-firebase/firestore'
import Auth,{FirebaseAuthTypes} from "@react-native-firebase/auth";
const {height,width} = Dimensions.get("window")
const SignIn = () =>
{
    const [userEmail,setUserEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<RootStackParams,"SignIn">>()

    const SignInUser = async() =>
    {
        try
        {
        const signInResponse: FirebaseAuthTypes.UserCredential = await Auth()
        .signInWithEmailAndPassword(userEmail,password)
        console.log(signInResponse)
        navigation.navigate("userTab")
        }
      
        catch(err)
        {
            console.log(err)
        }
    
    }
    return(
        <SafeAreaView
        style={styles.container}
        >
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
                onPress={()=>SignInUser()}
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