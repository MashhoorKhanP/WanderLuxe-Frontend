import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/types";
import fetchData from "./utils/fetchData";
import { AxiosError } from "axios";
import errorHandle from "../components/hooks/errorHandler";
import { AppThunk } from "../store/store";
import { toast } from "react-toastify";

interface RequestBody {
  longitude:number;
  latitude:number;
  hotelName: string;
  location:string;
  distanceFromCityCenter:number;
  email:string;
  minimumRent: number;// Adjust this type as per your requirements
  description: string;
  parkingPrice?:number;
  images:string[];
}

export const addHotel = async (hotelData:RequestBody) => {
  try{
    const result = await fetchData({
      url:import.meta.env.VITE_SERVER_URL + "/api/admin/hotels/add-hotel",
      method:"POST",
      body:hotelData,
    });
    if (result?.data && result.data.message) {
      // If there is an error message, throw an error to trigger the rejected action
      throw new Error(result.data.message);
    }
    // If no error message, return the result
    return result;
  } catch (error) {
    const typedError = error as Error | AxiosError;

    console.error("Error logging in:", typedError);
    errorHandle(typedError);
    console.error("Error in loginUser:", error);
    // dispatch(setAlert({open: true, severity: 'error', message: typedError.message || 'Login failed' }))
    throw error;
  }
}