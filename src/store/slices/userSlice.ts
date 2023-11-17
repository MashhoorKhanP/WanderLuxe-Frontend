import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { RootState } from '../types';

interface Alert {
  open: boolean;
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

interface OTP{
  otp:number
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

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password?: string;
  // ... other properties
}

interface UserState{
  currentUser:User| null;//Want to update according to database
  openLogin:boolean;
  openOTPVerification:boolean;
  alert:Alert | null;
  loading:boolean;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  body?: object | string;
}

const initialState: UserState = {
  currentUser:null,
  openLogin:false,
  openOTPVerification:false,
  alert:null,
  loading:false
};

interface FetchDataOptions {
  url: string;
  method: string;
  token?: string;
  body?: object | null;
}

export const fetchData = async ({ url, method, token = '', body = null }: FetchDataOptions) => {
  console.log(`Entered FetchData`)
  const headers = token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };

  const axiosConfig: AxiosRequestConfig = {
    method,
    url,
    headers,
    data: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await axios(axiosConfig);
    const data = await response.data;
    console.log('API Response Data:', data);
    if (!data.success) {
      if (response.status === 401) {
        throw new Error(data.message);
      }
    }
    return data.result;
  } catch (error) {
    const typedError = error as AxiosError;
    console.error(typedError.message);
    return null;
  }
};

//Async thunk for user register instead fetchData.ts
export const registerUser = createAsyncThunk(
  'user/register',
  async(userData:RequestBody,{dispatch,getState}) =>{
    const state = getState() as RootState;
    const token = state.user.currentUser?.token || '';

    console.log(`Entered registerUser`,userData)

    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + '/api/user/signup',
      method: 'POST',
      token,
      body: userData,
    });
    // Han dle the result as needed
    return result;
    
  }
)

export const verifyUser = createAsyncThunk(
  'user/verifyUser',
  async(otp:OTP,{dispatch,getState}) => {
    try{
      const state = getState() as RootState;
      const token = state.user.currentUser?.token || '';

      const result = await fetchData({
        url:import.meta.env.VITE_SERVER_URL + '/api/user/verify-otp',
        method:'POST',
        token,
        body:{otp:otp.otp},
      });

      return result;

    }catch(error){
      console.error('Error verifying OTP:', error);
      throw error;
    }
    
  }
)



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
  extraReducers:(builder) => {
    builder.addCase(registerUser.pending,(state) => {
      // You can dispatch startLoading here if needed
      state.loading=true;
    });
    builder.addCase(registerUser.fulfilled,(state,action) =>{
      state.loading = false;
      state.alert = {open: true, severity: 'success', message: 'Verification OTP has been sent to your email address!' }
      state.openLogin = false;
      state.openOTPVerification= true;
      // state.currentUser = action.payload;
      // console.log('state.currentUser',state.currentUser); 
      /**I think this is used when login  i don't need set currentUser now its only
       after otp verification */
    });
    builder.addCase(registerUser.rejected,(state,action) =>{
      state.loading = false;
      if (action.error instanceof Error) {
        state.alert = { open: true, severity: 'error', message: action.error.message };
        console.error('Registration failed:', action.error);
      } else {
        // Handle non-Error rejection (if needed)
        console.error('Registration failed with non-Error rejection:', action.error);
      }
    });
    builder.addCase(verifyUser.pending,(state) =>{
      state.loading = true;
    });

    builder.addCase(verifyUser.fulfilled,(state,action) =>{
      state.loading = false;
      state.alert = { open: true, severity: 'success', message: 'OTP verification successful!'}
      state.alert = { open: true, severity: 'success', message: 'User registration successful!'}

      state.openOTPVerification=false;
    });

    builder.addCase(verifyUser.rejected,(state,action) =>{
      state.loading = false;
      if(action.error instanceof Error){
        state.alert = {open: true, severity: 'error', message: action.error.message}
        console.log('OTP Verification failed:', action.error);
      }else{
        console.error('OTP verification failed with non-Error rejection:', action.error)
      }
    })
  },
})

export const {setCurrentUser,
  updateUser,logoutUser,
  setOpenLogin,setCloseLogin,setAlert,
  clearAlert,startLoading,stopLoading,
  setOpenOTPVerification,setCloseOTPVerification
} = userSlice.actions;

export default userSlice.reducer;