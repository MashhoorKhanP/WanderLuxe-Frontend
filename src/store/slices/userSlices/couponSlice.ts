import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getCoupons } from "../../../actions/coupon";

interface CouponState {
  coupons: [];
  loading: boolean;
  isCouponOverviewOpen: boolean;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  isCouponOverviewOpen: false,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    openCouponOverview: (state) => {
      state.isCouponOverviewOpen = true;
    },
    closeCouponOverview: (state) => {
      state.isCouponOverviewOpen = false;
    },
    setCoupons: (state, action: PayloadAction<any>) => {
      state.coupons = action.payload;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCoupons.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getCoupons.fulfilled, (state, action) => {
      state.loading = false;
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
      state.loading = false;
    });
  },
});

export const {
  openCouponOverview,
  closeCouponOverview,
  setCoupons,
  startLoading,
  stopLoading,
} = couponSlice.actions;

export default couponSlice.reducer;
