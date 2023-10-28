import { View,Text,Image,Dimensions } from 'react-native';
import { Message } from '../../types/MessageTypes';
import UseTheme from '../../globals/UseTheme';
const {height,width} = Dimensions.get("window")
import Auth from "@react-native-firebase/auth";
import ImageChat from './ImageChat';

type ChatProps =
{
    message: Message
}

const ChatComponent = (props:ChatProps) =>
{
        const item = props.message
        const current_user_id = Auth().currentUser?.uid
        const {theme} = UseTheme()
        return(
            item.user_id != current_user_id
            ?
            <View style={{
                margin:20,
                flexDirection:"row",
                alignItems:"center",
                maxWidth: width * .7
            }}>
                    <Image
                    source={{uri:item.user_image}}
                    style={{
                        height:30,
                        width:30,
                        borderRadius:30
                    }}
                    />
                    <View style={{
                        padding:10,
                        backgroundColor: theme.primary_color,
                        maxWidth: width * 0.6,
                        borderRadius:20
                    }}>
                        <Text style={{
                            color: theme.text_color
                        }}>{item.text}</Text>
                        {item.fileType?.includes("image") && item.fileUrl && 
                        <ImageChat
                        uri={item.fileUrl}
                        />
                        }
                        {item.fileType?.includes("video") && item.thumbnail && 
                        <ImageChat
                        uri={item.thumbnail}
                        />
                        }
                    </View>
            </View>
            :
            <View style={{
                padding:10,
                margin:10,
                backgroundColor: theme.primary_color,
                maxWidth: width * 0.6,
                borderRadius:20,
                alignSelf:"flex-end"
            }}>
               {item.text && <Text style={{
                    color: theme.text_color
                }}>{item.text}</Text> }
                {(item.fileUrl && item.thumbnail)?
                <Image
                //resizeMode='contain'
                source={{uri:item.thumbnail}}
                resizeMode='contain'
                style={{
                    height:width * 0.6 - 10,
                    width: width* 0.6 - 10,
                    borderRadius:20,
                    alignSelf:'center',
                    alignContent:"center",
                    justifyContent:"center",
                  //  marginVertical:10
                }}
                />
                :
                item.fileUrl && 
                <Image
                //resizeMode='contain'
                source={{uri:item.fileUrl}}
                resizeMode='contain'
                style={{
                    height:width * 0.6 - 10,
                    width: width* 0.6 - 10,
                    borderRadius:20,
                    alignSelf:'center',
                    alignContent:"center",
                    justifyContent:"center",
                  //  marginVertical:10
                }}
                />
                }
            </View>

        )
}
export default ChatComponent