import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  addRemoveFromWishlist,
  changePassword,
  getUpdatedUser,
  googleregister,
  loginUser,
  postAddMoneyToWalletRequest,
  registerUser,
  verifyUser,
} from "../../../actions/user";
import errorHandle from "../../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getHotels } from "../../../actions/hotel";
import { MapRef } from "react-map-gl";
import { getCoupons } from "../../../actions/coupon";
import { getBookings, getHotelBookings, getUserBookings } from "../../../actions/booking";
import { BookingDetails } from "../adminSlices/adminSlice";
import { getBanners } from "../../../actions/banner";

interface UserState {
  currentUser: User | null; //Want to update according to database
  openLogin: boolean;
  openOTPVerification: boolean;
  alert: Alert | null;
  profile: Profile;
  loading: boolean;
  hotels: any[];
  rooms: [];
  mapRef: React.RefObject<MapRef> | null;
  priceFilter: number;
  isBookingDetailsOpen:boolean;
  selectedBookingId:string;
  addressFilter: {};
  filteredHotels: any[];
  filteredRooms: any[];
  bookings:[]
  hotelBookings:BookingDetails[]
  isWalletHistoryOpen:boolean;
  isChatScreenOpen:boolean;
  isForgotPasswordOpen:boolean;
}

const initialState: UserState = {
  currentUser: null,
  openLogin: false,
  openOTPVerification: false,
  alert: null,
  profile: { open: false, file: null, profileImage: "" },
  loading: false,
  hotels: [],
  rooms: [],
  mapRef: null,
  priceFilter: 3500,
  addressFilter: {},
  filteredHotels: [],
  filteredRooms: [],
  isBookingDetailsOpen:false,
  selectedBookingId:'',
  bookings:[],
  hotelBookings:[],
  isWalletHistoryOpen:false,
  isChatScreenOpen:false,
  isForgotPasswordOpen:false

};

export interface User {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  mobile?: string;
  token?: string;
  message?: {
    _id:string;
    firstName: string;
    profileImage: string;
    wallet:number;
    walletHistory?:[
      {
        transactionDate:Date,
        transactionDetails: string
        transactionType: string
        transactionAmount: number
        currentBalance: number
      }
    ];
  };
  isGoogle?: boolean;
  wishlist?: [string];
  wallet?:number;
  walletHistory?:[
    {
      transactionDate:Date,
      transactionDetails: string
      transactionType: string
      transactionAmount: number
      currentBalance: number
    }
  ];
}

interface Alert {
  open: boolean;
  severity: "error" | "warning" | "info" | "success";
  message: string;
}

interface Profile {
  open?: boolean;
  file?: File | null | undefined;
  profileImage?: string;
}

export const resendOTPSlice = createSlice({
  name: "resendOTP",
  initialState: {
    loading: false,
  },
  reducers: {
    resendOTPPending: (state) => {
      state.loading = true;
    },
    resendOTPFulfilled: (state) => {
      state.loading = false;
    },
    resendOTPRejected: (state) => {
      state.loading = false;
    },
  },
});

const applyFilter = (
  hotels: any[],
  address: { longitude?: number; latitude?: number },
  price: number
): any[] => {
  let filteredHotels = [...hotels]; // hotels;

  if (address) {
    const { longitude, latitude } = address;
    filteredHotels = filteredHotels.filter((hotel) => {
      const longitudeDifference =
        longitude && hotel.longitude
          ? Math.abs(longitude - hotel.longitude)
          : 0;
      const latitudeDifference =
        latitude && hotel.latitude ? Math.abs(latitude - hotel.latitude) : 0;
      return longitudeDifference <= 1 && latitudeDifference <= 1;
    });
  }

  if (price < 3500) {
    filteredHotels = filteredHotels.filter(
      (hotel) => hotel.minimumRent <= price
    );
  }

  return filteredHotels;
};

