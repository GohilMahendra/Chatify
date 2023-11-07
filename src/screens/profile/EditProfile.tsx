
import  React, { useState } from 'react';
import { Image, Text,TouchableOpacity,
View,TextInput,Dimensions,StyleSheet} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { launchImageLibrary } from 'react-native-image-picker';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ProfileStackParams } from '../../navigation/ProfileStackNavigation';
import { useAppDispatch } from '../../redux/store';
import { UpdateUser } from '../../redux/actions/UserActions';
import { Switch } from "react-native-elements";
import { placeholder_image } from '../../globals/Data';
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
    const dispatch = useAppDispatch()
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

    const saveChanges = async() =>
    {
        dispatch(UpdateUser({fullName:fullName,bio:bio,profilePicture:profilePicture}))
    }   
  
    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
            {/* header section starts */}
            <View style={styles.header}>
                <FontAwesome5
                onPress={()=>navigation.goBack()}
                name='angle-left'
                size={25}
                color={theme.text_color}
                />
                <Text style={[styles.headerTitle,{
                    color: theme.text_color}]}>
                Edit Profile
                </Text>
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
                source={profilePicture?{uri:profilePicture}:placeholder_image}
                style={styles.imageProfile}
                />
            </TouchableOpacity>
            <Text 
            style={[styles.textFullName,{
                color: theme.text_color
            }]}>
                {full_name}
            </Text>
            <Text 
            style={[styles.textUserName,{
            color: theme.text_color
            }]}>
                {user_name}
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
                style={[styles.inputFullName,{
                    backgroundColor:theme.seconarybackground_color,
                    color:theme.text_color
                }]}
                placeholder='Full Name ...'
                placeholderTextColor={theme.placeholder_color}
                
                />
                <TextInput
                value={bio}
                onChangeText={(text:string)=>setBio(text)}
                multiline={true}
                numberOfLines={5}
                style={[styles.inputBio,{
                    backgroundColor:theme.seconarybackground_color,
                    color: theme.text_color
                }]}
                placeholder=' bio ...'
                placeholderTextColor={theme.placeholder_color}
                
                />
            </View>
            <TouchableOpacity
            onPress={()=>saveChanges()}
            style={[styles.btnSave,{
                backgroundColor:theme.primary_color,
            }]}
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
const styles = StyleSheet.create({
    header:
    {
        flexDirection:"row",
        justifyContent:"space-between",
        padding:10,
    },
    headerTitle:
    {
        fontSize:18,
        fontWeight:"bold",
    },
    imageProfile:
    {
        height:100,
        width:100,
        borderRadius:100
    },
    textFullName:
    {
        fontWeight:"bold",
        fontSize:18,
        marginVertical:5,
    },
    textUserName:
    {
        fontWeight:"400",
        fontSize:18,
        marginVertical:5,
    },
    inputFullName:
    {
        paddingHorizontal:10,
        borderRadius:10,
        marginBottom:20,
    },
    inputBio:
    {
        paddingHorizontal:10,
        borderRadius:10,
        textAlignVertical:"top"
    },
    btnSave:
    {
        padding:20,
        alignItems:'center',
        justifyContent:"center",
        borderRadius:10,
        marginHorizontal:20,
        marginTop: width * 25/100
    }
})