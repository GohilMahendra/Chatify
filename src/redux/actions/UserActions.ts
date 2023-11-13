import {createAsyncThunk } from "@reduxjs/toolkit";
import { User, UserResult } from "../../types/UserTypes";
import firestore from "@react-native-firebase/firestore";
import Auth,{ FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getImageUrl, uploadImage } from "../../globals/utilities";
import { RootState } from "../store";

export const signInUser = createAsyncThunk(
    'user/signInUser',
    async ({email,password}:{email:string,password:string}, { rejectWithValue }) => {
      try {
        const signInResponse: FirebaseAuthTypes.UserCredential = await Auth().signInWithEmailAndPassword(email, password);
        console.log(signInResponse,"response from backedn")
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
        console.log("Thease error cam",JSON.stringify(error))
        return rejectWithValue('Sign-in failed: ' + JSON.stringify(error));
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
   return updated_user

  }
  catch(err)
  {
    rejectWithValue(err)
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