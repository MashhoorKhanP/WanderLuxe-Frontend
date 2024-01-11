import {
  configureStore,
  ThunkAction,
  Action,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices/userSlice";
import roomReducer from "./slices/userSlices/roomSlice";
import couponReducer from "./slices/userSlices/couponSlice";
import adminReducer from "./slices/adminSlices/adminSlice";
import adminRoomReducer from "./slices/adminSlices/adminRoomSlice";
import adminHotelReducer from "./slices/adminSlices/adminHotelSlice";
import adminCouponReducer from "./slices/adminSlices/adminCouponSlice";
import thunk from "redux-thunk";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
  // Add any reducer that you want to persist here
  whitelist: [
    "user",
    "room",
    "coupon",
    "admin",
    "adminRoom",
    "adminHotel",
    "adminCoupon",
  ],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedRoomReducer = persistReducer(persistConfig, roomReducer);
const persistedCouponReducer = persistReducer(persistConfig, couponReducer);

const persistedAdminReducer = persistReducer(persistConfig, adminReducer);
const persistedAdminRoomReducer = persistReducer(
  persistConfig,
  adminRoomReducer
);
const persistedAdminHotelReducer = persistReducer(
  persistConfig,
  adminHotelReducer
);
const persistedAdminCouponReducer = persistReducer(
  persistConfig,
  adminCouponReducer
);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    room: persistedRoomReducer,
    coupon: persistedCouponReducer,

    admin: persistedAdminReducer,
    adminHotel: persistedAdminHotelReducer,
    adminRoom: persistedAdminRoomReducer,
    adminCoupon: persistedAdminCouponReducer,
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
