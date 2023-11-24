import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/types";
import fetchData from "./utils/fetchData";
import { AxiosError } from "axios";
import errorHandle from "../components/hooks/errorHandler";
import { AppThunk } from "../store/store";
import { resendOTPFulfilled, resendOTPPending, resendOTPRejected, setAlert } from "../store/slices/userSlice";
import uploadFile from "../firebase/upload";
import { v4 as uuidv4 } from 'uuid';

interface RequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password?: string;
  // ... other properties
}

interface GoogleRequestBody {
  
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  password:string;
  isGoogle: boolean;
  isVerified: boolean;
}

interface OTP{
  otp:number
}

interface LoginRequestBody{
  email:string;
  password:string;
}

interface UpdateProfilePayload {
  currentUser: object | any;
  updatedFields?: {
    firstName?:string;
    lastName?:string;
    email?:string;
    mobile?:string;
    file?: string | File | any;
  };
}




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
    // Handle the result as needed
    return result;
    
  }
)

export const googleregister = createAsyncThunk(
  'user/googleRegister',
  async(userData:GoogleRequestBody,{dispatch,getState}) =>{
    const state = getState() as RootState;
    const token = state.user.currentUser?.token || '';

    console.log(`Entered registerUser`,userData)

    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + '/api/user/google-signup',
      method: 'POST',
      token,
      body: userData,
    });
    // Handle the result as needed
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
    
    try{
        const result = await fetchData({
        url: import.meta.env.VITE_SERVER_URL + '/api/user/login',
        method:'POST',
        body:userData,
      });
      if (result?.data && result.data.message) {
        // If there is an error message, throw an error to trigger the rejected action
        throw new Error(result.data.message);
      }
      // If no error message, return the result
      return result;
      
    }catch(error){
      const typedError = error as Error | AxiosError;

      console.error('Error logging in:',typedError);
      errorHandle(typedError)
      console.error('Error in loginUser:', error);
      // dispatch(setAlert({open: true, severity: 'error', message: typedError.message || 'Login failed' }))
      throw error;
    }
  }
)


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

export const updateProfile =
  async ({ currentUser, updatedFields }: UpdateProfilePayload) => {
    console.log('Entered inside updateProfile');
    
    const { firstName, lastName, email, mobile, file } = updatedFields || {}; // Destructure with default empty object
    let body = {firstName,lastName,email,mobile}
    console.log('Entered after, updated fields',updatedFields,'userId',currentUser?._id);
    try {
      if (file) {
        const imageName = uuidv4() + '.' + file?.name?.split('.')?.pop();
        const photoURL = await uploadFile(file, `profile/${currentUser?._id}/${imageName}`);

        const result = await fetchData({
          url: import.meta.env.VITE_SERVER_URL + `/api/user/profile/${currentUser?._id}`,
          method: 'PATCH',
          body: { ...body, photoURL },
        });

        if (result?.data && result.data.message) {
          // If there is an error message, throw an error to trigger the rejected action
          throw new Error(result.data.message);
        }
        // If no error message, return the result
        return result;
      }else{
        console.log('else case ',`/api/user/profile/${currentUser?._id}`)
        const result = await fetchData({
          url: import.meta.env.VITE_SERVER_URL + `/api/user/profile/${currentUser?._id}`,
          method: 'PATCH',
          body: { ...body, photoURL:'' },
        });
        console.log('Result of Fetching',result)
        return result;
      }
    } catch (error) {
      const typedError = error as Error | AxiosError;

      console.error('Error updating user profile:', typedError);
      errorHandle(typedError);
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }


