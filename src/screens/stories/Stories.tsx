import  React,{useEffect, useState} from 'react';
import { Text,View,FlatList,TouchableOpacity,Image } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { launchImageLibrary } from 'react-native-image-picker';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import {  storyStackParams } from '../../navigation/StoryStackNavigation';
import {  StoryUser } from '../../types/StoryTypes';
import { RootState, useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { fetchStories } from '../../redux/slices/StorySlice';
const Stories = () =>
{
    const {theme} = UseTheme()
    const [stories,setStories] = useState<StoryUser[]>([])
    const navigation = useNavigation<NavigationProp<storyStackParams,"Stories">>()
    const dispatch = useAppDispatch()
    const loading = useSelector((state:RootState)=>state.stories.loading)
    const data = useSelector((state:RootState)=>state.stories.stories)
    console.log(data)
    const user = useSelector((state:RootState)=>state.user.user)
    const error = useSelector((state:RootState)=>state.stories.error)
    const openImagePicker=async()=>
    {
    
        const response = await launchImageLibrary({
        mediaType:"mixed",
        presentationStyle:"popover",
        selectionLimit:1
        })

        if(!response.didCancel)
        {
        if(response.assets?.[0])
        {
            navigation.navigate("CreateStory",{
                type:response.assets[0].type || "",
                uri:response.assets[0].uri || "",
            })
        }
        }
    } 
    const getStories = async() =>
    {
      const status =  await dispatch(fetchStories(""))  
     
    }
    useEffect(()=>{
      getStories()
    },[])

    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
            {/* header starts */}
            <View style={{
                marginTop:20
            }}>
                <Text style={{
                    fontSize:30,
                    paddingHorizontal:20,
                    fontWeight:"bold",
                    color: theme.text_color
                }}>Stories</Text>
            </View>
            {/* header ends */}
            {/* story section starts */}
            <View>
             <View style={{
                flexDirection:"row"
             }}>
                <TouchableOpacity 
                onPress={()=>openImagePicker()}
                style={{
                    marginTop:30,
                    padding:20,
                    borderRadius:20,
                    width: "100%",
                    backgroundColor: theme.seconarybackground_color
                }}>
                    <Image
                    source={{uri:user.picture}}
                    style={{
                        height:70,
                        width:70,
                        borderRadius:70
                    }}
                    />
                </TouchableOpacity>    
            </View> 
            <Text style={{
                margin:20,
                fontSize:18,
                color: theme.text_color,
                fontWeight:"bold"
            }}>Recent Updates</Text>
             <FlatList
             horizontal
             data={data}
             showsHorizontalScrollIndicator={false}
             renderItem={({item,index})=>{
                 return(
                    
                        
                    <TouchableOpacity
                     onPress={()=>navigation.navigate("StoryViewer",{user_id:item.id})}
                     style={{
                        padding:3,
                        borderRadius:70,
                        borderColor: theme.primary_color,
                        borderWidth:2,
                       // flexDirection:"row",
                        marginHorizontal:10
                     }}
                     >
                         <Image
                         resizeMode='contain'
                         source={{uri:item.picture}}
                         style={{
                             height:70,
                             width:70,
                             borderRadius:70,
                         }}
                         />
                     </TouchableOpacity>
                 )
             }}
             >

             </FlatList>

            </View>
            {/* story section ends */}
        </View>
    )

}
export default Stories
