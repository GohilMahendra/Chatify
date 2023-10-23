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

  export const UploadStory = createAsyncThunk('story/UploadStory', async (userId: string) => {
    const userRef = firestore().collection('users').doc(userId);
    const doc = await userRef.get();
  
    if (doc.exists) {

      const id = doc.id
      const data = doc.data()
      const user = {id,...data} as UserResult
      return user;
    } else {
      throw new Error('User data not found');
    }
  });
  
export const StorySlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
    },
    extraReducers(builder){
       
       
    }
})

export default StorySlice.reducer