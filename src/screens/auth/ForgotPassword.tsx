import React,{useState} from 'react';
import { View,SafeAreaView,Dimensions,
    TextInput,TouchableOpacity,Text} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { red, white } from '../../globals/Colors';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/RootNavigation';
import { RootState, useAppDispatch } from '../../redux/store';
import { SendResetLink } from '../../redux/slices/UserSlice';
import { checkEmail, checkEmptyField } from '../../globals/utilities';
import { useSelector } from 'react-redux';
const {height,width} = Dimensions.get("window")
const ForgotPassword = () =>
{
    const {theme} = UseTheme()
    const [email,setEmail] = useState<string>("")
    const [error,setError] = useState<string | null>(null)
    const navigation = useNavigation<NavigationProp<RootStackParams,"ForgotPassword">>()
    const dispatch = useAppDispatch()
    const success = useSelector((state:RootState)=>state.user.forgotLinkSuccess)
    const createResendLink = async() =>
    {
        if(checkEmptyField(email))
        {
            setError("Empty email is not accepted.")
            return
        }
        if(!checkEmail(email))
        {
            setError("Given Email is not valid.")
            return
        }
        await dispatch(SendResetLink({email}))
        if(success)
        {
            navigation.goBack()
        }
    }
    return(
        <SafeAreaView style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
            <View style={{
                flexDirection:"row",
                padding:10,
                justifyContent:"space-between",
                alignItems:"center"
            }}>
                <FontAwesome5
                onPress={()=>navigation.goBack()}
                name='angle-left'
                size={20}
                color={theme.text_color}
                />
                <Text style={{
                    fontSize:18,
                    color: theme.text_color
                }}>Forgot Password</Text>
                <View/>
            </View>
            <View style={{
                flex:1,
                justifyContent:"center",
            }}>
                <TextInput
                value={email}
                onChangeText={(text:string)=>{
                    setError(null),
                    setEmail(text)
                }}
                placeholder="Enter email for reset Link ..."
                placeholderTextColor={theme.placeholder_color}
                style={{
                    marginHorizontal:20,
                    padding:20,
                    width: width* 90/100,
                    borderRadius:14,
                    color: theme.text_color,
                    alignSelf:"center",
                    borderWidth:1,
                    borderColor: theme.primary_color
                }}
                />
                {
                    error &&
                    <Text style={{
                        fontSize:15,
                        color: red,
                        width: width* 90/100,
                        alignSelf:"center",
                    }}>{error}</Text>
                }
                <TouchableOpacity
                onPress={()=>createResendLink()}
                style={{
                    padding:20,
                    margin:20,
                    width: width * 90/100,
                    alignSelf:"center",
                    backgroundColor: theme.primary_color,
                    alignItems:"center",
                    justifyContent:"center",
                    borderRadius:15
                }}
                >
                    <Text style={{
                        fontSize:18,
                        fontWeight:"bold",
                        textAlign:"center",
                        color: white
                    }}>Send Link</Text>
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
    
}
export default ForgotPassword