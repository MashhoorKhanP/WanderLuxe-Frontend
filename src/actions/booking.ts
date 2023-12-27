import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchData from "./utils/fetchData";
import errorHandle from "../components/hooks/errorHandler";
import { AxiosError } from "axios";

export interface BookingDetailsData{
  bookingDetails :{
    firstName : string;
    lastName : string;
    email : string;
    mobile : string;
    roomId: string;
    userId: string;
    roomType: string;
    hotelName: string;
    roomImage:string,
    totalRoomsCount:number,
    checkInDate:string,
    checkOutDate:string,
    checkInTime:string | any,
    checkOutTime:string | any,
    appliedCouponId:string,
    couponDiscount:number,
    numberOfNights:number,
    totalAmount:number,
    adults:number,
    children:number
    paymentMethod:string
  }
}

interface UpdateBookingPayload{
  updatedBooking:{
    _id:string,
    status:string
  }
}

interface GetUserBookingData{
  userDetails:{
    userId:string,
  }
}

export const postPaymentRequest = createAsyncThunk(
  "user/postPaymentRequest",
  async ({ bookingDetails }: BookingDetailsData) => {
    console.log("BookingDetail from booking.ts", bookingDetails);
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + `/api/user/payment`,
      method: "POST",
      body: bookingDetails ,
    });
    console.log('result of postPaymentRequest', result);
    // Check for errors in the result and throw if necessary
    if (result?.data && result.data.message) {
      throw new Error(result.data.message);
    }
    if(result.message.url){
      window.location.href = result.message.url;
    }
  }
);

export const updateBooking = async ({ updatedBooking}: UpdateBookingPayload) => {
  console.log("updatedBooking from coupon.ts", updatedBooking);
  const result = await fetchData({
    url:
      import.meta.env.VITE_SERVER_URL +
      `/api/admin/bookings/update-booking/${updatedBooking._id}`,
    method: "PATCH",
    body: updatedBooking,
  });

  // Check for errors in the result and throw if necessary
  if (result?.data && result.data.message) {
    throw new Error(result.data.message);
  }

  return result;
};

export const getUserBookings = createAsyncThunk("user/getUserbookings", async ({userDetails}:GetUserBookingData) => {
  try {
    console.log('userDetails', userDetails)
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + `/api/user/my-bookings/${userDetails.userId}`,
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

//Admin
export const getBookings = createAsyncThunk("user/getbookings", async () => {
  try {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/user/find-bookings",
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
