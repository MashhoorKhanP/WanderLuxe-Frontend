import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import roomReducer from './slices/roomSlice';

const rootReducer = combineReducers({
  user: userReducer,
  admin: adminReducer,
  room:roomReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
