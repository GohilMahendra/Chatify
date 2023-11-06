import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Message, MessagePreview, UserMessageType } from "../../types/MessageTypes"
import { fetchChatUsers, fetchMoreChatUsers, sendUserChat } from "../actions/MessageActions";

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