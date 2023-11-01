import React from "react";
import {Image,Dimensions,StyleSheet,View} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { white } from "../../globals/Colors";
const {height,width} = Dimensions.get("screen")
type ImageChatProps = 
{
    uri:string,
    type: string
}

const ImageChat = (props:ImageChatProps) =>
{
    const {uri,type} = props
    return(
        <View>
        <Image
        resizeMode="contain"
        source={{uri:uri}}
        style={styles.imgChatImage}
        />
        {type.includes("video") && 
        <FontAwesome5
        style={{
            position:"absolute",
            top:"45%",
            alignSelf:"center"
        }}
        name={"play"}
        size={25}
        color={white}
        />
        }
        </View>
    )

}
export default ImageChat
const styles = StyleSheet.create({
    imgChatImage:
    {
        height:width * 0.6 ,
        width: width* 0.6 - 10,
        borderRadius:20,
        alignSelf:'center',
        //marginVertical:10
     }
})