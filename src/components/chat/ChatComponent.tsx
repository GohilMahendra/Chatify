import React,{ useState } from "react";
import { View,Text,Image,Dimensions,
    StyleSheet,TouchableOpacity,Modal} from 'react-native';
import { Message} from '../../types/MessageTypes';
import UseTheme from '../../globals/UseTheme';
const {height,width} = Dimensions.get("window")
import Auth from "@react-native-firebase/auth";
import ImageChat from './ImageChat';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { white } from '../../globals/Colors';
import { fileType } from "../../screens/chat/Chat";
type ChatProps =
{
    message: Message,
    onMediaPress:(file:fileType)=>void
}

const ChatComponent = (props:ChatProps) =>
{
        const item = props.message
        const {onMediaPress} = props
        const current_user_id = Auth().currentUser?.uid
        const {theme} = UseTheme()
        return(
            <View>
            <View>
            {
                item.user_id != current_user_id
                ?
                <View style={styles.senderContainer}>
                        <Image
                        source={{uri:item.user_image}}
                        style={styles.imgSenderImage}
                        />
                        <View style={[styles.chatContainer,{
                            backgroundColor: theme.primary_color,
                        }]}>
                            { item.text && <Text 
                            testID={"text_senderMessage"}
                            style={{
                                color: theme.text_color
                            }}>{item.text}</Text>
                            }
                            {item.fileType?.includes("image") && item.fileUrl && 
                            <TouchableOpacity
                            testID={"btn_senderMediaPress"}
                            onPress={()=>onMediaPress({
                                type: item.fileType || "",
                                uri: item.fileUrl || ""
                            })}
                            >
                            <ImageChat
                            uri={item.fileUrl}
                            type={item.fileType}
                            />
                            </TouchableOpacity>
                            }
                            {item.fileType?.includes("video") && item.thumbnail && 
                            <TouchableOpacity
                            testID={"btn_senderMediaVideo"}
                            onPress={()=>onMediaPress({
                                type: item.fileType || "",
                                uri: item.fileUrl || ""
                            })}
                            >
                            <ImageChat
                            uri={item.thumbnail}
                            type={item.fileType}
                            />
                            </TouchableOpacity>
                            
                            }
                        </View>
                </View>
                :
                <View style={[styles.userContainer,{    
                backgroundColor: theme.primary_color,
                }]}>
                {item.text && <Text 
                testID="text_messageText"
                style={{
                        color: white
                    }}>{item.text}</Text> }
                    {(item.fileUrl && item.thumbnail && item.fileType)?
                    <TouchableOpacity
                    testID={"btn_videoMedia"}
                    onPress={()=>onMediaPress({
                        type: item.fileType || "",
                        uri: item.fileUrl || ""
                    })}
                    >
                        <ImageChat
                            uri={item.thumbnail}
                            type={item.fileType}
                        />
                    </TouchableOpacity>
                    :
                    (item.fileUrl && item.fileType) && 
                    <TouchableOpacity
                    testID={"btn_imageMedia"}
                    onPress={()=>onMediaPress({
                        type: item.fileType || "",
                        uri: item.fileUrl || ""
                    })}
                    >
                    <ImageChat
                    uri={item.fileUrl}
                    type={item.fileType}
                    />
                    </TouchableOpacity>
                    }
                </View>
            }
            </View>
            </View>

        )
}
export default ChatComponent
const styles = StyleSheet.create({
    senderContainer:
    {
        margin:20,
        flexDirection:"row",
        alignItems:"center",
        maxWidth: width * .7
    },
    imgSenderImage:
    {
        height:30,
        width:30,
        borderRadius:30
    },
    chatContainer:
    {
        padding:10,
        maxWidth: width * 0.6,
        borderRadius:20,
        marginLeft:10
    },
    userContainer:
    {
        padding:10,
        margin:10,
        maxWidth: width * 0.6,
        borderRadius:20,
        alignSelf:"flex-end"
    },



})