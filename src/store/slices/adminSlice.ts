import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { getUsers, loginAdmin } from "../../actions/admin";
import { toast } from "react-toastify";
import { addHotel, getHotels, updateHotel } from "../../actions/hotel";

interface AdminState {
  currentAdmin: Admin | null; //Want to update according to database
  openLogin: boolean;
  adminLoading: boolean;
  users: Users[];
  hotels:[];
  hotelImages: string[];
  hotelDetails: HotelDetails;
  hotelLocation:{longitude:number,latitude:number};
  updatedHotel:{},
  deletedHotelImages:string[],
  addedHotelImages:string[]
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

interface HotelDetails {
  hotelName: string;
  location: string;
  distanceFromCityCenter: number;
  mobile: string;
  email: string;
  minimumRent: number;// Adjust this type as per your requirements
  description: string;
  parkingPrice?:number;
}

const initialState: AdminState = {
  currentAdmin: null,
  users: [],
  hotels:[],
  openLogin: false,
  adminLoading: false,
  hotelImages: [],
  hotelDetails: {
    hotelName: "",
    location: "",
    distanceFromCityCenter: 0,
    mobile: "",
    email: "",
    minimumRent: 0,
    description: "",
    parkingPrice:0,
  },
  hotelLocation:{
    longitude:0, latitude:
    0
  },
  updatedHotel:{},
  deletedHotelImages:[],
  addedHotelImages:[],
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
    updateHotelDetails:(state,action:PayloadAction<Partial<HotelDetails>>) =>{
      state.hotelDetails = {...state.hotelDetails,...action.payload}
    },
    updateHotelImages: (state, action: PayloadAction<string[] | []>) => { 
      console.log('action.payload',action.payload);
      const resultImage = action.payload;
      if(resultImage.length<=0){
        state.hotelImages = [ 
            ...action.payload,
          ];
      }else{
        state.hotelImages = [
      ...state.hotelImages, 
        ...action.payload,
      ]; 
      }
      /** or if any issue check  [...state.hotelImages, ...action.payload]; */
    },
    deleteHotelImages: (state, action: PayloadAction<string>) => {
      state.hotelImages = state.hotelImages.filter(
        (image) => image !== action.payload
      );
    },
    updateLocation:(state,action: PayloadAction<object>) => {
      state.hotelLocation = {...state.hotelLocation,...action.payload};
    },
    resetAddHotel:(state,action:PayloadAction<object>)=>{
      state.hotelLocation={...state.hotelLocation,longitude:0,latitude:0,}
      state.hotelDetails = {...state.hotelDetails,hotelName:'',location:'',distanceFromCityCenter:0,mobile:'',email:'',
    minimumRent:0,description:'',parkingPrice:0}
    state.hotelImages =[];
    
    },
    updateHotels:(state,action:PayloadAction<any>)=> {
      state.hotels = action.payload
    },
    updateUpdatedHotel:(state,action:PayloadAction<any>) => {
      state.updatedHotel={...state.updatedHotel,...action.payload}
    },
    updateDeletedHotelImages: (state, action: PayloadAction<string[]>) => { 
      console.log('action.payload',action.payload);
        state.deletedHotelImages = [
      ...state.deletedHotelImages, 
        ...action.payload,
      ];  
      /** or if any issue check  [...state.hotelImages, ...action.payload]; */
    },
    updateAddedHotelImages: (state, action: PayloadAction<string[]>) => { 
      state.addedHotelImages = [
        ...state.addedHotelImages, 
          ...action.payload,
        ];  
      
      /** or if any issue check  [...state.hotelImages, ...action.payload]; */
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

    //Hotels
    builder.addCase(getHotels.pending, (state) => {
      state.adminLoading = true;
    });

    builder.addCase(getHotels.fulfilled, (state, action) => {
      state.adminLoading = false;
      const hotels = action.payload;
      if (hotels && hotels.message) {
       
        // Don't directly modify state.currentUser, create a new object
        state.hotels = hotels.message;
        // state.addressFilter={},
        // state.priceFilter=3500,
        // state.filteredHotels=hotels.message

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
      state.adminLoading = false;
    });

    // builder.addCase(updateHotel.pending, (state) => {
    //   state.adminLoading = true;
    // });

    // builder.addCase(updateHotel.fulfilled, (state, action) => {
    //   state.adminLoading = false;
    //   const hotels = action.payload;
    //   if (hotels && hotels.message) {
        
    //     console.log("hotels.message", hotels.message);
    //     // Don't directly modify state.currentUser, create a new object
    //     state.hotels = hotels.message;
        

    //     state.openLogin = false;
    //   } else {
    //     // Handle the case where currentUser or message is null or undefined
    //     console.error("Received invalid data in loginUser.fulfilled");
    //   }
    // });
    // builder.addCase(updateHotel.rejected, (state, action) => {
    //   const error = action.error as Error | AxiosError;

    //   if (error instanceof Error) {
    //     // Handle specific error messages from the server if available
    //     errorHandle(error);
    //     toast.error(error.message);
    //   } else {
    //     // Handle non-Error rejection (if needed)
    //     console.error("Login failed with non-Error rejection:", action.error);
    //   }
    //   state.adminLoading = false;
    // });
  },
});

export const {
  setCurrentAdmin,
  updateAdmin,
  logoutAdmin,
  updateHotelDetails,
  updateHotelImages,
  deleteHotelImages,
  updateDeletedHotelImages,
  updateAddedHotelImages,
  updateLocation,
  updateUpdatedHotel,
  resetAddHotel,
  updateHotels,
  startLoading,
  stopAdminLoading,
} = adminSlice.actions;

export default adminSlice.reducer;
