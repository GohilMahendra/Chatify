import {  } from "react-redux";
import {createSlice,PayloadAction,createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { create } from "react-test-renderer";
import { User, UserResult } from "../../types/UserTypes";
import firestore from "@react-native-firebase/firestore";
import Auth,{ FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getImageUrl } from "../../globals/utilities";
import { RootState } from "../store";
import storage from "@react-native-firebase/storage";
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

const uploadImage = async(uri:string , path:string)=>
{
    try
    {
    const ref = storage().ref(path)
    await ref.putFile(uri)
    }
    catch(err)
    {
        console.log(err)
    }
}
export const signInUser = createAsyncThunk(
    'user/signInUser',
    async ({email,password}:{email:string,password:string}, { rejectWithValue }) => {
      try {
        const signInResponse: FirebaseAuthTypes.UserCredential = await Auth().signInWithEmailAndPassword(email, password);
        const userId = signInResponse.user.uid;

        const doc = await firestore().collection("users").doc(userId).get()
        const id = doc.id
        const data = doc.data() as Omit<UserResult,"id">
        if(data.picture)
        {
          data.picture = await getImageUrl(data.picture)
        }
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
    const data = doc.data() as Omit<UserResult,"id">
    if(data.picture)
    {
      data.picture = await getImageUrl(data.picture)
    }
    const user = {id,...data} as UserResult
    return user;
  } 
  catch(err)
  {
    console.log(err)
    return rejectWithValue(err)
  }
});
export const UpdateUser = createAsyncThunk('user/UpdateUser',async({
  fullName,
  profilePicture,
  bio
}:{
  fullName:string,
  profilePicture:string,
  bio:string
},{rejectWithValue,getState})=>{

  try
  {
    const state = getState() as RootState
    const current_user = state.user.user
    const userId = Auth().currentUser?.uid
    const imageChanged:boolean = profilePicture != current_user.picture
    let imagePath = ""
    if(imageChanged)
    {
        const mimes = profilePicture.split(".")
        const mimeType = mimes[mimes.length - 1]
        const fileName = userId + "." + mimeType
        imagePath =  "ProfileImages/"+userId+"/"+fileName
        await uploadImage(profilePicture,imagePath)
        current_user.picture =await getImageUrl(imagePath)
    }

    const userData: Partial<User> = 
    {
        bio:bio,
        name: fullName,
        ...(imageChanged ? { picture: imagePath } : {})
    }

    const user =  Auth().currentUser
    await user?.updateProfile({
        displayName: fullName,
        ...(imageChanged ? { photoURL: imagePath } : {})
    })
    const docRef =  firestore().collection("users").doc(userId)
   const updateResponse = await docRef.update(userData)
   current_user.bio = bio
   current_user.name = fullName
   return current_user

  }
  catch(err)
  {
    rejectWithValue(err)
    console.log(err)
  }
})
  
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

        builder.addCase(UpdateUser.pending,(state)=>{
          state.loading = true
          state.error = null
        })

        builder.addCase(UpdateUser.fulfilled,(state,action:PayloadAction<UserResult>)=>{
          state.loading = false,
          state.user = action.payload
        })
       
    }
})

export const selectCurrentUser  = (state:UserType) => state.user 
export const getUserLoading = (state:UserType) => state.loading
export const getUserError  = (state:UserType) => state.error
//export const { getUserFailed,getUserLoading,getUserSuccess} = UserSlice.actions
export default UserSlice.reducer