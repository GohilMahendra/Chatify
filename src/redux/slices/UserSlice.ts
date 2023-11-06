import {createSlice,PayloadAction} from "@reduxjs/toolkit";
import { UserResult } from "../../types/UserTypes";
import { SendResetLink, SignUpUser, UpdateUser, fetchUserData, signInUser } from "../actions/UserActions";
export type UserType = 
{
    loading: boolean,
    error: string | null,
    user: UserResult,
    signUpLoading:boolean,
    signUpSuccess: boolean,
    signUpError: string | null,
    forgotLinkLoading:boolean,
    forgotLinkError: string | null,
    forgotLinkSuccess: boolean
}

const initialState: UserType= 
{
    loading: false,
    error: null,
    user:
    {
        bio:"",
        email:"",
        id:"",
        name:"",
        picture:"",
        user_name:""
    },
    signUpError: null,
    signUpLoading: false,
    signUpSuccess: false,
    forgotLinkError: null,
    forgotLinkLoading: false,
    forgotLinkSuccess: false
}

export const UserSlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
    },
    extraReducers(builder){
        builder.addCase(fetchUserData.pending,(state)=>{
            state.loading = true
            state.error = null
        })
        builder.addCase(fetchUserData.fulfilled,(state,action:PayloadAction<UserResult>)=>{
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(fetchUserData.rejected,(state,action)=>{
          state.loading = false
          state.error = action.payload as string
      })
      
        builder.addCase(signInUser.pending,(state)=>{
            state.loading = true
        })
        builder.addCase(signInUser.fulfilled,(state,action:PayloadAction<UserResult>)=>{
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(signInUser.rejected,(state,action)=>{
          state.loading = false
          state.error = action.payload as string
      })
        builder.addCase(UpdateUser.pending,(state)=>{
          state.loading = true
          state.error = null
          state.signUpSuccess = false
        })

        builder.addCase(UpdateUser.fulfilled,(state,action:PayloadAction<UserResult | undefined>)=>{
          state.loading = false,
          state.user = action.payload  || state.user
        })
        builder.addCase(SignUpUser.pending,(state)=>{
          state.signUpError = null
          state.signUpLoading = false
        })
        builder.addCase(SignUpUser.fulfilled,(state)=>{
          state.signUpSuccess = true
          state.signUpLoading = false
        })
        builder.addCase(SignUpUser.rejected,(state,action)=>{
          state.signUpLoading = false 
          state.signUpError = action.payload as string
        })
        builder.addCase(SendResetLink.pending,(state)=>{
          state.forgotLinkError = null 
          state.forgotLinkSuccess = false
          state.forgotLinkLoading = true
        })
        builder.addCase(SendResetLink.fulfilled,(state,action:PayloadAction<boolean>)=>{
          state.forgotLinkSuccess = action.payload
          state.forgotLinkLoading = false
        })
        builder.addCase(SendResetLink.rejected,(state,action)=>{
          state.forgotLinkError = action.payload as string
          state.forgotLinkLoading = true
        })
    }
})

export const selectCurrentUser  = (state:UserType) => state.user 
export const getUserLoading = (state:UserType) => state.loading
export const getUserError  = (state:UserType) => state.error
//export const { getUserFailed,getUserLoading,getUserSuccess} = UserSlice.actions
export default UserSlice.reducer