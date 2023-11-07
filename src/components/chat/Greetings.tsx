import React from "react";
import { View,Text,Image,StyleSheet } from "react-native";
import UseTheme from "../../globals/UseTheme";
import { UserResult } from "../../types/UserTypes";
import { placeholder_image } from "../../globals/Data";
type GreetingProps=
{
    user:UserResult
}
const Greetings = (props:GreetingProps) =>
{
    const {theme} = UseTheme()
    const {user} = props
    return(
        <View style={styles.container}>
            <View>
                <Text style={[styles.textGreeting,{
                     color: theme.text_color,
                }]}>Good Morning</Text>
                <Text 
                testID="text_name"
                style={{
                    fontSize:20,
                    color: theme.text_color,
                }}>{user.name}</Text>
            </View>
                <Image
                source={user.picture?{uri:user.picture}:placeholder_image}
                style={styles.imgUser}
                />
           </View> 
    )

}
export default Greetings
const styles = StyleSheet.create({
    container:
    {
        flexDirection:"row",
        padding:20,
        paddingVertical:10,
        justifyContent:"space-between",
        alignItems:"center"
    },
    textGreeting:
    {
        fontSize:20,
        fontWeight:"bold"
    },
    imgUser:
    {
        height:50,
        width:50,
        borderRadius:50
    }
})