const applyRoomFilter = (rooms: any[], price: number): any[] => {
  let filteredRooms = [...rooms]; // hotels;

  if (price < 3500) {
    filteredRooms = filteredRooms.filter((room) => room.price <= price);
  }

  return filteredRooms;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const updatedUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      state.currentUser = { ...updatedUser };
    },
    updateUserProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      const updatedUserProfile = action.payload;
      console.log("UpdateUserProfile", { ...updatedUserProfile });
      console.log("Update state.Profile", { ...state.profile });
      state.currentUser = { ...state.currentUser, ...updatedUserProfile }; // Update only the relevant part of currentUser
      state.profile = {
        ...state.currentUser,
        ...state.profile,
        ...updatedUserProfile,
      }; // Update profile state
      // state.currentUser = { ...state.currentUser };
      console.log("state.currentUser", state.currentUser);
      const updatedUser = state.currentUser;
      if (updatedUser?.message) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify(updatedUser.message)
        );
      } else {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }
    },
    setMapRef: (state, action: PayloadAction<React.RefObject<MapRef>>) => {
      state.mapRef = action.payload;
    },
    filterPrice: (state, action: PayloadAction<number>) => {
      state.priceFilter = action.payload;
      state.filteredHotels = applyFilter(
        state.hotels,
        state.addressFilter,
        action.payload
      );
    },
    filterHotels: (state, action: PayloadAction<any>) => {
      state.hotels = action.payload;
      state.addressFilter = action.payload;
      state.filteredHotels = applyFilter(
        state.hotels,
        state.addressFilter,
        state.priceFilter || 3500
      );
    },
    filterAddress: (state, action: PayloadAction<object>) => {
      state.addressFilter = action.payload;
      state.filteredHotels = applyFilter(
        state.hotels,
        action.payload,
        state.priceFilter
      );
    },
    setHotels: (state, action: PayloadAction<any>) => {
      state.hotels = action.payload;
      state.filteredHotels = applyFilter(
        state.hotels,
        state.addressFilter,
        state.priceFilter || 3500
      );
    },
    setRooms: (state, action: PayloadAction<any>) => {
      state.rooms = action.payload;
      state.filteredRooms = applyRoomFilter(
        state.rooms,
        state.priceFilter || 3500
      );
    },
    filterRooms: (state, action: PayloadAction<any>) => {
      state.rooms = action.payload;
      state.filteredRooms = applyRoomFilter(
        state.rooms,
        state.priceFilter || 3500
      );
    },
    filterRoomPrice: (state, action: PayloadAction<number>) => {
      state.priceFilter = action.payload;
      state.filteredRooms = applyRoomFilter(state.rooms, action.payload);
    },
    clearAddress: (state) => {
      state.addressFilter = {};
      state.priceFilter = 3500;
      state.filteredHotels = state.hotels;
    },
    setBookings: (state, action: PayloadAction<any>) => {
      state.bookings = action.payload;
    },
    openBookingDetails:(state) => {
      state.isBookingDetailsOpen = true;
    },
    closeBookingDetails:(state) => {
      state.isBookingDetailsOpen = false;
    },
    openWalletHistory:(state) => {
      state.isWalletHistoryOpen = true;
    },
    closeWalletHistory:(state) => {
      state.isWalletHistoryOpen = false;
    },
    openChatScreen:(state) => {
      state.isChatScreenOpen = true;
    },
    closeChatScreen:(state) => {
      state.isChatScreenOpen = false;
    },
    openForgotPasswordScreen:(state) => {
      state.isForgotPasswordOpen = true;
    },
    closeForgotPasswordScreen:(state) => {
      state.isForgotPasswordOpen = false;
    },
    setBookingId:(state, action: PayloadAction<string>) => {
      state.selectedBookingId = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.bookings = [];
      localStorage.removeItem("currentUser");
      localStorage.removeItem("UserToken");
      toast.success("Logged out successfully");
    },
    setOpenLogin: (state, action: PayloadAction<boolean>) => {
      state.openLogin = action.payload;
    },
    setCloseLogin: (state) => {
      state.openLogin = false;
    },
    setAlert: (state, action: PayloadAction<Alert>) => {
      console.log(action.payload);
      state.alert = action.payload;
    },
    clearAlert: (state) => {
      state.alert = null;
    },
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setOpenOTPVerification: (state, action: PayloadAction<boolean>) => {
      state.openOTPVerification = action.payload;
    },
    setCloseOTPVerification: (state) => {
      state.openOTPVerification = false;
    },
  },
  extraReducers: (builder) => {
    //Register User
    builder.addCase(registerUser.pending, (state) => {
      // You can dispatch startLoading here if needed
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.loading = false;
        state.alert = {
          open: true,
          severity: "success",
          message: "Verification OTP has been sent to your email address!",
        };
        state.openLogin = false;
        state.openOTPVerification = true;
        if (state.openOTPVerification) {
          setTimeout(() => {
            toast.warning("OTP Expired");
          }, 2 * 60000);
        }
      }
      state.loading = false;
      // state.currentUser = action.payload;
      // console.log('state.currentUser',state.currentUser);
      /**I don't need set currentUser now its only
       after otp verification */
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;
      state.openOTPVerification = false;
      state.openLogin = true;
      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        state.alert = { open: true, severity: "error", message: error.message };
      } else {
        // Handle non-Error rejection (if needed)
        console.error(
          "Registration failed with non-Error rejection:",
          action.error
        );
      }
      state.loading = false;
    });
    //Google Registration
    builder.addCase(googleregister.pending, (state) => {
      // You can dispatch startLoading here if needed
      state.loading = true;
    });
    builder.addCase(googleregister.fulfilled, (state, action) => {
      if (action.payload) {
        state.loading = false;
        state.alert = {
          open: true,
          severity: "success",
          message: "Google Registration Successfull!",
        };
        const currentUser = action.payload;
        console.log("currentUser", currentUser);
        if (currentUser) {
          console.log(
            "JSON.Stingify of current user",
            JSON.stringify(currentUser)
          );
          // Store currentUser in localStorage
          localStorage.setItem("currentUser", JSON.stringify(currentUser.message));
          localStorage.setItem("UserToken", currentUser.token);
          // Don't directly modify state.currentUser, create a new object
          state.currentUser = currentUser.message;

          state.alert = {
            open: true,
            severity: "success",
            message: "Login successful!",
          };
          console.log(
            "reached here userSlice googleRegister , next is to openLogin = false"
          );
          state.openLogin = false;
        }
      }
      state.loading = false;
    });
    builder.addCase(googleregister.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;
      state.openLogin = true;
      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        state.alert = { open: true, severity: "error", message: error.message };
      } else {
        // Handle non-Error rejection (if needed)
        console.error(
          "Google Registration failed with non-Error rejection:",
          action.error
        );
      }
      state.loading = false;
    });

     //Verify User
     builder.addCase(verifyUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(verifyUser.fulfilled, (state, action) => {
      state.loading = false;
      state.alert = {
        open: true,
        severity: "success",
        message: "OTP verification successful!",
      };
      state.openOTPVerification = false;
      state.openLogin = true;
      state.alert = {
        open: true,
        severity: "success",
        message: "Verification successful, Now login to your account!",
      };
    });

    builder.addCase(verifyUser.rejected, (state, action) => {
      state.loading = false;
      state.alert={open: true,
        severity: "error",
        message: 'Invalid OTP, Please confirm your OTP'}
      if (action.error instanceof Error) {
        state.alert = {
          open: true,
          severity: "error",
          message: action.error.message,
        };
        console.log("OTP Verification failed:", action.error);
      } else {
        console.error(
          "OTP verification failed with non-Error rejection:",
          action.error
        );
      }
    });


    //Login User
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      console.log("loginUser.fulfilled", action.payload);
      const currentUser = action.payload;
      if (currentUser && currentUser.message) {
        console.log(currentUser, "for token check");
        localStorage.setItem("UserToken", currentUser.token);
        console.log(
          "JSON.Stingify of current user",
          JSON.stringify(currentUser.message)
        );
        // Store currentUser in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify(currentUser.message)
        );
        // Don't directly modify state.currentUser, create a new object
        state.currentUser = currentUser.message;

        state.alert = {
          open: true,
          severity: "success",
          message: "Login successful!",
        };
        console.log("reached here userSlice , next is to openLogin = false");
        state.openLogin = false;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        state.alert = { open: true, severity: "error", message: error.message };
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Login failed with non-Error rejection:", action.error);
      }
      state.loading = false;
    });

    //Hotels
    builder.addCase(getHotels.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getHotels.fulfilled, (state, action) => {
      state.loading = false;
      const hotels = action.payload;
      if (hotels && hotels.message) {
        // Don't directly modify state.currentUser, create a new object
        state.hotels = hotels.message;
        (state.addressFilter = {}),
          (state.priceFilter = 3500),
          (state.filteredHotels = hotels.message);

        state.openLogin = false;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(getHotels.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Login failed with non-Error rejection:", action.error);
      }
      state.loading = false;
    });

    builder.addCase(addRemoveFromWishlist.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addRemoveFromWishlist.fulfilled, (state, action) => {
      state.loading = false;
      const user = action.payload;
      console.log("user", user);
      if (user && user.message) {
        // Don't directly modify state.currentUser, create a new object
        state.currentUser = { ...user.message };
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Something went wrong while wishlisting");
      }
    });
    builder.addCase(addRemoveFromWishlist.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Wishlisting Failed", action.error);
      }
      state.loading = false;
    });

    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      const user = action.payload;
      console.log("user", user);
      if (user && user.message) {
        // Don't directly modify state.currentUser, create a new object
        state.currentUser = { ...user.message };
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Something went wrong while wishlisting");
      }
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Changing password failed", action.error);
      }
      state.loading = false;
    });

    //User Bookings
    builder.addCase(getUserBookings.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getUserBookings.fulfilled, (state, action) => {
      state.loading = false;
      const bookings = action.payload;
      if (bookings && bookings.message) {
        // Don't directly modify state.currentUser, create a new object
        state.bookings = bookings.message;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(getUserBookings.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Login failed with non-Error rejection:", action.error);
      }
      state.loading = false;
    });

    //Get Bookings
    builder.addCase(getHotelBookings.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getHotelBookings.fulfilled, (state, action) => {
      state.loading = false;
      const bookings = action.payload;
      if (bookings && bookings.message) {
        // console.log(
        //   "JSON.Stingify of  users List",
        //   JSON.stringify(bookings.message)
        // );
        // console.log("user.message", bookings.message);
        // Don't directly modify state.currentUser, create a new object
        state.hotelBookings = bookings.message;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(getHotelBookings.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Login failed with non-Error rejection:", action.error);
      }
      state.loading = false;
    });

    // // updated user
    builder.addCase(getUpdatedUser.pending, (state) => {
      // state.loading = true;
    });

    builder.addCase(getUpdatedUser.fulfilled, (state, action) => {
      // state.loading = false;
      const user = action.payload;
      console.log("user", user);
      if (user && user.message) {
        // Don't directly modify state.currentUser, create a new object
        state.currentUser = { ...user.message };
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Something went wrong while wishlisting");
      }
    });
    builder.addCase(getUpdatedUser.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Getupdated user Failed", action.error);
      }
      // state.loading = false;
    });
  },
});

export const {
  setCurrentUser,
  updateUser,
  updateUserProfile,
  filterAddress,
  clearAddress,
  setHotels,
  logoutUser,
  filterHotels,
  filterRooms,
  setRooms,
  setMapRef,
  filterPrice,
  filterRoomPrice,
  setOpenLogin,
  setCloseLogin,
  setAlert,
  openBookingDetails,
  closeBookingDetails,
  openWalletHistory,
  closeWalletHistory,
  openChatScreen,
  closeChatScreen,
  openForgotPasswordScreen,
  closeForgotPasswordScreen,
  setBookingId,
  setBookings,
  clearAlert,
  startLoading,
  stopLoading,
  setOpenOTPVerification,
  setCloseOTPVerification,
} = userSlice.actions;
export const { resendOTPPending, resendOTPFulfilled, resendOTPRejected } =
  resendOTPSlice.actions;
export default userSlice.reducer;
