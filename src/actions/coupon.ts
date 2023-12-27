import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchData from "./utils/fetchData";
import { AxiosError } from "axios";
import errorHandle from "../components/hooks/errorHandler";
import deleteImages from "./utils/deleteImages";
import { CouponDetails } from "../store/slices/adminSlices/adminCouponSlice";

// export interface Admin {
//   _id: string;
//   email: string;
// }

interface DeleteCouponPayload {
  couponData: CouponDetails;
}

interface UpdateCouponPayload {
  updatedCoupon: CouponDetails;
}

//Admin actions
export const addCoupon = async (couponData: CouponDetails) => {
  try {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/admin/coupons/add-coupon",
      method: "POST",
      body: couponData,
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

export const deleteCoupon = createAsyncThunk(
  "hotel/deleteCoupon",
  async ({ couponData}: DeleteCouponPayload) => {
    console.log('couponData from deleteCoupon coupon.ts',couponData);
    
    const result = await fetchData({
      url:
        import.meta.env.VITE_SERVER_URL +
        `/api/admin/coupons/delete-coupon/${couponData._id}`,
      method: "DELETE",
      body: {},
    });

    // Check for errors in the result and throw if necessary
    if (result?.data && result.data.message) {
      throw new Error(result.data.message);
    }

    

    return { couponData } as DeleteCouponPayload;
  }
);

export const updateCoupon = async ({ updatedCoupon }: UpdateCouponPayload) => {
  console.log("udatedcoupon from coupon.ts", updatedCoupon);
  const result = await fetchData({
    url:
      import.meta.env.VITE_SERVER_URL +
      `/api/admin/coupons/update-coupon/${updatedCoupon._id}`,
    method: "PATCH",
    body: updatedCoupon,
  });

  // Check for errors in the result and throw if necessary
  if (result?.data && result.data.message) {
    throw new Error(result.data.message);
  }

  return result;
};

//User Actions / Admin Actions
export const getCoupons = createAsyncThunk("user/getCoupons", async () => {
  try {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/user/find-coupons",
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

    console.error("Error getCoupons :", typedError);
    errorHandle(typedError);
    console.error("Error getCoupons :", error);
    // dispatch(setAlert({open: true, severity: 'error', message: typedError.message || 'Login failed' }))
    throw error;
  }
});
