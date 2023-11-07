import React,{useState,} from 'react';
import { View,Text,SafeAreaView, TouchableOpacity,TextInput, StyleSheet, Dimensions, Alert} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { silver, white } from "../../globals/Colors";
import { useNavigation , NavigationProp} from "@react-navigation/native";
import { RootStackParams } from '../../navigation/RootNavigation';
import Auth ,{ FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { RootState, useAppDispatch } from '../../redux/store';
import { SignUpUser } from '../../redux/actions/UserActions';
import { useSelector } from 'react-redux';
import Loader from '../../components/global/Loader';
import { checkEmail, checkEmptyField, checkPassword } from '../../globals/utilities';
const {height,width} = Dimensions.get("window")

export type SignUpFieldError=
{
    name: string | null,
    email: string | null,
    password: string | null,
    user_name:string | null
}
const SignUp = () =>
{
    const [userName,setUserName] = useState<string>("")
    const [fullName,setFullName] = useState<string>("")
    const [userEmail,setUserEmail] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [emptyErrors,setEmptyErrors] = useState<SignUpFieldError>({
        email:null,
        name:null,
        password:null,
        user_name:null
    })
    const signUpLoding = useSelector((state:RootState)=>state.user.signUpLoading)
    const signUpError = useSelector((state:RootState)=>state.user.signUpError)
    const signUpSuccess = useSelector((state:RootState)=>state.user.signUpSuccess)
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<RootStackParams,"SignUp">>()
    const dispatch = useAppDispatch()

    const restoreErrors=()=>
    {
        setEmptyErrors({
            email:null,
            name:null,
            password:null,
            user_name:null
        })
    }
    const checkFields = () =>
    {
        restoreErrors()
        if(checkEmptyField(userName))
        {
            setEmptyErrors({...emptyErrors,user_name:"* userName cant be empty"})
            return false   
        }
        if(checkEmptyField(fullName))
        {
            setEmptyErrors({...emptyErrors,name:"* name can't be empty"})
            return false   
        }
        if(checkEmptyField(userEmail))
        {
            setEmptyErrors({...emptyErrors,email:"* Email cant't be empty"})
            return false
        }
        if(!checkEmail(userEmail))
        {
            setEmptyErrors({...emptyErrors,email:"* Given Email format is not valid"})
            return false
        }
        if(checkEmptyField(password))
        {
            setEmptyErrors({...emptyErrors,password:"* Password can't be empty"})
            return false   
        }
        if(!checkPassword(password))
        {
            setEmptyErrors({...emptyErrors,password:"* Password should have length 8 , special charcter and atelase one Uppercase"})
            return false   
        }
        return true
    }
      
    const registerUser = async() =>
    {
     //  checkFields()
        dispatch(SignUpUser({
            userEmail,
            userName,
            fullName,
            password
        }))

        if(signUpSuccess)
        {
            navigation.goBack()
        }
    }

    return(
        <SafeAreaView
        style={styles.container}
        >
            {signUpLoding && <Loader/>}
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
                {signUpError &&<Text style={{
                    color:"red",
                    fontSize:18
                }}>{signUpError}</Text>
                }
                <TextInput
                value={userName}
                onChangeText={(text:string)=>setUserName(text)}
                placeholder='username ....'
                placeholderTextColor={silver}
                style={[styles.input,{
                    backgroundColor: theme.background_color,
                    borderColor:theme.primary_color,
                    color:theme.text_color
                }]}
                />
                {
                    emptyErrors.user_name &&
                    <Text style={{
                        color: "red",
                        fontSize:15,
                        alignSelf:"flex-start",
                        marginLeft: width * 5/100
                    }}>{emptyErrors.user_name}</Text>
                }
                <TextInput
                value={fullName}
                onChangeText={(text:string)=>setFullName(text)}
                placeholder='name ....'
                placeholderTextColor={silver}
                style={[styles.input,{
                    backgroundColor: theme.background_color,
                    borderColor:theme.primary_color,
                    color:theme.text_color
                }]}
                />
                {
                    emptyErrors.name &&
                    <Text style={{
                        color: "red",
                        fontSize:15,
                        alignSelf:"flex-start",
                        marginLeft: width * 5/100
                    }}>{emptyErrors.name}</Text>
                }
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
                {
                    emptyErrors.email &&
                    <Text style={{
                        color: "red",
                        fontSize:15,
                        alignSelf:"flex-start",
                        marginLeft: width * 5/100
                    }}>{emptyErrors.email}</Text>
                }
                <TextInput
                value={password}
                textContentType='password'
                secureTextEntry={true}
                onChangeText={(text:string)=>setPassword(text)}
                placeholder='password ....'
                placeholderTextColor={silver}
                style={[styles.input,{
                    backgroundColor: theme.background_color,
                    borderColor:theme.primary_color,
                    color: theme.text_color
                }]}
                />
                {
                    emptyErrors.password &&
                    <Text style={{
                        color: "red",
                        fontSize:15,
                        alignSelf:"flex-start",
                        marginLeft: width * 5/100
                    }}>{emptyErrors.password}</Text>
                }
                <TouchableOpacity
                onPress={()=>registerUser()}
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
                    }}>Sign Up</Text>
                </TouchableOpacity>

                <Text 
                onPress={()=>navigation.navigate("SignIn")}
                style={{
                    color: theme.primary_color,
                    fontSize:18,

                }}>Sign In</Text>

            </View>

        </SafeAreaView>
    )
    
}
export default SignUp
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
        marginTop:20,
        fontSize:14,
        borderWidth:1
    }

}
)