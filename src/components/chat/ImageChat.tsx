import React from "react";
import {Image,Dimensions,StyleSheet} from 'react-native';

const {height,width} = Dimensions.get("screen")
type ImageChatProps = 
{
    uri:string
}

const ImageChat = (props:ImageChatProps) =>
{
    const imageUri = props.uri
    return(
        <Image
        source={{uri:imageUri}}
        style={styles.imgChatImage}
        />
    )

}
export default ImageChat
const styles = StyleSheet.create({
    imgChatImage:
    {
        height:width * 0.6 - 10,
        width: width* 0.6 - 10,
        borderRadius:20,
        alignSelf:'center',
        marginVertical:10
     }
})