import { configureStore } from '@reduxjs/toolkit';
import UserReducer from "./slices/UserSlice";
import { useDispatch } from "react-redux";
import StoryReducer from './slices/StorySlice';
import SearchReducer from './slices/SearchSlice';
const store = configureStore({
    reducer:
    {
        user:UserReducer,
        stories: StoryReducer,
        search: SearchReducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Exp
export default store