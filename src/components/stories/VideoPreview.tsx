import { View,Dimensions} from "react-native";
import Video from "react-native-video";
import React,{useState} from 'react'
type PreviewType = 
{
    testID: string,
    uri: string
}
const {height,width} = Dimensions.get("window")
const VideoPreview = (props:PreviewType) =>
{
    const {uri} = props
    const [paused,setPaused] = useState<boolean>(false)
    return(
        <View
        style={{
            flex:0.95
        }}>
            <Video
            testID="video_preview"
            repeat
            source={{uri:uri}}
            resizeMode="contain"
            paused={paused}
            style={{
                flex:1,
               // height: height * 70/100,
                width: width * 90/100,
                alignSelf:"center",
            }}            
            />
        </View>
    )
}
export default VideoPreview