import React from "react";
import {Dimensions,View,Image} from "react-native";
const { height,width } = Dimensions.get("window")
type ImagePropType =
{
    uri: string
}

const PreviewImage = (props:ImagePropType) =>
{
    const {uri} = props
    return(
        <View>
             <View style={{
                flexDirection:"row",
                justifyContent:"space-between",
                //marginHorizontal:10,
                padding:10
             }}>
                <View/>
                <View/>
             </View>
             <Image
                testID={"image_preview"}
                source={{uri:uri}}
                style={{
                    height: height *80/100,
                    width: width *90/100,
                    alignSelf:"center"
                }}
              />
        </View>  
    )

}
export default PreviewImage