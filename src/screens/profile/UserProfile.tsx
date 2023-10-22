
import  React,{useState,useEffect} from 'react';
import { Image, Text,TouchableOpacity,View } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { CompositeScreenProps, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/RootNavigation';
import { ProfileStackParams } from '../../navigation/ProfileStackNavigation';
import firestore from "@react-native-firebase/firestore";
import Auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { User } from '../../types/UserTypes';
import Loader from '../../components/global/Loader';
import { red } from '../../globals/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type CompositeProfileProps = CompositeScreenProps<
NativeStackScreenProps<ProfileStackParams,"UserProfile">,
NativeStackScreenProps<RootStackParams>
>
const UserProfile = () =>
{
    const {theme} = UseTheme()
   
    const navigation = useNavigation<NavigationProp<ProfileStackParams,"UserProfile">>()
    const rootNavigation = useNavigation<NavigationProp<RootStackParams>>()
    const [user,setUser] = useState<User>(
        {
            bio:"",
            email:"",
            name:"",
            picture:"",
            user_name:""
        }
    )
    const [Loading,setLoading] = useState(false)

    const getImageUrl = async(imageRef:string) =>
    {
        const storageRef = storage().ref(imageRef)
        const imageUrl = await storageRef.getDownloadURL()
        return imageUrl
    }
    const getProfileDetails = async() =>
    {
        try
        {
        setLoading(true)
        const user = Auth().currentUser
        const userId = user?.uid
        const userData  = await firestore().collection("users").doc(userId).get()
        const current_user = userData.data() as User
        const profileImage = current_user.picture != "" ? await getImageUrl(current_user.picture) : ""
        current_user.picture = profileImage
        setUser(current_user)
        setLoading(false)
        }
        catch(err)
        {
            setLoading(false)
            console.log(err)
        }
    }
    const signOut = async() =>
    {
        try
        {
            setLoading(true)
            await Auth().signOut()
            rootNavigation.reset({
                index: 0, // The index of the screen to reset to (0 for the first screen)
                routes: [{ name: "SignIn"}], // The screen you want to navigate to
              });
            setLoading(false)
        }
        catch(err)
        {
            console.log(err)
        }
    }
    useEffect(()=>{
        getProfileDetails()
    },[])
    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
            {
                Loading && 
                <Loader/>
            }
            {/* header section starts */}
            <View style={{
                justifyContent:"center",
                alignItems:"center",
                padding:10,
            }}>
                <Text style={{
                   fontSize:18,
                   fontWeight:"bold",
                   color: theme.text_color
                }}>My Profile</Text>
            </View>
            {/* header section ends */}
            {/* user info starts */}
            <View style={{
                alignItems:"center"
            }}>
            <TouchableOpacity>
                <Image
                source={{uri:user.picture?user.picture: "https://picfiles.alphacoders.com/631/631729.png"}}
                style={{
                    height:100,
                    width:100,
                    borderRadius:100
                }}
                />
            </TouchableOpacity>
           
            <Text 
            style={{
                fontWeight:"bold",
                fontSize:18,
                marginVertical:5,
                color: theme.text_color
            }}>{user.name}
            </Text>
            <Text 
            style={{
                fontWeight:"400",
                fontSize:18,
                marginVertical:5,
                color: theme.text_color
            }}>{user.user_name}
            </Text>
            </View>
            {/* user info ends */}
            <View style={{
                marginHorizontal:20, 
                marginVertical:30
            }}>
                <TouchableOpacity 
                onPress={()=>navigation.navigate("EditProfile",{
                    bio: user.bio,
                    full_name: user.name,
                    profile_image:user.picture,
                    user_name:user.user_name
                })}
                style={{
                    padding:15,
                    borderRadius:10,
                    flexDirection:"row",
                    elevation:5,
                    backgroundColor: theme.seconarybackground_color
                }}>
                    
                    <FontAwesome5
                    name='edit'
                    color={theme.text_color}
                    size={20}
                    />
                   <Text style={{
                    fontSize:18,
                    fontWeight:"bold",
                    color: theme.text_color,
                    marginLeft:20
                   }}>Edit Profile</Text>
                   
                    
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>signOut()}
                style={{
                    padding:15,
                    marginTop:20,
                    borderRadius:10,
                    flexDirection:"row",
                    elevation:5,
                    backgroundColor: red
                }}>
                    
                    <FontAwesome5
                    name='edit'
                    color={theme.text_color}
                    size={20}
                    />
                   <Text style={{
                    fontSize:18,
                    fontWeight:"bold",
                    color: theme.text_color,
                    marginLeft:20
                   }}>Sign Out</Text>
                   
                    
                </TouchableOpacity>
            </View>
            
        </View>
    )

}
export default UserProfile
