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
    readStoryLoading: boolean,
    readStoryError: string | null,
    readStorySuccess: boolean,
    error: string | null,
    stories: UserStory[]
}

const initialState: StoryType= 
{
    loading: false,
    error: null,
    stories:[],
    readStoryError:null,
    readStoryLoading: false,
    readStorySuccess: false

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
     return rejectWithValue(JSON.stringify(err) as string)
    }
   
  });

  export const fetchStories = createAsyncThunk('story/fetchStories', async (args:string,{rejectWithValue}) => {
    try
    {
        // console.log("ftech method called")
        const current_user_id = Auth().currentUser?.uid
        const storiesRef = firestore()
        .collection("stories")
        const storiesSnapshot = await storiesRef.get()
        const userStories:UserStory[] = []
        for(const doc of storiesSnapshot.docs)
        {
          
           const id = doc.id
           const data = doc.data() as Omit<StoryUser,"id">
        
          //  const picture = await getImageUrl(data.picture)
          //  data.picture = picture
           const storyUser = {id,...data} as StoryUser
           console.log(storyUser)
           const isStoryViewed =await firestore()
           .collection("stories")
           .doc(id)
           .collection("viewers")
           .doc(current_user_id)
           .get()

           const userStory:UserStory = {...storyUser,isViewed:isStoryViewed.exists,stories:[]}
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
      return rejectWithValue(JSON.stringify(err))
    }
  });
  
  export const ViewStory = createAsyncThunk("story/ViewStory",async({story_id}:{story_id:string},{rejectWithValue})=>{
    try
    {
      const current_user_id = Auth().currentUser?.uid
      const ReadStory =await firestore()
      .collection("stories")
      .doc(story_id)
      .collection("viewers")
      .doc(current_user_id)
      .set({}, { merge: true })
      return story_id
    }
    catch(err)
    {
      return rejectWithValue(JSON.stringify(err))
    }
  })
  
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
      builder.addCase(ViewStory.pending,(state)=>{
        state.readStoryLoading = false,
        state.readStorySuccess = false,
        state.readStoryError = null
      })
      builder.addCase(ViewStory.fulfilled,(state,action:PayloadAction<string>)=>{
        state.readStoryLoading = false,
        state.readStorySuccess = true
        const stories =  state.stories.map(userStory => {
          if (userStory.id === action.payload) {
            return { ...userStory, isViewed: true };
          } else {
            return userStory;
          }
        });
        state.stories = stories
      })
      builder.addCase(ViewStory.rejected,(state,action)=>{
        state.readStoryLoading = false,
        state.readStoryError = action.payload as string
      })
       
    }
})

export default StorySlice.reducer