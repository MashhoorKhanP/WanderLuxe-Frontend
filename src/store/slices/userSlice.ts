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
  alert:Alert | null;
  loading:boolean;
}

const initialState: UserState = {
  currentUser:null,
  openLogin:false,
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
      state.currentUser = action.payload;
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
    }
  },
})

export const {setCurrentUser,updateUser,logoutUser,setOpenLogin,setCloseLogin,setAlert,clearAlert,startLoading,stopLoading} = userSlice.actions;
export default userSlice.reducer;