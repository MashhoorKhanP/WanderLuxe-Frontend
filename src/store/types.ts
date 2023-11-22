import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';


const rootReducer = combineReducers({
  user:userReducer,
  admin:adminReducer,
})

export type RootState = ReturnType<typeof rootReducer>;