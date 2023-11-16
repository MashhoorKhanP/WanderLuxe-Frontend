import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Alert {
  open: boolean;
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  token: string;
  isGoogle: boolean;
}

interface UserState{
  currentUser:User| null;//Want to update according to database
  openLogin:boolean;
  openOTPVerification:boolean;
  alert:Alert | null;
  loading:boolean;
}

const initialState: UserState = {
  currentUser:null,
  openLogin:false,
  openOTPVerification:false,
  alert:null,
  loading:false
};

const userSlice = createSlice({
  name:'user',
  initialState,
  reducers:{
    setCurrentUser:(state,action:PayloadAction<User>) =>{
      state.currentUser = action.payload;
    },
    updateUser:(state,action:PayloadAction<User>) =>{
      const updatedUser = action.payload;
      localStorage.setItem('currentUser',JSON.stringify(updatedUser));
      state.currentUser = {...updatedUser};
    },
    logoutUser:(state) =>{
      state.currentUser = null;
    },
    setOpenLogin: (state, action: PayloadAction<boolean>) => {
      state.openLogin = action.payload;
    },
    setCloseLogin:(state) => {
      state.openLogin = false;
    },
    setAlert:(state,action:PayloadAction<Alert>) => {
      state.alert = action.payload;
    },
    clearAlert:(state) => {
      state.alert = null;
    },
    startLoading:(state) => {
      state.loading = true;
    },
    stopLoading:(state) => {
      state.loading = false;
    },
    setOpenOTPVerification: (state, action: PayloadAction<boolean>) => {
      state.openOTPVerification = action.payload;
    },
    setCloseOTPVerification:(state) => {
      state.openOTPVerification = false;
    },
  },
})

export const {setCurrentUser,
  updateUser,logoutUser,
  setOpenLogin,setCloseLogin,setAlert,
  clearAlert,startLoading,stopLoading,
  setOpenOTPVerification,setCloseOTPVerification
} = userSlice.actions;
export default userSlice.reducer;