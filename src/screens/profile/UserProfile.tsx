
import  React,{useState,useEffect} from 'react';
import { Image, Text,TouchableOpacity,View,StyleSheet } from 'react-native';
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
import { red, white } from '../../globals/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export type CompositeProfileProps = CompositeScreenProps<
NativeStackScreenProps<ProfileStackParams,"UserProfile">,
NativeStackScreenProps<RootStackParams>
>
const UserProfile = () =>
{
    const {theme} = UseTheme()
   
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
                source={{uri:user.picture?user.picture: "https://picfiles.alphacoders.com/631/631729.png"}}
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
                    backgroundColor: theme.seconarybackground_color
                }]}>    
                    <FontAwesome5
                    name='edit'
                    color={theme.text_color}
                    size={20}
                    />
                   <Text style={[styles.textEditProfile,{
                        color: theme.text_color
                    }]}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>signOut()}
                style={styles.btnSignOut}>
                    <FontAwesome5
                    name='edit'
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
        elevation:5
    },
    textEditProfile:
    {
        fontSize:18,
        fontWeight:"bold",
        marginLeft:20
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
