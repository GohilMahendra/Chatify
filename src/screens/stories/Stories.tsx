import  React,{useEffect} from 'react';
import { Text,View,FlatList,TouchableOpacity,Image,StyleSheet } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { launchImageLibrary } from 'react-native-image-picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {  storyStackParams } from '../../navigation/StoryStackNavigation';
import { RootState, useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { fetchStories } from '../../redux/actions/storyactions';
import StoryComponent from '../../components/stories/StoryComponent';
import { white } from '../../globals/Colors';
import { placeholder_image } from '../../globals/Data';
const Stories = () =>
{
    const {theme} = UseTheme()
    const navigation = useNavigation<NavigationProp<storyStackParams,"Stories">>()
    const dispatch = useAppDispatch()
    const loading = useSelector((state:RootState)=>state.stories.loading)
    const data = useSelector((state:RootState)=>state.stories.stories)
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
      dispatch(fetchStories("")) 
    }
    useEffect(()=>{
      navigation.addListener("focus",()=>{
        getStories()
      })
      
    },[])

    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
            {/* header starts */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle,{    
                color: theme.text_color
                }]}>Stories</Text>
            </View>
            {/* header ends */}
            
            {/* story section starts */}
            <View>
             <View style={{
                flexDirection:"row",
             }}>
                <TouchableOpacity 
                onPress={()=>openImagePicker()}
                style={[styles.btnCreateStory,{
                    backgroundColor: theme.seconarybackground_color
                }]}>
                    <View style={styles.storyCreateContainer}>
                        <Image
                        source={user.picture?{uri:user.picture}:placeholder_image}
                        style={styles.imageUser}
                        />
                        
                        <View style={[styles.plusIconContainer,{
                            backgroundColor: theme.primary_color
                        }]}>
                            <Text style={styles.plusIcon}>+</Text>
                        </View>
                    </View>

                    <View style={{
                        marginLeft:20,
                        padding:10,
                    }}>
                        <Text style={[styles.textAddStory,{
                            color: theme.text_color
                        }]}>
                            Add a story
                        </Text>
                        <Text style={[styles.textCreateHeader,{
                            color: theme.text_color
                        }]}>
                            create a daily updates for friends & family
                        </Text>
                    </View>
                </TouchableOpacity>    
            </View> 
            <Text style={[styles.textUpdates,{    
            color: theme.text_color,
            }]}>Recent Updates</Text>
             <FlatList
             horizontal
             data={data}
             showsHorizontalScrollIndicator={false}
             renderItem={({item,index})=>{
                 return(      
                    <StoryComponent
                    story={item}
                    />
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
const styles = StyleSheet.create({
    header:
    {
        marginTop:20
    },
    headerTitle:
    {
        fontSize:30,
        paddingHorizontal:20,
        fontWeight:"bold",
    },
    textUpdates:
    {
        margin:20,
        fontSize:18,
        fontWeight:"bold"
    },
    storyCreateContainer:
    {
        height:70,
        width:70,
        borderRadius:70
    },
    btnCreateStory:
    {
        marginTop:30,
        padding:20,
        width: "100%",
        flexDirection:"row",
        elevation:5,
    },
    imageUser:
    {
        height:70,
        width:70,
        borderRadius:70,
        resizeMode:"contain"
    },
    plusIconContainer:
    {
        position:'absolute',
        height:20,
        width:20,
        justifyContent:"center",
        alignItems:"center",
        alignSelf:"flex-end",
        bottom:3,
        borderRadius:15,
    },
    plusIcon:
    {
        color: white,
        fontSize:15
    },
    textAddStory:
    {
        fontSize:18,
        fontWeight:"bold"
    },
    textCreateHeader:
    {
        fontSize:15,
        width:"80%"
    }

})
