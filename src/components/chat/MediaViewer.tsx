import React,{useState,useRef} from "react";
import { View,SafeAreaView,Dimensions,Image,StyleSheet} from "react-native";
import UseTheme from "../../globals/UseTheme";
import AntDesign from "react-native-vector-icons/AntDesign";
import Video from "react-native-video";
import { Slider } from "react-native-elements";
import { white } from "../../globals/Colors";

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
    const [currentTime,setCurrentTime] = useState(0)
    const [duration,setDuration] = useState(0)
    const videoRef = useRef<Video | null>(null)

    const onLoad=(time:number)=>
    {
        setDuration(time)
    }
    const onProgress=(time:number)=>
    {
        setCurrentTime(time)
    }
    const onEnd=()=>
    {
        setCurrentTime(0)
    }
    const onSlidingComplete = () =>
    {
        videoRef.current?.seek(0)
    }
    return(
        <SafeAreaView style={{
            flex:1,
            backgroundColor: theme.background_color
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
                        source={{uri:uri}}
                        style={styles.imageView}/>

                    </View>
                    :
                    <View>
                        <Video
                        onLoad={(time)=>onLoad(time.duration)}
                        onProgress={(time)=>onProgress(time.currentTime)}
                        onEnd={()=>onEnd()}
                        resizeMode="contain"
                        source={{uri: uri}}
                        style={styles.video}
                        />
                        <Slider
                        value={currentTime}
                        minimumValue={0}
                        maximumValue={duration}
                        step={3}
                        onSlidingComplete={()=>onSlidingComplete()}
                        maximumTrackTintColor={theme.seconarybackground_color}
                        allowTouchTrack
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
        marginHorizontal:20,
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