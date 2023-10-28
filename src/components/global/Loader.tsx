import React from 'react'
import { SafeAreaView,ActivityIndicator,Dimensions, Modal} from "react-native";
import UseTheme from '../../globals/UseTheme';
import { white } from '../../globals/Colors';
const {height,width} = Dimensions.get("window")
const Loader = () =>
{
    const {theme} = UseTheme()
    return(
        <Modal
        visible={true}
        transparent
        style={{
            height:height,
            width:width,
            backgroundColor:"transparent"
        }}
        >
            <ActivityIndicator
            color={white}
            size={'large'}
            style={{
                padding:10,
                position:"absolute",
                top: height/2 -20,
                alignSelf:"center",
                borderRadius:10,
                backgroundColor:theme.primary_color,
            }}
            />
        </Modal>
    )

}
export default Loader