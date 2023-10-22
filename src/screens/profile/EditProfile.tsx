
import  React, { useState } from 'react';
import { Image, Text,TouchableOpacity,View,TextInput,Dimensions} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { launchImageLibrary } from 'react-native-image-picker';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ProfileStackParams } from '../../navigation/ProfileStackNavigation';
import firestore from "@react-native-firebase/firestore";
import Auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { User } from '../../types/UserTypes';
import { RootStackParams } from '../../navigation/RootNavigation';
const {height,width} = Dimensions.get("window")

const EditProfile = () =>
{
    const {theme} = UseTheme()
    const route = useRoute<RouteProp<ProfileStackParams,"EditProfile">>()
    const navigation = useNavigation<NavigationProp<ProfileStackParams,"EditProfile">>()
    const user_name = route.params.user_name ||""
    const full_name = route.params.full_name || ""
    const full_bio = route.params.bio || ""
    const profile_image = route.params.profile_image || ""
    const [profilePicture,setProfilePicture] = useState(profile_image)
    const [fullName,setFullName] = useState(full_name)
    const [bio,setBio] = useState(full_bio)

    const openImagePicker=async()=>
    {
       
        const response = await launchImageLibrary({
           mediaType:"photo",
           presentationStyle:"popover"
        })

        if(!response.didCancel)
        {
          if(response.assets?.[0])
          {
            setProfilePicture(response.assets[0].uri || "")
          }
        }
    }

    const uploadImage = async(uri:string , path:string)=>
    {
        try
        {
        const ref = storage().ref(path)
        await ref.putFile(uri)
        }
        catch(err)
        {
            console.log(err)
        }
    }
   
    const saveChanges = async() =>
    {
        try
        {
            const userId = Auth().currentUser?.uid

            const imageChanged:boolean = profilePicture != profile_image

            

            let imagePath = ""
            if(imageChanged)
            {
                const mimes = profilePicture.split(".")
                const mimeType = mimes[mimes.length - 1]
                const fileName = userId + "." + mimeType
                imagePath =  "ProfileImages/"+userId+"/"+fileName
                await uploadImage(profilePicture,imagePath)
            }

            const userData: Partial<User> = 
            {
                bio:bio,
                name: fullName,
                ...(imageChanged ? { picture: imagePath } : {})
            }

        const user =  Auth().currentUser
        await user?.updateProfile({
            displayName: fullName,
            ...(imageChanged ? { photoURL: imagePath } : {})
        })
        const docRef =  firestore().collection("users").doc(userId)
        const updateResponse = await docRef.update(userData)
        console.log(updateResponse)
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
            {/* header section starts */}
            <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                padding:10,
            }}>
                <FontAwesome5
                onPress={()=>navigation.goBack()}
                name='angle-left'
                size={25}
                color={theme.text_color}
                />
                <Text style={{
                   fontSize:18,
                   fontWeight:"bold",
                   color: theme.text_color
                }}>Edit Profile</Text>
                <View/>
            </View>
            {/* header section ends */}
            {/* user info starts */}
            <View style={{
                alignItems:"center"
            }}>
            <TouchableOpacity
            onPress={()=>openImagePicker()}
            >
                <Image
                source={{uri:profilePicture ? profilePicture : "https://picfiles.alphacoders.com/631/631729.png"}}
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
            }}>Tanjiro Kamado
            </Text>
            <Text 
            style={{
                fontWeight:"400",
                fontSize:18,
                marginVertical:5,
                color: theme.text_color
            }}>tanjiro_kamado
            </Text>
            </View>
            {/* user info ends */}
            {/* user edit starts */}
            <View style={{
                marginHorizontal:20,
                marginVertical:30,
            }}>
                <TextInput
                value={fullName}
                onChangeText={(text:string)=>setFullName(text)}
                style={{
                    paddingHorizontal:10,
                    backgroundColor:theme.seconarybackground_color,
                    borderRadius:10,
                    marginBottom:20,
                    color:theme.text_color
                }}
                placeholder='Full Name ...'
                placeholderTextColor={theme.placeholder_color}
                
                />
                <TextInput
                value={bio}
                onChangeText={(text:string)=>setBio(text)}
                multiline={true}
                numberOfLines={5}
                style={{
                    paddingHorizontal:10,
                    backgroundColor:theme.seconarybackground_color,
                    borderRadius:10,
                    color: theme.text_color,
                    textAlignVertical:"top"
                }}
                placeholder=' bio ...'
                placeholderTextColor={theme.placeholder_color}
                
                />
            </View>
            <TouchableOpacity
            onPress={()=>saveChanges()}
            style={{
                backgroundColor:theme.primary_color,
                padding:20,
                alignItems:'center',
                justifyContent:"center",
                borderRadius:10,
                marginHorizontal:20,
                marginTop: width * 25/100
            }}
            >
                <Text style={{
                    fontWeight:"bold",
                    fontSize:20,
                    color: theme.text_color
                }}>Save</Text>
            </TouchableOpacity>
            {/* user edit ends */}
        </View>
    )

}
export default EditProfile
