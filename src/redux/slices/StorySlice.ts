import {  } from "react-redux";
import {createSlice,PayloadAction,createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { create } from "react-test-renderer";
import { UserResult } from "../../types/UserTypes";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Auth,{ FirebaseAuthTypes } from "@react-native-firebase/auth";
import { RootState } from "../store";
export type StoryType = 
{
    loading: boolean,
    error: string | null
}

const initialState: StoryType= 
{
    loading: false,
    error: null,

}
  const UploadStoryMedia = async(path:string,name:string) =>
  {
        const storageRef = storage().ref(name)
        await storageRef.putFile(path)
        const mediaUrl = await storageRef.getDownloadURL()
        return mediaUrl
  }
  export const UploadStory = createAsyncThunk('story/UploadStory', async ({
    mediaUrl,
    mime,
    caption
  }:{mediaUrl:string,mime:string,caption:string},{getState,rejectWithValue}) => {

    try
    {
    const userId = Auth().currentUser?.uid
    const rootState = getState() as RootState
    const user = rootState.user.user
    const storyRef = firestore().collection('stories').doc(userId);
    const doc = await storyRef.get()

    if(doc.exists)
    {
      await storyRef.set({
        user_name: user.user_name,
        name: user.name,
        picture: user.picture,
        count: firestore.FieldValue.increment(1)
      })
    }
    else
    {
      await storyRef.set({
        user_name: user.user_name,
        name: user.name,
        picture: user.picture,
        count: 1
      })
    }
    const mediaType = mime.split("/")[1]
    const mediaName = Date.now().toString() + "." + mediaType
    const name = "stories/"+userId+"/"+mediaName
    const imageUrl = await UploadStoryMedia(mediaUrl,name)
    await storyRef.collection("userStories").add({
      mediaUrl:imageUrl,
      timestamp:firestore.FieldValue.serverTimestamp(),
      mime:mime,
      caption:caption
    })
    }
    catch(err)
    {
      rejectWithValue(err)
    }
   
  });
  
export const StorySlice = createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
    },
    extraReducers(builder){
       builder.addCase(UploadStory.pending,(state)=>{
        state.loading = true
        state.error = null
       })
       builder.addCase(UploadStory.fulfilled,(state,action)=>{
        state.loading = false
       })
       builder.addCase(UploadStory.rejected,(state,action:PayloadAction<string>)=>{
        state.loading = false
        state.error = action.payload
       })
       
    }
})

export default StorySlice.reducer