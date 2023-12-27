import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { getCoupons } from "../../../actions/coupon";

interface AdminCouponState {
  adminLoading: boolean;
  couponDetails: CouponDetails;
  coupons: [];
  updatedCoupon: {};
}

export interface CouponDetails {
  _id?: string;
  couponCode: string;
  discountType: string;
  discount: number;
  maxDiscount?: number;
  expiryDate: Dayjs;
  couponCount: number;
  description: string;
  isCancelled: boolean;
}

const initialState: AdminCouponState = {
  adminLoading: false,
  coupons: [],
  couponDetails: {
    couponCode: "",
    discountType: "",
    discount: 0,
    maxDiscount: 0,
    expiryDate: dayjs(),
    couponCount: 0,
    description: "",
    isCancelled: false,
  },
  updatedCoupon: {},
};

const adminCouponSlice = createSlice({
  // update coupon slice in the store
  name: "adminCoupon",
  initialState,
  reducers: {
    updateCouponDetails: (
      state,
      action: PayloadAction<Partial<CouponDetails>>
    ) => {
      state.couponDetails = { ...state.couponDetails, ...action.payload };
    },
    updateCoupons: (state, action: PayloadAction<any>) => {
      state.coupons = action.payload;
    },
    updateUpdatedCoupon: (state, action: PayloadAction<any>) => {
      state.updatedCoupon = { ...state.updatedCoupon, ...action.payload };
    },
    resetAddCoupon: (state, action: PayloadAction<object>) => {
      state.couponDetails = {
        ...state.couponDetails,
        couponCode: "",
        discountType: "",
        discount: 0,
        maxDiscount: 0,
        expiryDate: dayjs(),
        couponCount: 0,
        description: "",
      };
    },
  },
  extraReducers: (builder) => {
    //Coupons
    builder.addCase(getCoupons.pending, (state) => {
      state.adminLoading = true;
    });

    builder.addCase(getCoupons.fulfilled, (state, action) => {
      state.adminLoading = false;
      const coupons = action.payload;
      if (coupons && coupons.message) {
        // Don't directly modify state.currentUser, create a new object
        state.coupons = coupons.message;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(getCoupons.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error(
          "Get coupon failed, Something went wrong!:",
          action.error
        );
      }
      state.adminLoading = false;
    });
  },
});

export const {
  updateCouponDetails,
  updateUpdatedCoupon,
  resetAddCoupon,
  updateCoupons,
} = adminCouponSlice.actions;

export default adminCouponSlice.reducer;
