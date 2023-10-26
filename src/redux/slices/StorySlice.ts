import {  } from "react-redux";
import {createSlice,PayloadAction,createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { create } from "react-test-renderer";
import { UserResult } from "../../types/UserTypes";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Auth,{ FirebaseAuthTypes } from "@react-native-firebase/auth";
import { RootState } from "../store";
import { Story, StoryUpload, StoryUser, UserStory } from "../../types/StoryTypes";
import { getMessage } from "@reduxjs/toolkit/dist/actionCreatorInvariantMiddleware";
export type StoryType = 
{
    loading: boolean,
    error: string | null,
    stories: UserStory[]
}

const initialState: StoryType= 
{
    loading: false,
    error: null,
    stories:[]

}

const getImageUrl = async(imageRef:string) =>
{
    const storageRef = storage().ref(imageRef)
    const imageUrl = await storageRef.getDownloadURL()
    return imageUrl
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
      mediaUrl:name,
      timestamp:firestore.Timestamp.now().toDate().toString(),
      mime:mime,
      caption:caption
    })
    }
    catch(err)
    {
     return rejectWithValue(err as string)
    }
   
  });

  export const fetchStories = createAsyncThunk('story/fetchStories', async (args:string,{rejectWithValue}) => {
    console.log("called ftech ")
    try
    {
        // console.log("ftech method called")
        const storiesRef = firestore().collection("stories")
        const storiesSnapshot = await storiesRef.get()
        const userStories:UserStory[] = []
        for(const doc of storiesSnapshot.docs)
        {
          
           const id = doc.id
           const data = doc.data() as Omit<StoryUser,"id">
        
           const picture = await getImageUrl(data.picture)
           data.picture = picture
           const storyUser = {id,...data} as StoryUser
           console.log(storyUser)
           const userStory:UserStory = {...storyUser,stories:[]}
           console.log(userStory)
           const userStoriesRef = firestore()
           .collection("stories")
           .doc(id)
           .collection("userStories")

           const listStoriesSnapshot =await userStoriesRef.get()
           for(const storyDoc of listStoriesSnapshot.docs)
           {
              const id = storyDoc.id
              const data = storyDoc.data()
              const picture = await getImageUrl(data.mediaUrl)
              data.mediaUrl = picture
              const story =  {id,...data} as Story
              console.log(story)
              userStory.stories.push(story)
           }
           userStories.push(userStory)
          }
         console.log(userStories,"userStries")
        return userStories
    }
    catch(err)
    {
      console.log(err)
      return rejectWithValue(err as string)
    }
  });
  
export const StorySlice = createSlice({
    name:"story",
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
       builder.addCase(UploadStory.rejected,(state,action)=>{
        state.loading = false
        state.error = action.payload as string
       })

       builder.addCase(fetchStories.pending,(state)=>{
        state.loading = true
        state.error = null
       })
       builder.addCase(fetchStories.fulfilled,(state,action:PayloadAction<UserStory[] | undefined>)=>{
        state.loading = false
        state.stories = action.payload ? action.payload : []
       })
       builder.addCase(fetchStories.rejected,(state,action)=>{
        state.loading = false
        state.error = action.payload as string
      })
       
    }
})

export default StorySlice.reducer