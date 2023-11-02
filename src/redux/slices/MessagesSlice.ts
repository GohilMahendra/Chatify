import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Message, MessagePreview, UserMessageType } from "../../types/MessageTypes"
import Auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { getImageUrl } from "../../globals/utilities";
import { UserResult } from "../../types/UserTypes";
import { fileType } from "../../screens/chat/Chat";
import storage from "@react-native-firebase/storage";
import { MAX_USERCHAT_FETCH_LMIT } from "../../globals/Globals";
import { RootState } from "../store";

export type ChatUserPayloadType=
{
    messages: MessagePreview[],
    lastKey: string | null
}
export type MessageStateType=
{

    chatUsersLoading:boolean,
    chatUsersErr:null|string,
    chatUsers:MessagePreview[],
    chatMoreUsersLoading:boolean,
    chatMoreUsersErr:string | null,
    lastChatUserId: string | null,
    chatLoading: boolean,
    chatError: null | string,
    chats:Message[]

    sendUserChatLoading: boolean,
    snedUserChatSuccess: boolean,
    sendUserChatError: string  | null

    UserChatSubscription: (()=>void)| null
}

const initialState:MessageStateType= 
{
    chatUsersLoading: false,
    chatUsersErr:null,
    chatMoreUsersLoading:false,
    chatMoreUsersErr:null,
    chatUsers:[],
    lastChatUserId: null,

    chatLoading:false,
    chatError:null,
    chats:[],

    sendUserChatError: null,
    sendUserChatLoading: false,
    snedUserChatSuccess: false,
    UserChatSubscription: null
}


export const fetchChatUsers = createAsyncThunk("messages/fetchChatUsers",async(fakeArg:string,{rejectWithValue,getState})=>{
   try
   {
    const current_user_id = Auth().currentUser?.uid
    const snapshotResponse = await firestore()
    .collection("messages")
    .doc(current_user_id)
    .collection("groups")
    .limit(MAX_USERCHAT_FETCH_LMIT)
    .get()
    const snapshotdocs:any = snapshotResponse.docs
     let MessgaesArr:MessagePreview[] = []
     for(const doc of snapshotdocs)
     {
         const id = doc.id
         const userResponse = await firestore().collection("users").doc(id).get()
         
         const user_id = userResponse.id
         const user_data = userResponse.data() as Omit<UserResult,"id">
         user_data.picture =await getImageUrl(user_data.picture)?? ""
         const user = {id:user_id,...user_data} as UserResult

         const lastMessageResponse = await firestore()
         .collection("messages")
         .doc(current_user_id)
         .collection("groups")
         .doc(id)
         .collection("groupMessages")
         .orderBy("timestamp","desc")
         .limit(1)
         .get()
         const lastresponseid = lastMessageResponse.docs[0].id
         const lastresponseData = lastMessageResponse.docs[0].data() 
         const lastMessage = {id:lastresponseid,...lastresponseData} as Message
         console.log(lastMessage)
         const messagePreview:MessagePreview = 
         {
             id: id,
             lastMessage: lastMessage,
             no_of_unread:0,
             User: user
         }
         MessgaesArr.push(messagePreview)
     }
    let lastKey: string |  null = null
    if(MessgaesArr.length >= MAX_USERCHAT_FETCH_LMIT)
    {
        lastKey = MessgaesArr[MessgaesArr.length -1].id
    }
    const payload:ChatUserPayloadType = 
    {
        lastKey: lastKey,
        messages: MessgaesArr
    }
    return payload
   }
   catch(err)
   {
    console.log(JSON.stringify(err))
        return rejectWithValue(JSON.stringify(err))
   }
})

export const fetchMoreChatUsers = createAsyncThunk("messages/fetchMoreChatUsers",async(fakeArg:string,{rejectWithValue,getState})=>{
    try
    {
     const last_doc_id = (getState() as RootState).messages.lastChatUserId
     if(!last_doc_id)
     {
        console.log("more data not here sorry")
        return
     }
     const current_user_id = Auth().currentUser?.uid
     const snapshotResponse = await firestore()
     .collection("messages")
     .doc(current_user_id)
     .collection("groups")
     .startAfter(last_doc_id)
     .limit(MAX_USERCHAT_FETCH_LMIT)
     .get()
     const snapshotdocs:any = snapshotResponse.docs
     console.log(snapshotdocs,"docs response")
      let MessgaesArr:MessagePreview[] = []
      for(const doc of snapshotdocs)
      {
          const id = doc.id
          const userResponse = await firestore().collection("users").doc(id).get()
          
          const user_id = userResponse.id
          const user_data = userResponse.data() as Omit<UserResult,"id">
          user_data.picture =await getImageUrl(user_data.picture)?? ""
          const user = {id:user_id,...user_data} as UserResult
 
          const lastMessageResponse = await firestore().collection("messages").doc(current_user_id).collection("groups").doc(id).collection("groupMessages").limit(1).get()
          const lastresponseid = lastMessageResponse.docs[0].id
          const lastresponseData = lastMessageResponse.docs[0].data() 
          const lastMessage = {id:lastresponseid,...lastresponseData} as Message
          console.log(lastMessage)
          const messagePreview:MessagePreview = 
          {
              id: id,
              lastMessage: lastMessage,
              no_of_unread:0,
              User: user
          }
          MessgaesArr.push(messagePreview)
      }
      let lastKey: string |  null = null
      if(MessgaesArr.length >= MAX_USERCHAT_FETCH_LMIT)
      {
          lastKey = MessgaesArr[MessgaesArr.length -1].id
      }
      const payload:ChatUserPayloadType = 
      {
          lastKey: lastKey,
          messages: MessgaesArr
      }
      return payload
    }
    catch(err)
    {
     console.log(JSON.stringify(err))
         return rejectWithValue(JSON.stringify(err))
    }
 })

