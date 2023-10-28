import React from "react";
import {Image,Dimensions} from 'react-native';

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
        style={{
           height:width * 0.6 - 10,
           width: width* 0.6 - 10,
           borderRadius:20,
           alignSelf:'center',
           marginVertical:10
        }}
        />
    )

}
export default ImageChat