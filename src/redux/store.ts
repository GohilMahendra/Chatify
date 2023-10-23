import { configureStore } from '@reduxjs/toolkit';
import UserReducer from "./slices/UserSlice";
import { useDispatch } from "react-redux";
const store = configureStore({
    reducer:
    {
        user:UserReducer,
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Exp
export default store