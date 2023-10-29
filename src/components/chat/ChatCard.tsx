import React from "react";
import { Text,View,TouchableOpacity,Image} from "react-native";
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
        style={{
            marginTop:10,
            padding:10,
            justifyContent:"center",
            backgroundColor: theme.background_color,
          //  elevation:5,
            borderBottomColor:theme.placeholder_color,
            borderBottomWidth:1,
            borderRadius:15,
            shadowColor:white,
            shadowOffset:{
                height:4,
                width:2
            }
        }}>
            <View style={{
                flexDirection:"row",
                justifyContent:"space-between"
            }}>
                   <View style={{flexDirection:"row"}}>
                        <Image
                        source={{uri:chat.User.picture}}
                        style={{
                            height:40,
                            width:40,
                            borderRadius:40
                        }}
                        />
                    <View style={{
                        maxWidth:"70%"
                    }}>
                    <Text style={{
                        fontSize:18,
                        color: theme.text_color,
                        marginLeft:20,
                        fontWeight:"bold"
                    }}>{chat.User.name}</Text>
                    <Text style={{
                        fontSize:15,
                        color: theme.text_color,
                        marginLeft:20,
                        maxHeight:"60%"
                    }}>{chat.lastMessage.text}</Text>
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