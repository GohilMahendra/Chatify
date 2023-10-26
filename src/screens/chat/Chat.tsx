import  React,{useState,useRef,useEffect} from 'react';
import { View,Text,Image,SafeAreaView,FlatList,Dimensions, TextInput} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import UseTheme from '../../globals/UseTheme';
import { placeholder_image } from '../../globals/Data';
import { Message, UserMessageType } from '../../types/MessageTypes';
import { white } from '../../globals/Colors';
import { TouchableOpacity } from 'react-native';
import firestore from "@react-native-firebase/firestore";
import Auth from "@react-native-firebase/auth";
import { RouteProp, useRoute } from '@react-navigation/native';
import { chatStackParams } from '../../navigation/ChatStackNavigation';
import { UserResult } from '../../types/UserTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from "@react-native-firebase/storage";
const {height,width} = Dimensions.get("window")
export type fileType =
{
    uri: string,
    type:string
}
const Chat  = () =>
{
    const {theme} = UseTheme()
    const current_user_id = Auth().currentUser?.uid
    const route = useRoute<RouteProp<chatStackParams,"Chat">>()
    const user_id = route.params.id
    const [chats,setChats] = useState<Message[]>([])
    const current_user = useSelector((state:RootState)=>state.user.user)
    const flatListRef = useRef<FlatList<Message> | null>(null)
    const [text,setText] = useState("")

    const openImagePicker=async()=>
    {
    
        const response = await launchImageLibrary({
        mediaType:"photo",
        presentationStyle:"popover",
        selectionLimit:1
        })

        if(!response.didCancel && response.assets)
        {
                const file:fileType = {
                    type: response.assets[0].type || "",
                    uri: response.assets[0].uri || ""
                }
            await createMessaage(user_id,file)
        }
    } 
    const renderMessage = ({item,index}:{item:Message,index:number}) =>
    {
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
                        <Image
                        source={{uri:item.fileUrl}}
                        style={{
                           height:width * 0.6 - 10,
                           width: width* 0.6 - 10,
                           borderRadius:20,
                           alignSelf:'center',
                           marginVertical:10
                        }}
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
                {item.fileUrl && 
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

    const createMessaage = async(user_id:string,file:fileType|null = null)=>
    {
       const current_user_id = current_user.id

       let filePath:string | null = null
       let fileMime: string | null = null
       if(file != null)
       {
        const url = file.uri
        const type = file.type
        const fileName =  Date.now().toString() + "." + type.split("/")[1]
        const path = "messages/" + current_user_id + "/" + user_id + "/" + fileName 
        const Fiileref = storage().ref(path)
        await Fiileref.putFile(url)
        filePath = path
        fileMime = type
       }

       const Message:UserMessageType = 
       {
        fileType:(fileMime)?fileMime:null,
        fileUrl: (filePath)?filePath:null,
        isRead: false,
        text: text,
        thumbnail: null,
        user_id: current_user_id
       }

       const ref =  firestore()
       .collection("messages")
       .doc(current_user_id)
       .collection("groups")
       .doc(user_id)
       .collection("groupMessages")

       const senderRef = firestore()
       .collection("messages")
       .doc(user_id)
       .collection("groups")
       .doc(current_user_id)
       .collection("groupMessages")
       const addMessage = await ref.add(Message)
       const addMessageToSender = await senderRef.add(Message)

    }

    const subscribeToMessages = async() =>
    {
        const current_user_id = Auth().currentUser?.uid 

       const connectionRef = firestore()
        .collection("messages")
        .doc(current_user_id)
        .collection("groups")
        .doc(user_id)
        .collection("groupMessages")


        connectionRef.onSnapshot(async function(snap){
            const docs = snap.docs
            const senderUser = await firestore().collection("users").doc(user_id).get()
            const id = senderUser.id
            const userData = {id,...senderUser.data()} as UserResult
            const Messages:Message[] = []
            for(const doc of docs)
            {
                const id = doc.id
                const data = doc.data() as UserMessageType
                console.log(data.user_id == current_user_id)
                const message:Message = {
                    ...data,
                    user_image: route.params.picture,
                    id:id,
                    user_name:route.params.name,
                }

                if(message.fileUrl)
                {
                    message.fileUrl = await storage().ref(message.fileUrl).getDownloadURL()
                }
               
                Messages.push(message)
            }
            setChats(Messages)
        })
    }

    useEffect(()=>{
      subscribeToMessages()
    },[])
    return(
        <SafeAreaView style={{
            flex:1,
            backgroundColor:theme.background_color
        }}>
        {/* navigation header starts */}
        <View style={{
            flexDirection:"row",
          //  justifyContent:"space-between",
            paddingHorizontal:20,
            alignItems:"center",
            paddingVertical:10,
            borderBottomColor:theme.text_color,
            borderBottomWidth:1
        }}>
            <FontAwesome5
            name='chevron-left'
            size={25}
            color={theme.text_color}
            />
            <View style={{
                flexDirection:"row",
                marginLeft:20
            }}>
                <Image
                source={{uri:route.params.picture}}
                style={{
                    height:40,
                    width:40,
                    borderRadius:40
                }}
                />
                <Text style={{
                    color: theme.text_color,
                    fontSize:20,
                    fontWeight:"bold",
                    alignSelf:"center",
                    marginLeft:10
                }}>
                   {route.params.name}
                </Text>
            </View>

        </View>
        {/* navigation header ends */}
        {/* chat section starts */}
        <FlatList
        onContentSizeChange={()=>flatListRef.current?.scrollToEnd()}
        ref={ref=>{flatListRef.current = ref}}
        data={chats}
        renderItem={({item,index})=>renderMessage({item,index})}
        keyExtractor={(item)=>item.id}
        />
        {/* chat section ends */}
        <View style={{
            flexDirection:"row",
            padding:10,
            justifyContent:"space-between"
        }}>
            <TextInput
            value={text}
            placeholder={"Message ..."}
            placeholderTextColor={theme.placeholder_color}
            onChangeText={(text:string)=>setText(text)}
            style={{
                width: width * 60/100,
                backgroundColor:theme.seconarybackground_color,
                padding:10,
                fontSize:18,
                color: theme.text_color,
                borderRadius:10,
                elevation:5,
            }}
            />
             <TouchableOpacity 
           onPress={()=>openImagePicker()}
            style={{
                backgroundColor: theme.seconarybackground_color,
                padding:10,
                borderRadius:20
            }}>
                 <FontAwesome5
                    name='camera'
                    size={30}
                    color={white}
                />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>createMessaage(user_id)}
            style={{
                backgroundColor: theme.primary_color,
                padding:10,
                borderRadius:20
            }}>
                 <FontAwesome5
                    name='location-arrow'
                    size={30}
                    color={white}
                />
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    )
}
export default Chat