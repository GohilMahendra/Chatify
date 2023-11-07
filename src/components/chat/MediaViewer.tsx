import React,{useState,useRef, useEffect} from "react";
import { View,SafeAreaView,Dimensions,
    Text,Image,StyleSheet, TouchableOpacity} from "react-native";
import UseTheme from "../../globals/UseTheme";
import AntDesign from "react-native-vector-icons/AntDesign";
import Video from "react-native-video";
import { Slider } from "react-native-elements";
import { black, white } from "../../globals/Colors";

const {height,width} = Dimensions.get("window")
export type MediaViewerProps=
{
    uri:string,
    type:string,
    onClose:()=>void
}
const MediaViewer = (props: MediaViewerProps) =>
{
    const {theme} = UseTheme()
    const {uri,type,onClose} = props
    const [currentTime,setCurrentTime] = useState<number>(0)
    const [remainTime,setRemainTime] = useState<string>("00:00")
    const [duration,setDuration] = useState<number>(0)
    const [paused,setPaused] = useState<boolean>(false)
    const videoRef = useRef<Video | null>(null)

    const onLoad = async(time:number) => { 
        setDuration(time)
    };
    const onProgress =(value:number)=>
    {
        const remainingTime = duration - value;
        const mins = Math.floor(remainingTime / 60);
        const secs = Math.floor(remainingTime % 60);
        const time = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        setRemainTime(time);
        setCurrentTime(value);
    }
    const onValueChange = (value:number) =>
    {
        videoRef.current?.seek(value)
    }
    const onEnd= ()=>
    {
       // setCurrentTime(0)
        videoRef.current?.seek(0)
    }

    useEffect(()=>{
        console.log(currentTime,duration)
    },[currentTime])

    return(
        <SafeAreaView style={{
            flex:1,
            backgroundColor: black
        }}>
            <View style={styles.header}>
                <AntDesign
                 onPress={()=>onClose()}
                 name="closecircleo"
                 size={30}
                 style={styles.backIcon}
                 color={white}
                />
            </View>
            <View style={{
                flex:1
            }}>
                {
                    type.includes("image")?
                    <View>
                        <Image 
                        testID={"image_viewer"}
                        source={{uri:uri}}
                        style={styles.imageView}/>

                    </View>
                    :
                    <View>
                        <TouchableOpacity
                        testID={"btn_pauseVideo"}
                        onPress={()=>setPaused(!paused)}
                        >
                        <Video
                        testID="video_viewer"
                        ref={ref=>videoRef.current = ref}
                        paused={paused}
                        repeat
                        onLoad={(time)=>onLoad(time.duration)}
                        onProgress={(time)=>onProgress(time.currentTime)}
                        onEnd={()=>onEnd()}
                        resizeMode="cover"
                        source={{uri: uri}}
                        style={styles.video}
                        />
                        </TouchableOpacity>
                        <Text
                        style={{
                            position:"absolute",
                            bottom:60,
                            color: white,
                            margin:20,
                            right:20
                        }}
                        >{remainTime}</Text>
                        <Slider
                        
                        value={currentTime}
                        minimumValue={0}
                        maximumValue={duration}
                        onSlidingComplete={(data)=>onValueChange(data)}
                        maximumTrackTintColor={theme.seconarybackground_color}
                        minimumTrackTintColor={theme.primary_color}
                        thumbStyle={[styles.slider,{
                         backgroundColor: theme.primary_color
                        }]}
                        style={styles.sliderContainer}
                        />
                    </View>
                }
            </View>

        </SafeAreaView>
    )

}
export default MediaViewer
const styles = StyleSheet.create({
    slider:
    {
        height:20,
        width:20,
    },
    sliderContainer:
    {
        alignSelf:"center",
        width:width * 90/100,
        position:"absolute",
        bottom:50
    },
    header:
    {
        position:"absolute",
        zIndex:1000,
        padding:10,
        width:"100%",
        alignItems:"center"
    },
    backIcon:
    {
        padding:10,
        alignSelf:"flex-end",
        shadowColor:"black",
        shadowOpacity:0.5,
        textShadowColor:"black",
        textShadowRadius:1,
        textShadowOffset:{
            height:1,
            width:1
        }
     },
    video:
    {
        height:"100%",
        width:"100%"
    },
    imageView:
    {
        alignSelf:"center",
        height:"100%",
        width:"100%"
    },




})