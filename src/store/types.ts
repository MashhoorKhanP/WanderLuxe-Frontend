import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlices/userSlice";
import roomReducer from "./slices/userSlices/roomSlice";
import couponReducer from "./slices/userSlices/couponSlice";

import adminReducer from "./slices/adminSlices/adminSlice";
import adminRoomReducer from "./slices/adminSlices/adminRoomSlice";
import adminHotelReducer from "./slices/adminSlices/adminHotelSlice";
import adminCouponReducer from "./slices/adminSlices/adminCouponSlice";

const rootReducer = combineReducers({
  user: userReducer,
  room: roomReducer,
  coupon: couponReducer,

  admin: adminReducer,
  adminRoom: adminRoomReducer,
  adminHotel: adminHotelReducer,
  adminCoupon: adminCouponReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
