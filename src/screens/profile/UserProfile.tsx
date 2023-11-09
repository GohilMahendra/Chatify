
import  React,{useState,useEffect} from 'react';
import { Image, Text,TouchableOpacity,View,StyleSheet } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import { CompositeScreenProps, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/RootNavigation';
import { ProfileStackParams } from '../../navigation/ProfileStackNavigation';
import firestore from "@react-native-firebase/firestore";
import Auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { User } from '../../types/UserTypes';
import Loader from '../../components/global/Loader';
import { light_pink, ocean_blue, purple_black, red, white } from '../../globals/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { placeholder_image } from '../../globals/Data';

export type CompositeProfileProps = CompositeScreenProps<
NativeStackScreenProps<ProfileStackParams,"UserProfile">,
NativeStackScreenProps<RootStackParams>
>
const UserProfile = () =>
{
    const {theme,setTheme} = UseTheme()
   
    const navigation = useNavigation<NavigationProp<ProfileStackParams,"UserProfile">>()
    const rootNavigation = useNavigation<NavigationProp<RootStackParams>>()
    const user = useSelector((state:RootState)=>state.user.user)
    const loading = useSelector((state:RootState)=>state.user.loading)
    const getImageUrl = async(imageRef:string) =>
    {
        const storageRef = storage().ref(imageRef)
        const imageUrl = await storageRef.getDownloadURL()
        return imageUrl
    }
  
    const signOut = async() =>
    {
        try
        {
            
            await Auth().signOut()
            rootNavigation.reset({
                index: 0, // The index of the screen to reset to (0 for the first screen)
                routes: [{ name: "SignIn"}], // The screen you want to navigate to
              });
        }
        catch(err)
        {
            console.log(err)
        }
    }
    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
            {
                loading && 
                <Loader/>
            }
            {/* header section starts */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle,{            
                    color: theme.text_color
                }]}>My Profile</Text>
            </View>
            {/* header section ends */}

            {/* user info starts */}
            <View style={{
                alignItems:"center"
            }}>
            <TouchableOpacity>
                <Image
                source={user.picture ?{uri:user.picture}:placeholder_image}
                style={styles.imgUserImage}
                />
            </TouchableOpacity>
            <Text 
            style={[styles.textUserName,{
                color: theme.text_color
            }]}>{user.name}
            </Text>
            <Text 
            style={[styles.textUserUserName,{
                color: theme.text_color
            }]}>{user.user_name}
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
                style={[styles.btnEditProfile,{
                    backgroundColor: theme.primary_color
                }]}>    
                    <FontAwesome5
                    name='edit'
                    color={white}
                    size={20}
                    />
                   <Text style={[styles.textEditProfile]}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>setTheme()}
                style={[styles.btnEditProfile,{
                    backgroundColor: light_pink
                }]}>    
                    <FontAwesome5
                    name={theme.mode == "dark" ?'sun':"moon"}
                    color={white}
                    size={20}
                    />
                   <Text style={styles.textSignOut}>
                    {
                        theme.mode == "dark"?"Light Mode":"Dark Mode"
                    }
                   </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[styles.btnEditProfile,{
                    backgroundColor: ocean_blue
                }]}>    
                    <FontAwesome5
                    name={"gem"}
                    color={white}
                    size={20}
                    />
                   <Text style={styles.textSignOut}>
                    About
                   </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>signOut()}
                style={styles.btnSignOut}>
                    <Feather
                    name='log-out'
                    color={white}
                    size={20}
                    />
                   <Text style={styles.textSignOut}>Sign Out</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    )

}
export default UserProfile
const styles = StyleSheet.create({
    header:
    {
        justifyContent:"center",
        alignItems:"center",
        padding:10,
    },
    headerTitle:
    {
        fontSize:18,
        fontWeight:"bold"
    },
    imgUserImage:
    {
        height:100,
        width:100,
        resizeMode:"contain",
        borderRadius:100
    },
    textUserName:
    {
        fontWeight:"bold",
        fontSize:18,
        marginVertical:5,
    },
    textUserUserName:
    {
        fontWeight:"400",
        fontSize:18,
        marginVertical:5,
    },
    btnEditProfile:
    {
        padding:15,
        borderRadius:10,
        flexDirection:"row",
        elevation:5,
        marginTop:20
    },
    textEditProfile:
    {
        fontSize:18,
        fontWeight:"bold",
        marginLeft:20,
        color: white
    },
    btnSignOut:
    {
        padding:15,
        marginTop:20,
        borderRadius:10,
        flexDirection:"row",
        elevation:5,
        backgroundColor: red
    },
    textSignOut:
    {
        fontSize:18,
        fontWeight:"bold",
        color:white,
        marginLeft:20
    }
})
