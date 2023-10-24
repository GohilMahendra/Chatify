import  React,{useState} from 'react';
import { Text,View,TextInput,Dimensions,Image,TouchableOpacity } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { storyStackParams } from '../../navigation/StoryStackNavigation';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { white } from '../../globals/Colors';
import Auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { StoryUpload } from '../../types/StoryTypes';
import { RootState, useAppDispatch } from '../../redux/store';
import { UploadStory } from '../../redux/slices/StorySlice';
import { useSelector } from 'react-redux';
import Loader from '../../components/global/Loader';
const {height,width} = Dimensions.get("window")
export type MediaType = "image" | "video"
export type Story = 
{
    id:string,
    user_name: string,
    name: string,
    user_picture: string,
    user_id: string,
    content: string,
    caption: string,
    mediaType: MediaType,
    timestamp: number,

}
const CreateStory = () =>
{
 
    const route = useRoute<RouteProp<storyStackParams,"CreateStory">>()
    const navigation = useNavigation<NavigationProp<storyStackParams,"CreateStory">>()
    const media = route.params.uri
    const type = route.params.type
    const [caption,setCaption] = useState("")
    const {theme} = UseTheme()
    const dispath = useAppDispatch()
    const loading = useSelector((state:RootState)=>state.stories.loading)
    const addStory = async() =>
    {
       dispath(UploadStory({
        caption: caption,
        mediaUrl: media,
        mime: type
       }))
       
    }
    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color,
        }}>
            {
                loading &&
                <Loader/>
            }
             <View style={{
                flexDirection:"row",
                padding:5,
                justifyContent:"space-between",
                alignItems:"center" 
            }}>
                <FontAwesome5
                onPress={()=>navigation.goBack()}
                name='angle-left'
                size={30}
                color={theme.text_color}
                />
                <Text style={{
                    fontSize:18,
                    fontWeight:"bold",
                    color: theme.text_color
                }}>Add Story</Text>
                <View/>
            </View>
            <Image
            resizeMode='cover'
            source={{uri:media}}
            style={{
                width: width * 90/100,
                height: height *70/100,
                alignSelf:"center",
                marginVertical:20
            }}
            />

            <View style={{
                flexDirection:"row",
                width: width * 90/100,
                alignSelf:"center"
            }}>
                <TextInput
                value={caption}
                onChangeText={(text:string)=>setCaption(text)}
                style={{
                    padding:10,
                    fontSize:18,
                    backgroundColor: theme.seconarybackground_color,
                    borderRadius:10,
                    width: width * 70/100
                }}
                placeholder={"caption ..."}
                placeholderTextColor={theme.placeholder_color}
                />
                <TouchableOpacity 
                onPress={()=>addStory()}
                style={{
                    height:50,
                    width:50,
                    backgroundColor:theme.primary_color,
                    borderRadius:20,
                    marginLeft:20,
                    justifyContent:"center",
                    alignItems:"center"
                }}>
                    <FontAwesome5
                    name='location-arrow'
                    size={20}
                    color={white}
                    />
                </TouchableOpacity>
            </View>



        </View>
    )

}
export default CreateStory
