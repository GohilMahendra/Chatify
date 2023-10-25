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
    const error = useSelector((state:RootState)=>state.stories.error)
    const openImagePicker=async()=>
    {
    
        const response = await launchImageLibrary({
        mediaType:"photo",
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
      console.log(status) 
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
           
            {/* header ends */}
            {/* story section starts */}
            <View style={{
                
            }}>
             <FlatList
             horizontal
             data={data}
             showsHorizontalScrollIndicator={false}
             ListHeaderComponent={()=>{
                 return(
                     <TouchableOpacity 
                     onPress={()=>openImagePicker()}
                     style={{
                         height:70,
                         width:70,
                         justifyContent:"center",
                         alignItems:"center",
                         borderRadius:70,
                         borderColor:theme.placeholder_color,
                         borderWidth:1,
                         margin:10
                     }}>
                         <Text style={{
                             color: theme.placeholder_color,
                             fontWeight:"bold",
                             fontSize:18
                         }}>+</Text>
                     </TouchableOpacity>
                 )

             }}
             renderItem={({item,index})=>{
                 return(
                     <TouchableOpacity
                     onPress={()=>navigation.navigate("StoryViewer",{user_id:item.id})}
                     style={{
                        padding:3,
                        borderRadius:70,
                        borderColor: theme.primary_color,
                        borderWidth:2,
                        margin:10
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
