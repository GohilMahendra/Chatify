import  React,{useState} from 'react';
import { Text,View,FlatList,TouchableOpacity,Image } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { launchImageLibrary } from 'react-native-image-picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { craeteStoryParams, storyStackParams } from '../../navigation/StoryStackNavigation';
import { Story } from '../../types/StoryTypes';
const Stories = () =>
{
    const {theme} = UseTheme()
    const [stories,setStories] = useState<Story[]>([])
    const navigation = useNavigation<NavigationProp<storyStackParams,"Stories">>()
  
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
             data={stories}
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
                     
                     >
                         <Image
                         source={{uri:item.user_picture}}
                         style={{
                             height:70,
                             width:70,
                             borderRadius:70,
                             margin:10
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
