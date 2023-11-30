import {createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Auth from "@react-native-firebase/auth";
import { RootState } from "../store";
import { Story, StoryUser, UserStory } from "../../types/StoryTypes";
import { getImageUrl } from "../../globals/utilities";
import { docType } from "../../types/Firebase.types";
import { UserResult } from "../../types/UserTypes";

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
  const storyRef = firestore().collection('stories').doc(userId);
  const doc = await storyRef.get()

  if(doc.exists)
  {
    await storyRef.update({
      count: firestore.FieldValue.increment(1)
    })
  }
  else
  {
    await storyRef.set({
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
    console.log("Errr",JSON.stringify(err))
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
         const data = doc.data() as Pick<StoryUser,"count">
         const userSnap = await firestore().collection("users").doc(id).get()
         const userData = userSnap.data() as Omit<UserResult,"id">
         const userId = userSnap.id
         const user: UserResult = {id:userId,...userData} 
         const storyUser: StoryUser = 
         {
          id: user.id,
          count: data.count,
          isViewed: false,
          name: user.name,
          picture: user.picture? await getImageUrl(user.picture):"",
          user_name: user.user_name
         }
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
