import  React,{useRef,useEffect, useState} from 'react';
import { Image,Text,Easing,SafeAreaView,
View,Dimensions,TouchableOpacity,Animated,StyleSheet} from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {  storyStackParams } from '../../navigation/StoryStackNavigation';
import {  UserStory } from '../../types/StoryTypes';
import { RootState, useAppDispatch } from '../../redux/store';
import { black, white } from '../../globals/Colors';
import { useSelector } from 'react-redux';
import Video from 'react-native-video';
import { ViewStory } from '../../redux/actions/storyactions';
import { placeholder_image } from '../../globals/Data';
const {width,height} = Dimensions.get("window")
const StoryViewer = () =>
{
    const storiesData = useSelector((state:RootState)=>state.stories.stories)
    const route = useRoute<RouteProp<storyStackParams,"StoryViewer">>()
    const user_id = route.params.user_id
    let index = storiesData.findIndex((story:UserStory)=>story.id == user_id)
    const currentStory = storiesData[index]
    const [userStory,setUserStory] = useState<UserStory>(currentStory)
    const navigation = useNavigation<NavigationProp<storyStackParams,"Stories">>()
    const dispatch = useAppDispatch()
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const progress = useRef(new Animated.Value(0)).current
    const [duration,setDuration] = useState<number>(0)
    const widthBar = width/userStory.stories.length - userStory.stories.length*3
    const [paused,setPaused] = useState<boolean>(false)
    const startStory = () =>
    {
        Animated.timing(
            progress,
            {
                toValue: widthBar,
                duration: duration * 1000,
                useNativeDriver:false,
                easing: Easing.linear
            }
        ).start(({finished})=>{
          // if(finished)
           nextStory()
        })
    }

    const onPause = () =>
    {
        setPaused(true)
        progress.stopAnimation()
    }
    const onPlay=()=>
    {
        setPaused(false)
        startStory()
    }

    useEffect(()=>{
        if(duration!=0)
        startStory()
    },[duration])

    useEffect(()=>{
        if(userStory.isViewed == false)
        dispatch(ViewStory({story_id:userStory.id}))
    },[userStory.id])
    
    const nextStory = () =>
    {
        if(currentIndex < userStory.stories.length -1)
            {
                progress.setValue(0)
                setCurrentIndex(currentIndex + 1)
            }
        else{
            goToNextStory()

        }
    }

    const previousStory = () =>
    {
        if(currentIndex != 0)
        {
            progress.setValue(0)
            setCurrentIndex(currentIndex - 1)
        }
    }

    const goToNextStory = () =>
    {
        setCurrentIndex(0)
        progress.setValue(0)
         if(storiesData.length > index + 1)
         {
            index++
            setUserStory(storiesData[index])
         }
         else
         {
            navigation.goBack()
         }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.storyBarContainer}>
                {userStory.stories.map((item:any,index:number)=>(
                    <View 
                    key={item.id.toString()}
                    style={[styles.storyBar,{width:widthBar}]}>
                        <Animated.View
                        style={[styles.animatedBar,{
                            width:(currentIndex == index) ? progress : 0
                        }]}
                        />
                    </View>
                ))}
            </View>
            {/* user profile section starts */}
            <View style={styles.profileContainer}>
                <Image
                source={userStory.picture?{uri:userStory.picture}:placeholder_image}
                style={styles.imageProfile}
                resizeMode='contain'
                />
                <View style={{
                    justifyContent:"center",
                    marginLeft:20
                }}>
                    <Text style={styles.textUserName}>
                        {userStory.name}
                    </Text>
                    <Text style={styles.textUserUserName}>
                        {userStory.user_name}
                    </Text>
                </View>
            </View>
            {/* user profile section ends */}
            <View 
            
            style={{
                flex:1
            }}>
                {userStory.stories[currentIndex].mime.includes("video")
                ?
                        <TouchableOpacity
                        //onLongPress={()=>paused ? onPlay(): onPause()}
                        >
                        <Video
                        paused={paused}
                        onLoad={(item)=>{setDuration(item.duration)}}
                        resizeMode={"cover"}
                        style={styles.mediaVideo}
                        source={{uri:userStory.stories[currentIndex].mediaUrl}}
                        />
                         </TouchableOpacity>
                        :
                        <Animated.Image
                        onLoadEnd={()=>setDuration(5)}
                        style={styles.mediaImage}
                        source={{uri:userStory.stories[currentIndex].mediaUrl}}
                        />
                       
                }
                <View style={styles.tapContainer}>
                    <TouchableOpacity
                    onPress={()=>previousStory()}
                    style={styles.btnBackTap}
                    />
                    <TouchableOpacity
                    onPress={()=>nextStory()}
                    style={styles.btnNextTap}
                    />
                </View>
            </View>      
        </SafeAreaView>
    )

}
export default StoryViewer
const styles = StyleSheet.create({
    container:
    {
        backgroundColor:"black",
        flex:1
    },
    storyBarContainer:
    {
        flexDirection:"row",
        justifyContent:"space-between",
        marginHorizontal:10,
        position:"absolute",
        top:2,
        zIndex:20000,
        width: width
    },
    storyBar:
    {
        height:3,
        borderRadius:5,
        backgroundColor:"#A9A9A9",
        shadowOffset:{
            height:2,
            width:1
        },
        shadowColor:"black",
        shadowOpacity:1,
        shadowRadius:20
    },
    animatedBar:
    {
        position:"absolute",
        borderRadius:5,
        backgroundColor:"white",
        height:5,
        shadowOffset:{
            height:2,
            width:1
        },
        shadowColor:"black",
        shadowOpacity:1,
        shadowRadius:20
    },
    profileContainer:
    {
        flexDirection:"row",
        padding:10,
        position:"absolute",
        zIndex:10000,
        width: width,
        alignSelf:"center",
        top:10
    },
    imageProfile:
    {
        height:50,
        width:50,
        borderRadius:50
    },
    textUserName:
    {
        fontSize:18,
        fontWeight:"bold",
        color: white,
        shadowColor:black,
        textShadowColor:black,
        textShadowOffset:{
            height:2,
            width:2
        },
        textShadowRadius:10,
       
    },
    textUserUserName:
    {
        fontSize:15,
        fontWeight:"300",
        color: white,
        shadowColor:black,
        textShadowColor:black,
        textShadowOffset:{
            height:2,
            width:2
        },
        textShadowRadius:10,
    },
    mediaVideo:
    {
        height: height *100/100,
        width: width * 100/100,

        alignSelf:"center"
    },
    mediaImage:
    {
        height:height,
        width:width
    },
    tapContainer:
    {
        position:"absolute",
        height:height,
        width:width,
        justifyContent:"space-between",
        flexDirection:"row"
    },
    btnBackTap:
    {
        height:"100%",
        width:"40%",
    },
    btnNextTap:
    {
        height:"100%",
        width:"40%",
    }
})
