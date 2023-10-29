import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Message, MessagePreview } from "../../types/MessageTypes"
import Auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { getImageUrl } from "../../globals/utilities";
import { UserResult } from "../../types/UserTypes";
export type MessageStateType=
{
    chatUsersLoading:boolean,
    chatUsersErr:null|string,
    chatUsers:MessagePreview[],

    chatLoading: boolean,
    chatError: null | string,
    chats:Message[]

    searchResults:[],
    searchLoading: boolean,
    searchError: null | string
}
const initialState:MessageStateType= 
{
    chatUsersLoading: false,
    chatUsersErr:null,
    chatUsers:[],

    chatLoading:false,
    chatError:null,
    chats:[],

    searchLoading:false,
    searchResults:[],
    searchError:null
}


export const fetchChatUsers = createAsyncThunk("messages/fetchChatUsers",async({},{rejectWithValue,getState})=>{
   try
   {
    const current_user_id = Auth().currentUser?.uid
    const snapshotdocs:any =  (await firestore().collection("messages").doc(current_user_id).collection("groups").get()).docs
     let MessgaesArr:MessagePreview[] = []
     for(const doc of snapshotdocs)
     {

         const id = doc.id

         console.log(id)
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
         console.log(messagePreview)
         MessgaesArr.push(messagePreview)
     }
 
    return MessgaesArr
   }
   catch(err)
   {
        return rejectWithValue(JSON.stringify(err))
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
        builder.addCase(fetchChatUsers.fulfilled,(state,action:PayloadAction<MessagePreview[] | undefined>)=>{
            state.chatUsersLoading = false
            state.chatUsers = action.payload || []
        })
        builder.addCase(fetchChatUsers.rejected,(state,action)=>{
            state.chatUsersLoading = false
            state.chatUsersErr = action.payload as string
        })
    }
})

export default MessagesSlice.reducer