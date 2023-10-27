import  React,{useState,useRef} from 'react';
import { View,Text,TouchableOpacity,Dimensions } from 'react-native';
import UseTheme from '../../globals/UseTheme';
const {height,width} = Dimensions.get("window")
import Video from 'react-native-video';
import { Slider } from 'react-native-elements';
type ThumbnailProps =
{
    videoUri: string,
    onClose:()=>void,
    onSelect:()=>void
}

const ThumbnailPicker = (props:ThumbnailProps) =>
{
    const {onClose,onSelect,videoUri} = props
    const [duration,setDuration] = useState(0)
    const [currentTime,setCurrentTime] = useState(0)
    const videoRef = useRef<Video | null>(null)
    const {theme} = UseTheme()
    

    const onProgress =(value:number)=>
    {
        setCurrentTime(value)
    }
    const onValueChange = (value:number) =>
    {
        videoRef.current?.seek(value)
        
    }
    const onLoad = (time:number) => {
        setDuration(time);
      };
    const onEnd= ()=>
    {
        videoRef.current?.seek(0)
    }
    return(
        <View style={{
            flex:1,
            backgroundColor: theme.background_color
        }}>
            <View
            style={{
                flexDirection:"row",
               // width: width * 90/100,
                alignSelf:"center",
                width: width,
                padding:10,
                justifyContent:'space-between'
            }}
            >
                <View/>
                <Text style={{
                    fontSize:20,
                    color: theme.text_color
                }}>Preview</Text>
                <Text 
                onPress={()=>onClose()}
                style={{
                    fontSize:20,
                    color: theme.text_color
                }}>X</Text>
            </View>
            <View style={{
               

            }}>
                <Video
                paused={false}
                onLoad={state=>onLoad(state.duration)}
                onEnd={()=>onEnd()}
                onProgress={state=>onProgress(state.currentTime)}
                ref={ref=>videoRef.current = ref}
                source={{uri:videoUri}}
                resizeMode='contain'
                style={{
                    width: width* 90/100,
                    alignSelf:"center",
                    height: height *80/100
                }}
                />
            </View>
            <Slider
            value={currentTime}
            maximumValue={duration}
            onSlidingComplete={(value)=>onValueChange(value)}
            thumbStyle={{
                height:20,
                width:20,
                backgroundColor: theme.primary_color
            }}
            style={{
                padding:20
            }}
            />
        </View>

    )

}
export default ThumbnailPicker