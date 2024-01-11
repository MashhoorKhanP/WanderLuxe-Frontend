import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchData from "./utils/fetchData";
import errorHandle from "../components/hooks/errorHandler";
import { AxiosError } from "axios";

export interface UpdateBannersPayload {
  updatedBanners: {
    _id: string;
    images: [];
    text: string;
  };
}

export const updateBanners = async ({
  updatedBanners,
}: UpdateBannersPayload) => {
  console.log("updatedBanners from banner.ts", updatedBanners);

  const result = await fetchData({
    url:
      import.meta.env.VITE_SERVER_URL +
      `/api/admin/banners/update-banners/${updatedBanners._id}`,
    method: "PATCH",
    body: updatedBanners,
  });

  // Check for errors in the result and throw if necessary
  if (result?.data && result.data.message) {
    throw new Error(result.data.message);
  }

  return result;
};

export const getBanners = createAsyncThunk(
  "userORAdmin/getbanners",
  async () => {
    try {
      const result = await fetchData({
        url: import.meta.env.VITE_SERVER_URL + "/api/user/find-banners",
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

      console.error("Error getBanners :", typedError);
      errorHandle(typedError);
      console.error("Error getBanners :", error);
      // dispatch(setAlert({open: true, severity: 'error', message: typedError.message || 'Login failed' }))
      throw error;
    }
  }
);