export const sendUserChat = createAsyncThunk("messages/sendUserChat",async({
    user_id,
    file,
    thumbnailUri,
    text
}:{
    user_id:string,
    file: fileType|null,
    thumbnailUri:string | null,
    text:string
},{rejectWithValue,getState})=>{
    try
    {
        const current_user_id = Auth().currentUser?.uid || ""
        let filePath:string | null = null
        let fileMime: string | null = null
        let thumbnailPath:string | null = null
        if(file != null)
        {
        const url = file.uri
        const type = file.type

        const fileName =  Date.now().toString() + "." + type.split("/")[1]
        const path = "messages/" + current_user_id + "/" + user_id + "/" + fileName 
        const Fiileref = storage().ref(path)
        await Fiileref.putFile(url)
        if(type.includes("video") && thumbnailUri)
        {
            const fileName =  Date.now().toString() + ".png"
            thumbnailPath = "messages/" + current_user_id + "/" + user_id + "/" + fileName 
            await storage().ref(thumbnailPath).putFile(thumbnailUri)
        }
        filePath = path
        fileMime = type
        }

        const Message:UserMessageType = 
        {
        fileType:(fileMime)?fileMime:null,
        fileUrl: (filePath)?filePath:null,
        isRead: false,
        text: text,
        thumbnail: thumbnailPath,
        user_id: current_user_id,
        timestamp: firestore.Timestamp.now().toDate().toISOString(),
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

        const currentConnection =  await firestore()
        .collection("messages")
        .doc(user_id)
        .collection("groups")
        .doc(current_user_id).get()

        const connectionExist:boolean = currentConnection.exists

        if(!connectionExist)
        {
        console.log("connection establissed")
        await firestore().collection("messages").doc(user_id).set({
            connected: true
        })
        await firestore().collection("messages").doc(current_user_id).set({
            conneected: true
        })
        await firestore()
        .collection("messages")
        .doc(user_id)
        .collection("groups")
        .doc(current_user_id).set({
            connected: true
        })
        await firestore()
        .collection("messages")
        .doc(current_user_id)
        .collection("groups")
        .doc(user_id).set({
            connected: true
        })
        }
        return true
    }
    catch(err)
    {
       return rejectWithValue(JSON.stringify(err) as string)
    }
})

export const MessagesSlice = createSlice({
    name:"Messages",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(fetchChatUsers.pending,(state)=>{
            state.chatUsersLoading = true
            state.chatUsers = []
        })
        builder.addCase(fetchChatUsers.fulfilled,(state,action:PayloadAction<ChatUserPayloadType>)=>{
            state.chatUsersLoading = false
            state.lastChatUserId = action.payload?.lastKey || null
            state.chatUsers = action.payload?.messages || []
        })
        builder.addCase(fetchChatUsers.rejected,(state,action)=>{
            state.chatUsersLoading = false
            state.chatUsersErr = action.payload as string
        })
        builder.addCase(fetchMoreChatUsers.pending,(state)=>{
            state.chatMoreUsersLoading = true
            state.chatMoreUsersErr = null
        })
        builder.addCase(fetchMoreChatUsers.fulfilled,(state,action:PayloadAction<ChatUserPayloadType | undefined>)=>{
            state.chatMoreUsersLoading = false
            state.lastChatUserId = action.payload?.lastKey || null
            state.chatUsers = [...state.chatUsers,...action.payload?.messages || []]
        })
        builder.addCase(fetchMoreChatUsers.rejected,(state,action)=>{
            state.chatMoreUsersLoading = false
            state.chatMoreUsersErr = action.payload as string
        })
        builder.addCase(sendUserChat.pending,(state)=>{
            state.sendUserChatLoading = true
            state.sendUserChatError = null
            state.snedUserChatSuccess = false
        })
        builder.addCase(sendUserChat.fulfilled,(state,action:PayloadAction<boolean>)=>{
            state.sendUserChatLoading = false
            state.snedUserChatSuccess = action.payload
        })
        builder.addCase(sendUserChat.rejected,(state,action)=>{
            state.sendUserChatLoading = false
            state.sendUserChatError = action.payload as string
        })
    }
})
export default MessagesSlice.reducer