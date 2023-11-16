import { configureStore } from "@reduxjs/toolkit";
import userReducer, { updateUser } from './slices/userSlice';
import { useEffect } from "react";

const store = configureStore({
  reducer:{
    user: userReducer,
  },
});

export default store;