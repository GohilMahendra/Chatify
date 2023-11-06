import {createSlice,PayloadAction,createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { UserStory } from "../../types/StoryTypes";
import { UploadStory, ViewStory, fetchStories } from "../actions/storyactions";
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