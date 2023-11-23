import {createSlice,PayloadAction } from "@reduxjs/toolkit";
import { UserResult } from "../../types/UserTypes";
import { fetchUsers } from "../actions/SearchActions";
export type SearchType = 
{
    loading: boolean,
    error: string | null,
    users: UserResult[]
}

export const initialState: SearchType= 
{
    loading: false,
    error: null,
    users:[]
}

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
            state.users = action.payload
        })
     
        builder.addCase(fetchUsers.rejected,(state,action)=>{
            state.loading = true
            state.error = action.payload as string
        })
    }
})


export default SearchSlice.reducer