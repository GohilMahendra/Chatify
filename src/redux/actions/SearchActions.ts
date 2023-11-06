import { createAsyncThunk } from "@reduxjs/toolkit"
import firestore from "@react-native-firebase/firestore";
import Auth from "@react-native-firebase/auth";
import { UserResult } from "../../types/UserTypes";
import { getImageUrl } from "../../globals/utilities";

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
      const uniqueIds = new Set();
      const uniqueArray = users.filter((item) => {
        if (!uniqueIds.has(item.id)) {
          uniqueIds.add(item.id);
          return true;
        }
        return false;
      });
      
      return uniqueArray
    } 
    catch(err)
    {
      console.log(JSON.stringify(err))
      return rejectWithValue(JSON.stringify(err))
    }
  });
  