import  React,{useState,useRef,useEffect} from 'react';
import { View,Modal,Text,Image,Keyboard,StyleSheet,TouchableOpacity,SafeAreaView,FlatList,Dimensions, TextInput} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import UseTheme from '../../globals/UseTheme';
import { Message, UserMessageType } from '../../types/MessageTypes';
import { grey, white } from '../../globals/Colors';
import firestore from "@react-native-firebase/firestore";
import Auth from "@react-native-firebase/auth";
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { chatStackParams } from '../../navigation/ChatStackNavigation';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from "@react-native-firebase/storage";
import Feather from 'react-native-vector-icons/Feather'
import ThumbnailPicker from '../../components/chat/ThumbnailPicker';
import ChatComponent from '../../components/chat/ChatComponent';
import { sendUserChat } from '../../redux/actions/MessageActions';
import ChatLoader from '../../components/chat/ChatLoader';
import MediaViewer from '../../components/chat/MediaViewer';
import { placeholder_image } from '../../globals/Data';
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
    const [mediaViewer,setMediaViewer] = useState<fileType|null>(null)
    const flatListRef = useRef<FlatList<Message> | null>(null)
    const [text,setText] = useState("")
    const sendChatLoading=useSelector((state:RootState)=>state.messages.sendUserChatLoading)
    const dispatch = useAppDispatch()
    const  [lastTimeStamp,SetlastTimeStamp] = useState<string | null>(null)
    const pageSize = 10

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
        onMediaPress={(file:fileType)=>{
            setMediaViewer({
                type: file.type,
                uri: file.uri
            })
        }}
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
       {
        setText("")
        setThumbnailUril(null)
        setCurrentFile(null)
       }
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
         .limit(pageSize)

         const messageResponse = await connectionRef.get()

         if(messageResponse.empty)
         return

         const Messages:Message[] = []
         try
         {
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
        }
        catch(err)
        {
            console.log(JSON.stringify(err))
        }

        const length = Messages.length
        let currentLastTimeStamp: string | null = null
        if(length >= pageSize)
        {
            currentLastTimeStamp = Messages[Messages.length -1].timestamp
        }
        SetlastTimeStamp(currentLastTimeStamp)
        setChats(Messages.reverse())
        }
        catch(err)
        {
            console.log(JSON.stringify(err))
        }
    }
    const handleScroll = async(event:any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        const threshold = 10; 
        if (scrollY < threshold ) {
            await loadMoreMessages()
        }
      };
    const loadMoreMessages = async() =>
    {
        
        if(lastTimeStamp == null)
        {
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
         .startAfter(lastTimeStamp)
         .limit(pageSize)
         const messageResponse = await connectionRef.get()
         console.log(messageResponse)
         const Messages:Message[] = []
         try
         {
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
        let currentLastTimeStamp: string | null = null
        if(length >= pageSize)
        {
            currentLastTimeStamp = Messages[Messages.length -1].timestamp
        }
        SetlastTimeStamp(currentLastTimeStamp)
        setChats((prevchats)=>[...Messages.reverse(),...prevchats,])
        }
        catch(err)
        {
            console.log(JSON.stringify(err),"error in loading more")
        }
    }

    useEffect(()=>{
     loadMessages()
     subscribeToMessages()
    },[])
    // useEffect(()=>{
    //     if(lastId != null)
    //     {
    //         loadMoreMessages()
    //     }
    // },[lastId])
    return(

        <SafeAreaView style={{
            flex:1,
            backgroundColor:theme.background_color
        }}>
        {/* navigation header starts */}
        <View style={[styles.header,{
            borderBottomColor:theme.text_color,
        }]}>
            <FontAwesome5
            onPress={()=>navigation.goBack()}
            name='chevron-left'
            size={20}
            color={theme.text_color}
            />
            <View style={styles.imageContaier}>
                <Image
                source={route.params.picture?{uri:route.params.picture}:placeholder_image}
                style={styles.imgUser}
                />
                <Text style={[styles.textUserName,{
                    color: theme.text_color,
                }]}>
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
        onScroll={handleScroll}
        />
        {/* chat section ends */}
        {sendChatLoading && <ChatLoader/> }
        <View style={styles.inputContainer}>
            <TextInput
            value={text}
            multiline={true}
            placeholder={"Type Something ..."}
            placeholderTextColor={theme.placeholder_color}
            onChangeText={(text:string)=>setText(text)}
            maxLength={200}
            style={[styles.inputText,{
                backgroundColor:theme.seconarybackground_color,
                color: theme.text_color
            }]}
            />
             <TouchableOpacity 
             onPress={()=>setMediaModal(true)}
             style={[styles.btnMedia,{
                backgroundColor: grey,
             }]}>
                 <FontAwesome5
                    name='camera'
                    size={30}
                    color={white}
                />
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>createMessaage(user_id)}
            style={[styles.btnSend,{
                backgroundColor: theme.primary_color,
            }]}>
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
                <View style={styles.modaMediaContainer}>
                    <View style={styles.modalMediaInnerContainer}>
                        <View style={[styles.modalRowContaineer,{
                             backgroundColor:theme.seconarybackground_color,
                        }]}>
                       <View
                       style={[styles.modalImagePickerContainer,{
                        backgroundColor:theme.text_color,
                       }]}
                       />
                        <TouchableOpacity 
                        onPress={()=>openImagePicker()}
                        style={styles.btnImagePicker}>
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
                        style={styles.btnVideoContainer}>
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
                        style={[styles.btnCancelPicker,{    
                        backgroundColor:theme.primary_color,
                        }]}>
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
        <Modal
        animationType="fade"
        transparent={false}
        visible = {mediaViewer!=null}
        onRequestClose={()=>setMediaViewer(null)}
        >
           { mediaViewer &&
           <MediaViewer
            onClose={()=>setMediaViewer(null)}
            type={mediaViewer.type}
            uri={mediaViewer.uri}
            />
           }
        </Modal>
        </SafeAreaView>
    )
}
export default Chat
const styles = StyleSheet.create({
    header:
    {
        flexDirection:"row",
      //  justifyContent:"space-between",
        paddingHorizontal:20,
        alignItems:"center",
        paddingVertical:10,
        borderBottomWidth:1
    },
    imageContaier:
    {
        flexDirection:"row",
        marginLeft:20
    },
    imgUser:
    {
        height:40,
        width:40,
        borderRadius:40
    },
    textUserName:
    {
        fontSize:20,
        fontWeight:"bold",
        alignSelf:"center",
        marginLeft:10
    },
    inputContainer:
    {
        flexDirection:"row",
        padding:10,
        alignItems:"center",
        justifyContent:"space-between"
    },
    inputText:
    {
        width: width * 60/100,
        padding:10,
        fontSize:15,
        borderRadius:10,
        elevation:5,
    },
    btnMedia:
    {
        height:50,
        width:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:20
    },
    btnSend:
    {
        height:50,
        width:50,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:20
    },
    modaMediaContainer:
    {
        flex:1,
        justifyContent:'flex-end',
        alignItems:"flex-end",
        backgroundColor:"rgba(0,0,0,.7)"
    },
    modalMediaInnerContainer:
    {
        backgroundColor:"Transparent",
        width:"100%",
        borderRadius:20,
        padding:20  
    },
    modalRowContaineer:
    {
        padding:20,
        borderRadius:20,
    },
    modalImagePickerContainer:
    {
        width:50,
        height:5,
        alignSelf:"center",
        borderRadius:5
    },
    btnImagePicker:
    {
        flexDirection:"row",
        padding:10,
        borderBottomColor:"grey",
        borderBottomWidth:1,
        borderRadius:10,
        marginVertical:5
    },
    btnVideoContainer:
    {
        flexDirection:"row",
        padding:10,
        borderRadius:10
    },
    btnCancelPicker:
    {
        marginVertical:10,
        padding:20,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center"
    }


})
