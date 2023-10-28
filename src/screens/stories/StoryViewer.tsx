import  React,{useRef,useEffect, useState} from 'react';
import { Image,Text,View,Dimensions,TouchableOpacity,Animated } from 'react-native';
import UseTheme from '../../globals/UseTheme';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {  storyStackParams } from '../../navigation/StoryStackNavigation';
import {  StoryUser, UserStory } from '../../types/StoryTypes';
import { RootState, useAppDispatch } from '../../redux/store';
import { Story } from '../../types/StoryTypes';
import { black, grey, white } from '../../globals/Colors';
import { useSelector, useStore } from 'react-redux';
import Video from 'react-native-video';
const {width,height} = Dimensions.get("window")
const StoryViewer = () =>
{
    const {theme} = UseTheme()
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
    const [duration,setDuration] = useState<number>(10)

    const widthBar = width/userStory.stories.length - userStory.stories.length*3
    
    const startStory = () =>
    {
        Animated.timing(
            progress,
            {
                toValue: widthBar,
                duration: duration * 1000,
                useNativeDriver:false,
            }
        ).start(()=>{
            nextStory()
        })
    }

    useEffect(()=>{
        if(userStory.stories[currentIndex].mime == "image")
        {
            setDuration(10)
        }
    },[currentIndex])
    
    const nextStory = () =>
    {
        if(currentIndex < userStory.stories.length -1)
            {
                // const temp = userStory.stories
                // const current = temp[currentIndex]
                // temp[currentIndex] = current
                // setUserStory(temp)
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
            // const temp = storyArr
            // const current = temp[currentIndex]
            // current.viewed = true
            // temp[currentIndex] = current
            // setStoryArr(temp)
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
        <View style={{
            backgroundColor:"black",
            flex:1
        }}>
            
            <View style={{
                flexDirection:"row",
                justifyContent:"space-between"

            }}>
                {userStory.stories.map((item:any,index:number)=>(
                    <View 
                    key={item.id.toString()}
                    style={{
                        width:widthBar,
                        height:2,
                        borderRadius:5,
                        backgroundColor:"silver"
                    }}>
                        <Animated.View
                        style={{
                            position:"absolute",
                            borderRadius:5,
                            backgroundColor:"#fff",
                            width:(currentIndex == index) ? progress : 0,
                            height:2
                        }}
                        />
                    </View>
                ))}
            </View>
            {/* user profile section starts */}
            <View style={{
                flexDirection:"row",
                padding:10,
                position:"absolute",
                 zIndex:10000,
                width: width,
                alignSelf:"center",
                top:10
            }}>
                <Image
                source={{uri:userStory.picture}}
                style={{
                    height:50,
                    width:50,
                    borderRadius:50
                }}
                resizeMode='contain'
                />
                <View style={{
                    justifyContent:"center",
                    marginLeft:20
                }}>
                    <Text
                    style={{
                        fontSize:18,
                        fontWeight:"bold",
                        color: white,
                        shadowColor:black,
                        shadowOffset:{
                            height:10,
                            width:5
                        },
                        shadowOpacity:1
                    }}
                    >{userStory.name}</Text>
                    <Text style={{
                        fontSize:15,
                        fontWeight:"300",
                        color: white
                    }}>{userStory.user_name}</Text>

                </View>
            </View>
            {/* user profile section ends */}
            <View style={{
                flex:1
            }}>
                {userStory.stories[currentIndex].mime.includes("video")
                ?
                        <Video
                        onLoad={(item)=>{setDuration(item.duration),startStory()}}

                        resizeMode={"contain"}
                        style={{
                            height: height *90/100,
                            width: width * 90/100,
                            alignSelf:"center"
                        }}
                        source={{uri:userStory.stories[currentIndex].mediaUrl}}

                        />
                      :<Animated.Image
                      onLoadEnd={()=>startStory()}
                      style={{
                          height:height,
                          width:width
                      }}
      
                      source={{uri:userStory.stories[currentIndex].mediaUrl}}
                      />
                }
              
                
                <View style={{
                    position:"absolute",
                    height:height,
                    width:width,
                    justifyContent:"space-between",
                    flexDirection:"row"
                }}>
                    <TouchableOpacity
                    onPress={()=>previousStory()}
                    style={{
                        height:"100%",
                        width:"40%",
                    }}
                    />
                    <TouchableOpacity
                    onPress={()=>nextStory()}
                    style={{
                        height:"100%",
                        width:"40%",
                    }}
                    />
            
                </View>
            </View>
           
            
        </View>
    )

}
export default StoryViewer
