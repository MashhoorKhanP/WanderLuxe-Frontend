import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store/types";
import fetchData from "./utils/fetchData";
import { AxiosError } from "axios";
import errorHandle from "../components/hooks/errorHandler";
import { AppThunk } from "../store/store";
import {
  resendOTPFulfilled,
  resendOTPPending,
  resendOTPRejected,
  setAlert,
} from "../store/slices/userSlices/userSlice";
import uploadFile from "../firebase/upload";
import { v4 as uuidv4 } from "uuid";
import instance from "./utils/axiosInstance";

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
  password: string;
  isGoogle: boolean;
  isVerified: boolean;
}

interface OTP {
  otp: {
    otp: number;
    forgotPassword: any;
  };
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UpdateProfilePayload {
  currentUser: object | any;
  updatedFields?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    file?: string | File | any;
  };
}

interface WishlistData {
  wishlistData: {
    hotelId: string;
    userId: string;
  };
}

interface ChangePasswordData {
  changePasswordData: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  };
}

interface ForgotPasswordData {
  forgotPasswordData: {
    email: string;
    newPassword: string;
  };
}

interface AddMoneyToWalletDetails {
  addMoneyToWalletDetails: {
    userId: string;
    amount: number;
  };
}

//Async thunk for user register instead fetchData.ts
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: RequestBody) => {
    console.log(`Entered registerUser`, userData);

    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/user/signup",
      method: "POST",
      body: userData,
    });
    // Handle the result as needed
    return result as any;
  }
);

export const googleregister = createAsyncThunk(
  "user/googleRegister",
  async (userData: GoogleRequestBody, { dispatch, getState }) => {
    const state = getState() as RootState;
    const token = state.user.currentUser?.token || "";

    console.log(`Entered registerUser`, userData);

    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/user/google-signup",
      method: "POST",
      token,
      body: userData,
    });
    // Handle the result as needed
    return result as any;
  }
);

export const verifyUser = createAsyncThunk(
  "user/verifyUser",
  async (otp: OTP, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      console.log("isforgotPasswordquery", otp.otp.forgotPassword);
      const result = await fetchData({
        url:
          import.meta.env.VITE_SERVER_URL +
          `/api/user/verify-otp?forgotPassword=${otp.otp.forgotPassword}`,
        method: "POST",
        body: { otp: otp.otp },
      });

      return result as any;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData: LoginRequestBody) => {
    try {
      const result = await instance.post("/login", userData);
      if (result?.data && result.data.message) {
        // If there is an error message, throw an error to trigger the rejected action
        throw new Error(result.data.message);
      }
      // If no error message, return the result
      return result as any;
    } catch (error) {
      const typedError = error as Error | AxiosError | any;

      console.error("Error logging in:", typedError);
      errorHandle(typedError.response.data.result);
      console.error("Error in loginUser:", error);
      // dispatch(setAlert({open: true, severity: 'error', message: typedError.message || 'Login failed' }))
      throw error;
    }
  }
);

export const resendOTP =
  (email: string): AppThunk =>
  async (dispatch, getState: () => RootState) => {
    try {
      dispatch(resendOTPPending());

      const state = getState();
      const token = state.user?.currentUser?.token || "";

      const result = await fetchData({
        url: import.meta.env.VITE_SERVER_URL + "/api/user/resend-otp",
        method: "POST",
        token,
        body: { email },
      });

      dispatch(resendOTPFulfilled());
      dispatch(
        setAlert({
          open: true,
          severity: "success",
          message: "New OTP has been sent to your email address!",
        })
      );

      return result as any;
    } catch (error) {
      dispatch(resendOTPRejected());
      dispatch(
        setAlert({
          open: true,
          severity: "error",
          message: "Error resending OTP.",
        })
      );
      console.error("Error resending OTP:", error);
      throw error;
    }
  };

export const updateProfile = async ({
  currentUser,
  updatedFields,
}: UpdateProfilePayload) => {
  console.log("Entered inside updateProfile");

  const { firstName, lastName, email, mobile, file } = updatedFields || {}; // Destructure with default empty object
  let body = { firstName, lastName, email, mobile };
  try {
    if (file) {
      const imageName =
        uuidv4() + firstName + "." + file?.name?.split(".")?.pop();
      const profileImage = await uploadFile(
        file,
        `profile/${currentUser?._id}/${imageName}`
      );
      const result = await fetchData({
        url:
          import.meta.env.VITE_SERVER_URL +
          `/api/user/profile/${currentUser?._id}`,
        method: "PATCH",
        body: { ...body, profileImage },
      });

      if (result?.data as any && result.data.message as any) {
        // If there is an error message, throw an error to trigger the rejected action
        throw new Error(result.data.message as any);
      }
      // If no error message, return the result
      return result;
    } else {
      console.log("else case ", `/api/user/profile/${currentUser?._id}`);
      const result = await fetchData({
        url:
          import.meta.env.VITE_SERVER_URL +
          `/api/user/profile/${currentUser?._id}`,
        method: "PATCH",
        body: { ...body },
      });
      return result as any;
    }
  } catch (error) {
    const typedError = error as Error | AxiosError | any;

    console.error("Error updating user profile:", typedError);
    errorHandle(typedError);
    console.error("Error in updateProfile:", error);
    throw error;
  }
};

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ changePasswordData }: ChangePasswordData) => {
    console.log("Change password date:", changePasswordData);
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + `/api/user/change-password`,
      method: "PATCH",
      body: { ...changePasswordData },
    });
    if (result?.data && result.data.message) {
      throw new Error(result.data.message);
    }

    return result;
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async ({ forgotPasswordData }: ForgotPasswordData) => {
    console.log("Change password date:", forgotPasswordData);
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + `/api/user/forgot-password`,
      method: "POST",
      body: { ...forgotPasswordData },
    });
    if (result?.data && result.data.message) {
      throw new Error(result.data.message);
    }

    return result;
  }
);

export const addRemoveFromWishlist = createAsyncThunk(
  "user/addRemoveFromWishlist",
  async ({ wishlistData }: WishlistData) => {
    console.log("HotelId from user.ts", wishlistData.hotelId);
    // const result = await fetchData({
    //   url: import.meta.env.VITE_SERVER_URL + `/api/user/add-remove/wishlist`,
    //   method: "PATCH",
    //   body: { ...wishlistData },
    // });
    const result = await instance.patch('/add-remove/wishlist',wishlistData)
    // Check for errors in the result and throw if necessary
    if (result?.data && result.data.message) {
      throw new Error(result.data.message);
    }

    return result;
  }
);

export const postAddMoneyToWalletRequest = createAsyncThunk(
  "user/postAddMoneyToWalletRequest",
  async ({ addMoneyToWalletDetails }: AddMoneyToWalletDetails) => {
    console.log("addMoneyToWallet from user.ts", addMoneyToWalletDetails);
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + `/api/user/add-money-to-wallet`,
      method: "POST",
      body: addMoneyToWalletDetails,
    });
    console.log("result of postPaymentRequest", result);
    // Check for errors in the result and throw if necessary
    if (result?.data && result.data.message) {
      throw new Error(result.data.message);
    }
    if (result.message.url) {
      window.location.href = result.message.url;
    }
  }
);

export const getUpdatedUser = createAsyncThunk(
  "user/updatedUser",
  async (userId: string) => {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + `/api/user/updated-user/${userId}`,
      method: "GET",
      body: {},
    });
    console.log("result of updatedUser", result);
    // Check for errors in the result and throw if necessary
    if (result?.data && result.data.message) {
      throw new Error(result.data.message);
    }
    return result;
  }
);
