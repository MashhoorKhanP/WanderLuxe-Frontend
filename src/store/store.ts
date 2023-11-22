import { configureStore, ThunkAction, Action, ThunkDispatch} from "@reduxjs/toolkit";
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';


const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = ThunkDispatch<RootState,unknown,Action<string>>;

export default store;
