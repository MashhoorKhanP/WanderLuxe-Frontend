import { createAsyncThunk, createSlice, PayloadAction, ThunkAction} from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import errorHandle from '../../components/hooks/errorHandler';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  body?: object | string;
}

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
    withCredentials:true,
    data: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await axios(axiosConfig);
    console.log('API Response:', response);

    const data = await response.data;
    
    console.log('API Response Data:', data);

    //  if (!response || response.status !== 200) {
    //   throw new Error('Request failed with status ' + response?.status);
    // }
    // if (!data || !data.success) {
    //   // Use the errorHandle function to handle the error
    //   errorHandle(new Error(data?.message || 'Request failed with an unspecified error.'));
    //   throw new Error(data?.message || 'Request failed with an unspecified error.');
    // }
    console.log(data ,'and',data.result)
    if(data.result === null || data.result === undefined){
      return data;
    }
    return data.result;

  } catch (error) {
    // Use the errorHandle function to handle the error
    const typedError = error as AxiosError | any;
    console.log(typedError.response?.data?.result.success);
    if(!typedError.response?.data?.result.success){
      errorHandle(typedError.response?.data?.result);
    }
    console.error("CatchBlock,typedError",typedError.response?.data?.result?.message);
    return null;
  }
};


export default fetchData;