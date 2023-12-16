import {
  configureStore,
  ThunkAction,
  Action,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import roomReducer from './slices/roomSlice';
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web


const persistConfig = {
  key: "root",
  storage,
  // Add any reducer that you want to persist here
  whitelist: ["user","admin","hotel","room"],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedAdminReducer = persistReducer(persistConfig, adminReducer);
const persistedRoomReducer = persistReducer(persistConfig, roomReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer,
    room: persistedRoomReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action<string>>;

export default store;
