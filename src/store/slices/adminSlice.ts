import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { getUsers, loginAdmin } from "../../actions/admin";
import { toast } from "react-toastify";

interface AdminState {
  currentAdmin: Admin | null; //Want to update according to database
  openLogin: boolean;
  adminLoading: boolean;
  users: Users[];
  hotelImages:string[]
}

const initialState: AdminState = {
  currentAdmin: null,
  users: [],
  openLogin: false,
  adminLoading: false,
  hotelImages:[]
};

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
    updateHotelImages:(state,action:PayloadAction<string>) => {
      state.hotelImages = [...state.hotelImages,action.payload]; /** or if any issue check  [...state.hotelImages, ...action.payload]; */
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
  },
});

export const {
  setCurrentAdmin,
  updateAdmin,
  logoutAdmin,
  updateHotelImages,
  startLoading,
  stopAdminLoading,
} = adminSlice.actions;

export default adminSlice.reducer;
