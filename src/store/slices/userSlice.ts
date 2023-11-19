import {AnyAction, createAsyncThunk, createSlice, PayloadAction, ThunkAction} from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { RootState } from '../types';
import { AppThunk } from '../store';

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

interface LoginRequestBody{
  email:string;
  password:string;
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
    console.log('API Response:', response);

    const data = await response.data;

    console.log('API Response Data:', data);

     if (!response || response.status !== 200) {
      throw new Error('Request failed with status ' + response?.status);
    }

    if (!data || !data.success) {
      throw new Error(data?.message || 'Request failed with an unspecified error.');
    }
    console.log(data ,'and',data.result)
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
  async(otp:OTP,thunkAPI) => {
    try{
      const state = thunkAPI.getState() as RootState;
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

export const loginUser =createAsyncThunk(
  'user/loginUser',
  async(userData:LoginRequestBody,{dispatch,getState}) =>{
    let result;
    try{
        result = await fetchData({
        url: import.meta.env.VITE_SERVER_URL + '/api/user/login',
        method:'POST',
        body:userData,
      });
      console.log('Result before returning:', result);
      return result;
    }catch(error){
      console.error('Error logging in:',error);
      throw error;
    }
  }
  //Complete my login login give me full code
)

export const resendOTPSlice = createSlice({
  name:'resendOTP',
  initialState:{
    loading:false
  },
  reducers:{
    resendOTPPending:(state) =>{
      state.loading = true;
    },
    resendOTPFulfilled:(state) =>{
      state.loading = false;
    },
    resendOTPRejected:(state) =>{
      state.loading = false;
    },
  },
});

export const resendOTP = (email: string): AppThunk => async (dispatch, getState: () => RootState) => {
  try {
    dispatch(resendOTPPending());

    const state = getState();
    const token = state.user?.currentUser?.token || '';

    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + '/api/user/resend-otp',
      method: 'POST',
      token,
      body: { email },
    });

    dispatch(resendOTPFulfilled());
    dispatch(setAlert({ open: true, severity: 'success', message: 'New OTP has been sent to your email address!' }));

    return result;
  } catch (error) {
    dispatch(resendOTPRejected());
    dispatch(setAlert({ open: true, severity: 'error', message: 'Error resending OTP.' }));
    console.error('Error resending OTP:', error);
    throw error;
  }
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
      localStorage.removeItem('currentUser');
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

    //Register User
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
      /**I don't need set currentUser now its only
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

    //Verify User
    builder.addCase(verifyUser.pending,(state) =>{
      state.loading = true;
    });

    builder.addCase(verifyUser.fulfilled, (state, action) => {
      state.loading = false;
      state.alert = { open: true, severity: 'success', message: 'OTP verification successful!' };
      state.openOTPVerification = false;
      state.openLogin = true;
      state.alert = { open: true, severity: 'success', message: 'Registration successful, Now login to your account!' };
    
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

    //Login User
    builder.addCase(loginUser.pending,(state) =>{
      state.loading = true;
    });

    builder.addCase(loginUser.fulfilled,(state,action) =>{
      state.loading = false;
      const currentUser = action.payload.message;
      console.log('JSON.Stingify of current user',JSON.stringify(currentUser));
       // Store currentUser in localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      // Don't directly modify state.currentUser, create a new object
      state.currentUser = currentUser;

      state.alert = { open: true, severity: 'success', message: 'Login successful!' };
      console.log('reached here userSlice , next is to openLogin = false')
      state.openLogin = false;
    });
    builder.addCase(loginUser.rejected,(state,action) =>{
      state.loading = false;
      if(action.error instanceof Error){
        state.alert = { open: true, severity: 'error', message: action.error.message};
        console.error('Login failed:',action.error);
      }else{
        console.error('Login failed with non-Error rejection:', action.error);
      }
    });
  },
});

export const {setCurrentUser,
  updateUser,logoutUser,
  setOpenLogin,setCloseLogin,setAlert,
  clearAlert,startLoading,stopLoading,
  setOpenOTPVerification,setCloseOTPVerification
} = userSlice.actions;
export const {resendOTPPending,resendOTPFulfilled,resendOTPRejected} = resendOTPSlice.actions;
export default userSlice.reducer;