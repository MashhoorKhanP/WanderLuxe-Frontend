import { AxiosError } from "axios";
import errorHandle from "../components/hooks/errorHandler";
import { RoomDetails } from "../store/slices/adminSlice";
import fetchData from "./utils/fetchData";
import { createAsyncThunk } from "@reduxjs/toolkit";

//Admin Side
export const addRoom = async (roomData:RoomDetails) => {
  try {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/admin/rooms/add-room",
      method: "POST",
      body: roomData,
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
};

//User Side / Admin Actions
export const getRooms = createAsyncThunk("user/getRooms", async () => {
  console.log('Entered inside the getRooms in room.ts')
  try {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/user/find-rooms",
      method: "GET",
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
});