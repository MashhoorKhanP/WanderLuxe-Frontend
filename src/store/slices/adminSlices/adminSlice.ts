import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { getUsers, loginAdmin } from "../../../actions/admin";
import { toast } from "react-toastify";
import { getBookings } from "../../../actions/booking";

interface AdminState {
  currentAdmin: Admin | null; //Want to update according to database
  openLogin: boolean;
  adminLoading: boolean;
  users: Users[];
  bookings:BookingDetails[];
}

interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  token: string;
}

interface Users {
  firstName: string;
  lastName: string;
  profileImage: string;
  mobileNo: string;
  email: string;
  createdAt: string | Date;
  isVerified: boolean;
  isBlocked: boolean;
}

export interface BookingDetails {
  _id?:string;
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
  checkInDate:Date|any,
  checkOutDate:Date|any,
  checkInTime:string | any,
  checkOutTime:string | any,
  appliedCouponId:string,
  couponDiscount:number,
  numberOfNights:number,
  totalAmount:number,
  adults:number,
  children:number,
  status:string,
  transactionId:string,
  receiptUrl:string,
  paymentMethod:string,
}

export interface HotelDetails {
  _id: string;
  hotelName: string;
  location: string;
  distanceFromCityCenter: number;
  mobile: string;
  email: string;
  minimumRent: number; // Adjust this type as per your requirements
  description: string;
  parkingPrice?: number;
}

export interface RoomDetails {
  _id?: string;
  roomType: string;
  hotelName: string;
  hotelId: string;
  amenities: string[];
  price: number;
  discountPrice: number;
  roomsCount: number;
  maxPeople: number;
  description: string;
  images?: string[];
}

const initialState: AdminState = {
  currentAdmin: null,
  users: [],
  bookings:[],
  openLogin: false,
  adminLoading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setCurrentAdmin: (state, action: PayloadAction<Admin>) => {
      state.currentAdmin = action.payload;
    },
    // setUsers:(state,action:PayloadAction<Users>) =>{
    //   state.users = action.payload;
    // },
    updateAdmin: (state, action: PayloadAction<Admin>) => {
      const updatedAdmin = action.payload;
      localStorage.setItem("currentAdmin", JSON.stringify(updatedAdmin));
      state.currentAdmin = { ...updatedAdmin };
    },
    logoutAdmin: (state) => {
      state.currentAdmin = null;
      localStorage.removeItem("currentAdmin");
      localStorage.removeItem("AdminToken");
      toast.success("Logged out successfully");
    },
    startLoading: (state) => {
      state.adminLoading = true;
    },
    stopAdminLoading: (state) => {
      state.adminLoading = false;
    },
  },
  extraReducers: (builder) => {
    //Admin Login
    builder.addCase(loginAdmin.pending, (state) => {
      state.adminLoading = true;
    });

    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.adminLoading = false;
      const currentAdmin = action.payload;
      if (currentAdmin && currentAdmin.message) {
        console.log(
          "JSON.Stingify of current user",
          JSON.stringify(currentAdmin.message)
        );
        console.log(currentAdmin, "for token check");
        localStorage.setItem("AdminToken", currentAdmin.token);
        localStorage.setItem(
          "currentAdmin",
          JSON.stringify(currentAdmin.message)
        );
        console.log("currentAdmin.message", currentAdmin.message);
        // Don't directly modify state.currentUser, create a new object
        state.currentAdmin = currentAdmin.message;

        toast.success("Login Successfull");
        console.log("reached here adminSlice , next is to openLogin = false");
        state.openLogin = false;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Login failed with non-Error rejection:", action.error);
      }
      state.adminLoading = false;
    });

    //Get Users
    builder.addCase(getUsers.pending, (state) => {
      state.adminLoading = true;
    });

    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.adminLoading = false;
      const users = action.payload;
      if (users && users.message) {
        console.log(
          "JSON.Stingify of  users List",
          JSON.stringify(users.message)
        );
        console.log("user.message", users.message);
        // Don't directly modify state.currentUser, create a new object
        state.users = users.message;
        state.openLogin = false;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Login failed with non-Error rejection:", action.error);
      }
      state.adminLoading = false;
    });

    //Get Bookings
    builder.addCase(getBookings.pending, (state) => {
      state.adminLoading = true;
    });

    builder.addCase(getBookings.fulfilled, (state, action) => {
      state.adminLoading = false;
      const bookings = action.payload;
      if (bookings && bookings.message) {
        console.log(
          "JSON.Stingify of  users List",
          JSON.stringify(bookings.message)
        );
        console.log("user.message", bookings.message);
        // Don't directly modify state.currentUser, create a new object
        state.bookings = bookings.message;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(getBookings.rejected, (state, action) => {
      const error = action.error as Error | AxiosError;

      if (error instanceof Error) {
        // Handle specific error messages from the server if available
        errorHandle(error);
        toast.error(error.message);
      } else {
        // Handle non-Error rejection (if needed)
        console.error("Login failed with non-Error rejection:", action.error);
      }
      state.adminLoading = false;
    });
  },
});

export const {
  setCurrentAdmin,
  updateAdmin,
  logoutAdmin,
  startLoading,
  stopAdminLoading,
} = adminSlice.actions;

export default adminSlice.reducer;
