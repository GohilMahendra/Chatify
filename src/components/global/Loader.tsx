import React from 'react'
import { StyleSheet,ActivityIndicator,Dimensions, Modal} from "react-native";
import UseTheme from '../../globals/UseTheme';
import { white } from '../../globals/Colors';
const {height,width} = Dimensions.get("window")
const Loader = () =>
{
    const {theme} = UseTheme()
    return(
        <Modal
        testID='modal_loader'
        visible={true}
        transparent
        style={styles.container}
        >
            <ActivityIndicator
            color={white}
            size={'large'}
            style={[styles.loader,{
                backgroundColor:theme.primary_color,
            }]}
            />
        </Modal>
    )

}
export default Loader
const styles = StyleSheet.create({
    container:
    {
        height:height,
        width:width,
        backgroundColor:"transparent"
    },
    loader:
    {
        padding:10,
        position:"absolute",
        top: height/2 -20,
        alignSelf:"center",
        borderRadius:10,
    }
})