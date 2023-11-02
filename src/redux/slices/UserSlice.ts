import {createSlice,PayloadAction,createAsyncThunk,createAction } from "@reduxjs/toolkit";
import { User, UserResult } from "../../types/UserTypes";
import firestore from "@react-native-firebase/firestore";
import Auth,{ FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getImageUrl, uploadImage } from "../../globals/utilities";
import { RootState } from "../store";
import { Alert} from "react-native";
import storage from "@react-native-firebase/storage";
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

const SignInAction = createAction("user/signInUser")

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
    let updated_user = {...current_user}
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
        updated_user.picture =await getImageUrl(imagePath)
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
   updated_user.bio = bio
   updated_user.name = fullName

   console.log(current_user,"current use which is changed")
   return updated_user

  }
  catch(err)
  {
    rejectWithValue(err)
    console.log(err)
  }
})
export const SignUpUser = createAsyncThunk("user/SignUpUser",async({
  userEmail,
  userName,
  fullName,
  password
}:{
  userEmail:string,
  userName:string,
  fullName:string,
  password:string
},{rejectWithValue})=>{
      try
      {
      const userNameExist = await firestore()
      .collection("usernames")
      .where(firestore.FieldPath.documentId(),"==",userName)
      .get()

      if(!userNameExist.empty)
      {
        return rejectWithValue("username is already exist !!")
      }
      const signUp:FirebaseAuthTypes.UserCredential= await Auth().createUserWithEmailAndPassword(userEmail,password)
      const userId = signUp.user.uid

      const newUser = await firestore().collection("users").doc(userId).set
      ({
          name: fullName,
          email: userEmail,
          picture: "",
          user_name: userName,
          bio:""
      })
      const addIntoUserNames = await firestore()
      .collection("usernames")
      .doc(userName)
      .set({})

      return true
      }
      catch(err)
      {
          console.log(JSON.stringify(err))
          return rejectWithValue(JSON.stringify(err))
      }
})
export const SendResetLink = createAsyncThunk("user/SendResetLink",async({
  email
}:{email:string},{
  rejectWithValue
})=>{
    try
    {
      const resetPasswordLink = await Auth().sendPasswordResetEmail(email)
      return true
    }
    catch(err)
    {
      return rejectWithValue(JSON.stringify(err))
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

        builder.addCase(UpdateUser.fulfilled,(state,action:PayloadAction<UserResult | undefined>)=>{
          state.loading = false,
          state.user = action.payload  || state.user
        })
        builder.addCase(SignUpUser.pending,(state)=>{
          state.signUpError = null
          state.signUpLoading = false
          state.signUpSuccess = false
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