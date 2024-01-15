import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import errorHandle from "../components/hooks/errorHandler";
import fetchData from "./utils/fetchData";

interface LoginRequestBody {
  email: string;
  password: string;
}

export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async (adminData: LoginRequestBody, { dispatch, getState }) => {
    try {
      const result = await fetchData({
        url: import.meta.env.VITE_SERVER_URL + "/api/admin/login",
        method: "POST",
        body: adminData,
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
);

export const getUsers = createAsyncThunk("admin/Users", async () => {
  try {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/admin/users",
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

export const adminUpdateUser = async (
  isVerified: boolean,
  isBlocked: boolean,
  userId: string
) => {
  try {
    const result = await fetchData({
      url:
        import.meta.env.VITE_SERVER_URL +
        `/api/admin/users/update-user/${userId}`,
      method: "PATCH",
      body: {
        isVerified,
        isBlocked,
      },
    });
    if (result?.data && result.data.message) {
      // If there is an error message, throw an error to trigger the rejected action
      throw new Error(result.data.message);
    }
    // If no error message, return the result
    return result;
  } catch (error) {
    const typedError = error as Error | AxiosError;

    console.error("Error updating user:", typedError);
    errorHandle(typedError);
    console.error("Error in updateUser:", error);
    // dispatch(setAlert({open: true, severity: 'error', message: typedError.message || 'Update failed' }))
    throw error;
  }
};
