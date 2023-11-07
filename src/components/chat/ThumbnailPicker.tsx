import  React,{useState,useRef} from 'react';
import { View,Text,TouchableOpacity,Dimensions,StyleSheet } from 'react-native';
import UseTheme from '../../globals/UseTheme';
const {height,width} = Dimensions.get("window")
import Video from 'react-native-video';
import { Slider } from 'react-native-elements';
import ViewShot,{ captureRef } from "react-native-view-shot";
import AntDesign from "react-native-vector-icons/AntDesign";
type ThumbnailProps =
{
    videoUri: string,
    onClose:()=>void,
    onSelect:()=>void,
    onThubnail:(uri:string)=>void
}

const ThumbnailPicker = (props:ThumbnailProps) =>
{
    const {onClose,onThubnail,onSelect,videoUri} = props
    const [duration,setDuration] = useState<number>(0)
    const [currentTime,setCurrentTime] = useState<number>(0)
    const videoRef = useRef<Video | null>(null)
    const viewRef = useRef<View | null>(null)
    const {theme} = UseTheme()

    const onProgress =(value:number)=>
    {
        setCurrentTime(value)
    }
    const onValueChange = (value:number) =>
    {
        videoRef.current?.seek(value)
    }
    const captureShot = async() =>
    {
        if(viewRef.current)
        {
          try
          {
            const image = await captureRef(videoRef,{
                format:"png",
                quality:1
            })
            return image
          }
          catch(err)
          {
            console.log(err)
          }
        }
    }
    const onLoad = async(time:number) => { 
       const image =  await captureShot() 
       onThubnail(image ?? "")
       setDuration(time)
    };
    const onEnd= ()=>
    {
        videoRef.current?.seek(0)
        setCurrentTime(0)
    }
    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
            <View style={styles.header}>
                <View/>
                <Text style={[styles.textHeaderTitle,{    
                    color: theme.text_color
                }]}>Preview</Text>
                <AntDesign
                testID={"btn_close"}
                onPress={()=>onClose()}
                name={"closecircleo"}
                size={30}
                color={theme.text_color}
                />
            </View>
            <View ref={viewRef}>
                <Video
                testID={"video"}
                repeat
                paused={false}
                onLoad={state=>onLoad(state.duration)}
                onEnd={()=>onEnd()}
                onProgress={state=>onProgress(state.currentTime)}
                ref={ref=>videoRef.current = ref}
                source={{uri:videoUri}}
               // currentTime={currentTime.current}
                resizeMode='contain'
                style={styles.video}
                />
            </View>
            <Slider
            value={currentTime}
            minimumValue={0}
            maximumValue={duration}
            step={3}
            onSlidingComplete={(value)=>onValueChange(value)}
            maximumTrackTintColor={theme.seconarybackground_color}
            allowTouchTrack
            minimumTrackTintColor={theme.primary_color}
            thumbStyle={[styles.slider,{
             backgroundColor: theme.primary_color
            }]}
            style={{
                marginHorizontal:20
            }}
            />
            <TouchableOpacity 
            testID={"btn_send"}
            onPress={()=>{onClose(),onSelect()}}
            style={[styles.btnSend,{
                backgroundColor: theme.primary_color,
            }]}>
                <Text style={[styles.textSend,{
                    color: theme.text_color,
                }]}>Send</Text>
            </TouchableOpacity>
        </View>

    )

}
export default ThumbnailPicker
const styles = StyleSheet.create({
    header:
    {
        flexDirection:"row",
       // width: width * 90/100,
        alignSelf:"center",
        width: width,
        padding:10,
        justifyContent:'space-between'
    },
    textHeaderTitle:
    {
        fontSize:20
    },
    video:
    {
        width: width* 90/100,
        alignSelf:"center",
        height: height *70/100
    },
    slider:
    {
        height:20,
        width:20,
    },
    btnSend:
    {
        //height:50,
        margin:10,
        justifyContent:"center",
        alignItems:"center",
        padding:20,
        borderRadius:20
    },
    textSend:
    {
        fontSize:20,
        fontWeight:"bold",
    }
})