import  React,{useState,useRef,useEffect} from 'react';
import { View,Modal,Text,Image,Keyboard,SafeAreaView,FlatList,Dimensions, TextInput} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import UseTheme from '../../globals/UseTheme';
import { placeholder_image } from '../../globals/Data';
import { Message, UserMessageType } from '../../types/MessageTypes';
import { white } from '../../globals/Colors';
import { TouchableOpacity } from 'react-native';
import firestore from "@react-native-firebase/firestore";
import Auth from "@react-native-firebase/auth";
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { chatStackParams } from '../../navigation/ChatStackNavigation';
import { UserResult } from '../../types/UserTypes';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from "@react-native-firebase/storage";
import Feather from 'react-native-vector-icons/Feather'
import Video from "react-native-video";
import ThumbnailPicker from '../../components/chat/ThumbnailPicker';
import ImageChat from '../../components/chat/ImageChat';
import ChatComponent from '../../components/chat/ChatComponent';
import { sendUserChat } from '../../redux/slices/MessagesSlice';
import ChatLoader from '../../components/chat/ChatLoader';
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
    const navigation = useNavigation<NavigationProp<chatStackParams,"Chat">>()
    const user_id = route.params.id
    const [chats,setChats] = useState<Message[]>([])
    const [mediaModal,setMediaModal] = useState<boolean>(false)
    const [videoPreviev,setVideoPreview] = useState(false)
    const [currentFile,setCurrentFile] = useState<fileType | null>(null)
    const [thumbnailUri,setThumbnailUril] = useState<string | null>(null)
    const current_user = useSelector((state:RootState)=>state.user.user)
    const flatListRef = useRef<FlatList<Message> | null>(null)
    const [text,setText] = useState("")
    const sendChatLoading=useSelector((state:RootState)=>state.messages.sendUserChatLoading)
    const dispatch = useAppDispatch()

    //lazy loadin studff

    let stored_id: string | null = null
    const pageSize = 3

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
            setMediaModal(false)
            await createMessaage(user_id,file)
        }
    } 

    const openVideoPicker = async() =>
    {
        const response = await launchImageLibrary({
            mediaType:"video",
            presentationStyle:"overCurrentContext",
            selectionLimit:1
            })
    
            if(!response.didCancel && response.assets)
            {
                    const file:fileType = {
                        type: response.assets[0].type || "",
                        uri: response.assets[0].uri || ""
                    }
                    setCurrentFile(file)
                    setMediaModal(false)
                    setVideoPreview(true)                
            }
    }
    const renderMessage = ({item,index}:{item:Message,index:number}) =>
    {
       return(
        <ChatComponent
        message={item}
        />
       )
    }

    const createMessaage = async(user_id:string,file:fileType|null = null)=>
    {
       Keyboard.dismiss()
       const fullfilled = await dispatch(sendUserChat({
        file,
        user_id,
        thumbnailUri,
        text
       }))

       if(fullfilled.type.match(sendUserChat.fulfilled.type))
       setText("")
    }
    const subscribeToMessages = async() =>
    {
        try
        {
        const current_user_id = Auth().currentUser?.uid 
        const connectionRef = firestore()
         .collection("messages")
         .doc(current_user_id)
         .collection("groups")
         .doc(user_id)
         .collection("groupMessages")
         .orderBy("timestamp","desc")
 
 
         const snpaShotRef = connectionRef.limit(2)
     
         const UserChatSubscription =snpaShotRef.onSnapshot(async function(snap){
             const docs = snap.docChanges()
             const Messages:Message[] = []
             for(const doc of docs)
             {
                if(doc.type == "added")
                {
                 const id = doc.doc.id
                 const data = doc.doc.data() as UserMessageType
                 const message:Message = {
                     ...data,
                     user_image:route.params.picture,
                     id:id,
                     user_name:route.params.name,
                 }
 
                 if(message.fileUrl)
                 {
                  message.fileUrl = await storage().ref(message.fileUrl).getDownloadURL()
                 }
                 if(message.thumbnail)
                 {
                     message.thumbnail = await storage().ref(message.thumbnail).getDownloadURL()
                 }
                
                 Messages.push(message)
                }
                
             }
             setChats((prevChats)=>[...prevChats,...Messages])
         })

         return{
            UserChatSubscription
         }
        }
        catch(err)
        {
            console.log(err)
        }
    }


    const loadMessages = async() =>
    {
        const current_user_id = Auth().currentUser?.uid 
        const connectionRef = firestore()
         .collection("messages")
         .doc(current_user_id)
         .collection("groups")
         .doc(user_id)
         .collection("groupMessages")
         .orderBy("timestamp","desc")
         .limit(pageSize)

         const messageResponse = await connectionRef.get()
         const Messages:Message[] = []
         for(const doc of messageResponse.docs)
         {
           
             const id = doc.id
             const data = doc.data() as UserMessageType
             const message:Message = {
                 ...data,
                 user_image:route.params.picture,
                 id:id,
                 user_name:route.params.name,
             }

             if(message.fileUrl)
             {
              message.fileUrl = await storage().ref(message.fileUrl).getDownloadURL()
             }
             if(message.thumbnail)
             {
                 message.thumbnail = await storage().ref(message.thumbnail).getDownloadURL()
             }
            
             Messages.push(message)
        }

        const length = Messages.length
        if(length >= pageSize)
        {
            stored_id = Messages[Messages.length -1].id
        }
        setChats(Messages)
    }
    const loadMoreMessages = async() =>
    {
        console.log("load more messages")
        if(stored_id == null)
        {
            console.log(stored_id,"id stored are null")
            return
        }
        

        const current_user_id = Auth().currentUser?.uid 
        const connectionRef = firestore()
         .collection("messages")
         .doc(current_user_id)
         .collection("groups")
         .doc(user_id)
         .collection("groupMessages")
         .orderBy("timestamp","desc")
         .startAfter(stored_id)
         .limit(pageSize)

         const messageResponse = await connectionRef.get()
         const Messages:Message[] = []
         for(const doc of messageResponse.docs)
         {
           
             const id = doc.id
             const data = doc.data() as UserMessageType
             const message:Message = {
                 ...data,
                 user_image:route.params.picture,
                 id:id,
                 user_name:route.params.name,
             }

             if(message.fileUrl)
             {
              message.fileUrl = await storage().ref(message.fileUrl).getDownloadURL()
             }
             if(message.thumbnail)
             {
                 message.thumbnail = await storage().ref(message.thumbnail).getDownloadURL()
             }
            
             Messages.push(message)
        }

        const length = Messages.length
        if(length >= pageSize)
        {
            stored_id = Messages[Messages.length -1].id
        }
        console.log(Messages,"message us don sdhb")
        setChats((prevchats)=>[...prevchats,...Messages])

    }

    useEffect(()=>{
     // loadInitialMessages()
     //subscribeToMessages()
     loadMessages()
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
            onPress={()=>navigation.goBack()}
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
        onEndReached={()=>loadMoreMessages()}
        />
        {/* chat section ends */}
        {sendChatLoading && <ChatLoader/> }
        <View style={{
            flexDirection:"row",
            padding:10,
            justifyContent:"space-between"
        }}>
            <TextInput
            value={text}
            placeholder={"Type Something ..."}
            placeholderTextColor={theme.placeholder_color}
            onChangeText={(text:string)=>setText(text)}
            maxLength={200}
            style={{
                width: width * 60/100,
                backgroundColor:theme.seconarybackground_color,
                padding:10,
                fontSize:15,
                color: theme.text_color,
                borderRadius:10,
                elevation:5,
            }}
            />
             <TouchableOpacity 
           onPress={()=>setMediaModal(true)}
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
        <Modal
            animationType="slide"
            transparent={true}
            visible = {mediaModal}
            onRequestClose={()=>setMediaModal(false)}
            >
                <View style={{
                    flex:1,
                    justifyContent:'flex-end',
                    alignItems:"flex-end",
                    backgroundColor:"rgba(0,0,0,.7)"
                }}>
                    <View
                    style={{
                        backgroundColor:"Transparent",
                        width:"100%",
                        borderRadius:20,
                        padding:20,
                        
                    }}
                    >
                        <View style={{
                            backgroundColor:theme.seconarybackground_color,
                            padding:20,
                            borderRadius:20,
                        }}>
                       <View
                       style={{
                        width:50,
                        backgroundColor:theme.text_color,
                        height:5,
                        alignSelf:"center",
                        borderRadius:5
                       }}
                       />
                        <TouchableOpacity 
                        onPress={()=>openImagePicker()}
                        style={{
                            flexDirection:"row",
                            padding:10,
                            borderBottomColor:"grey",
                            borderBottomWidth:1,
                            borderRadius:10,
                            marginVertical:5
                        }}>
                            <Feather
                            name={"camera"}
                            size={30}
                            color={theme.text_color}
                            style={{
                                marginRight:20
                            }}
                            />
                            <Text style={{
                                fontSize:20,
                                color:theme.text_color
                            }}>Select photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                         onPress={()=>openVideoPicker()}
                        style={{
                            flexDirection:"row",
                            padding:10,
                            borderRadius:10
                
                        }}>
                            <Feather
                            name={"video"}
                            size={30}
                            color={theme.text_color}
                            style={{
                                marginRight:20
                            }}
                            />
                            <Text style={{
                                fontSize:20,
                                color:theme.text_color
                            }}>Select Video</Text>
                        </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                        onPress={()=>setMediaModal(false)}
                        style={{
                            marginVertical:10,
                            backgroundColor:theme.primary_color,
                            padding:20,
                            borderRadius:10,
                            justifyContent:"center",
                            alignItems:"center"
                        }}>
                            <Text style={{
                                fontSize:20,
                                color:theme.text_color
                            }}>Cancel</Text>
                        </TouchableOpacity>
                      
                    </View>

                </View>

        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible = {videoPreviev}
            onRequestClose={()=>setVideoPreview(false)}
            >
               {
                currentFile && 
                <ThumbnailPicker
                videoUri={currentFile.uri}
                onClose={()=>setVideoPreview(false)}
                onSelect={()=>createMessaage(user_id,currentFile)}
                onThubnail={(uri:string)=>setThumbnailUril(uri)}
                />
               }
        </Modal>
        </SafeAreaView>
    )
}
export default Chat
