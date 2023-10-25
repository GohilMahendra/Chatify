import {  } from "react-redux";
import {createSlice,PayloadAction,createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { create } from "react-test-renderer";
import { UserResult } from "../../types/UserTypes";
import firestore from "@react-native-firebase/firestore";
import Auth,{ FirebaseAuthTypes } from "@react-native-firebase/auth";
export type UserType = 
{
    loading: boolean,
    error: string | null,
    user: UserResult
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
    }
}

const SignInAction = createAction("user/signInUser")

export const signInUser = createAsyncThunk(
    'user/signInUser',
    async ({email,password}:{email:string,password:string}, { rejectWithValue }) => {
      try {
        const signInResponse: FirebaseAuthTypes.UserCredential = await Auth().signInWithEmailAndPassword(email, password);
        const userId = signInResponse.user.uid;

        const doc = await firestore().collection("users").doc(userId).get()
        const id = doc.id
        const data = doc.data()
        const user = {id,...data} as UserResult
        return user;
      } catch (error) {
        // Handle the error and reject the promise with a payload
        return rejectWithValue('Sign-in failed: ' + error);
      }
    }
  );
  export const fetchUserData = createAsyncThunk('user/fetchUserData', async (userId: string,{rejectWithValue}) => {
    try
    {
      const userRef = firestore().collection('users').doc(userId);
      const doc = await userRef.get();
      const id = doc.id
      const data = doc.data()
      const user = {id,...data} as UserResult
      return user;
    } 
    catch(err)
    {
      console.log(err)
      return rejectWithValue(err)
    }
  });
  
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
      
        builder.addCase(signInUser.pending,(state)=>{
            state.loading = true
        })
        builder.addCase(signInUser.fulfilled,(state,action:PayloadAction<UserResult>)=>{
            state.loading = false
            state.user = action.payload
        })
       
    }
})

export const selectCurrentUser  = (state:UserType) => state.user 
export const getUserLoading = (state:UserType) => state.loading
export const getUserError  = (state:UserType) => state.error
//export const { getUserFailed,getUserLoading,getUserSuccess} = UserSlice.actions
export default UserSlice.reducer