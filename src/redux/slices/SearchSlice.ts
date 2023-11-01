import {  } from "react-redux";
import {createSlice,PayloadAction,createAsyncThunk,createAction } from "@reduxjs/toolkit";
import Auth from "@react-native-firebase/auth"
import { UserResult } from "../../types/UserTypes";
import firestore from "@react-native-firebase/firestore";
import { getImageUrl } from "../../globals/utilities";
export type SearchType = 
{
    loading: boolean,
    error: string | null,
    users: UserResult[]
}

const initialState: SearchType= 
{
    loading: false,
    error: null,
    users:[]
}

export const fetchUsers = createAsyncThunk('search/fetchUsers', async (searchString:string,{rejectWithValue}) => {
    try
    {
      
        // quary search over user name
        const current_user_id = Auth().currentUser?.uid
        const usersCollection = firestore().collection("users")
        const queryByUsername = usersCollection
        .where('user_name', '>=', searchString)
        .where('user_name', '<=', searchString + '\uf8ff')
        .get();
  
      //  quary search over full names string
      const queryByName = usersCollection
        .where('name', '>=', searchString)
        .where('name', '<=', searchString + '\uf8ff')
        .get();
  
      // using both parallary as no dependency
      const [queryByUsernameSnapshot, queryByNameSnapshot] = await Promise.all([
        queryByUsername,
        queryByName,
      ]);
  
      const users:UserResult[]= [];
  
      for (const doc of queryByUsernameSnapshot.docs) {
        const userData = doc.data() as Omit<UserResult, "id">;
        const imageUrl = await getImageUrl(userData.picture) ;
        users.push({
          ...userData,
          picture: imageUrl,
          id: doc.id,
        });
      }
      for (const doc of queryByNameSnapshot.docs) {
        const userData = doc.data() as Omit<UserResult, "id">;
        const imageUrl = await getImageUrl(userData.picture);
        users.push({
          ...userData,
          picture: imageUrl,
          id: doc.id,
        });
      }

    
  
      // Filter unique users (in case some users matched both queries)
      let uniqueUsers:UserResult[] = []
      const userlist = Array.from(new Set(users.map((user:UserResult) => user.id))).map((id) => {
        return users.find((user:UserResult) => user.id === id);
      }) 
      uniqueUsers = userlist ?? []
      return uniqueUsers
    } 
    catch(err)
    {
      console.log(JSON.stringify(err))
      return rejectWithValue(JSON.stringify(err))
    }
  });
  
export const SearchSlice = createSlice({
    name:"search",
    initialState:initialState,
    reducers:{
    },
    extraReducers(builder){
        builder.addCase(fetchUsers.pending,(state)=>{
            state.loading = true
            state.error = null

        })
        builder.addCase(fetchUsers.fulfilled,(state,action:PayloadAction<UserResult[]>)=>{
            state.loading = false
            console.log(action.payload,"payload from redux")
            state.users = action.payload
        })
     
        builder.addCase(fetchUsers.rejected,(state,action)=>{
            state.loading = true
            state.error = action.payload as string
        })
    }
})


export default SearchSlice.reducer