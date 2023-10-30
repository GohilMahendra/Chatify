import React from "react";
import { Text,View,TouchableOpacity,Image,StyleSheet} from "react-native";
import { useTheme } from "react-native-elements";
import UseTheme from "../../globals/UseTheme";
import { white } from "../../globals/Colors";
import { formatTimestamp } from "../../globals/utilities";
import { MessagePreview } from "../../types/MessageTypes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { chatStackParams } from "../../navigation/ChatStackNavigation";

type ChatCardProps=
{
    chat:MessagePreview,
}
const ChatCard=(props:ChatCardProps)=>
{
    const {theme}  = UseTheme()
    const {chat} = props
    const navigation = useNavigation<NavigationProp<chatStackParams,"ChatHome">>()
    return(
        <TouchableOpacity 
        onPress={()=>navigation.navigate("Chat",chat.User)}
        style={[styles.container,{
            backgroundColor: theme.background_color,
            borderBottomColor:theme.placeholder_color,
        }]}>
            <View style={styles.chatInnerContainer}>
                   <View style={{flexDirection:"row"}}>
                        <Image
                        source={{uri:chat.User.picture}}
                        style={styles.imgUser}
                        />
                    <View style={{
                        maxWidth:"70%"
                    }}>
                    <Text style={[styles.textUserName,{            
                        color: theme.text_color,
                    }]}>{chat.User.name}</Text>
                    <Text style={[styles.textLastMessage,{
                        color: theme.text_color,
                    }]}>{chat.lastMessage.text}</Text>
                    </View>
                </View>
                <View style={{
                    justifyContent:"space-between"
                }}>
                <Text style={{
                    fontSize:15,
                    color:theme.placeholder_color
                }}>{formatTimestamp(new Date(chat.lastMessage.timestamp).getTime())}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

}
export default ChatCard
const styles = StyleSheet.create({
    container:
    {
        marginTop:10,
        padding:10,
        justifyContent:"center",
        borderBottomWidth:1,
        borderRadius:15,
        shadowColor:white,
        shadowOffset:{
            height:4,
            width:2
        }
    },
    chatInnerContainer:
    {
        flexDirection:"row",
        justifyContent:"space-between"
    },
    imgUser:
    {
        height:40,
        width:40,
        borderRadius:40
    },
    textUserName:
    {
        fontSize:18,
        marginLeft:20,
        fontWeight:"bold"
    },
    textLastMessage:
    {
        fontSize:15,
        marginLeft:20,
        maxHeight:"60%"
    }

})