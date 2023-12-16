import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { getUsers, loginAdmin } from "../../actions/admin";
import { toast } from "react-toastify";
import { addHotel, getHotels, updateHotel } from "../../actions/hotel";
import { getRooms } from "../../actions/room";

interface AdminState {
  currentAdmin: Admin | null; //Want to update according to database
  openLogin: boolean;
  adminLoading: boolean;
  users: Users[];
  hotels:[];
  allHotels:[];
  hotelImages: string[];
  hotelDetails: HotelDetails;
  hotelLocation:{longitude:number,latitude:number};
  updatedHotel:{},
  deletedHotelImages:string[],
  addedHotelImages:string[]
  roomDetails:RoomDetails;
  roomImages:string[];
  rooms:[];
  updatedRoom:{},

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

export interface HotelDetails {
  _id:string;
  hotelName: string;
  location: string;
  distanceFromCityCenter: number;
  mobile: string;
  email: string;
  minimumRent: number;// Adjust this type as per your requirements
  description: string;
  parkingPrice?:number;
}

export interface RoomDetails {
  _id?:string;
  roomType:string;
  hotelName: string;
  hotelId:string;
  amenities:string[];
  price:number;
  discountPrice:number;
  roomsCount:number;
  maxPeople:number;
  description:string;
  images?:string[];
}

const initialState: AdminState = {
  currentAdmin: null,
  users: [],
  hotels:[],
  allHotels:[],
  openLogin: false,
  adminLoading: false,
  hotelImages: [],
  hotelDetails: {
    _id:'',
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

  roomImages: [],
  roomDetails: {
    roomType:'',
    hotelId:'',
    hotelName: '',
    amenities:[],
    price:0,
    discountPrice:0,
    roomsCount:0,
    maxPeople:0,
    description:'',
  },
  rooms:[],
  updatedRoom:{},
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
    //Rooms part
    updateRooms:(state,action:PayloadAction<any>)=> {
      state.rooms = action.payload
    },
    updateRoomDetails:(state,action:PayloadAction<Partial<RoomDetails>>) =>{
      console.log('updateRoomDetails',action.payload);
      state.roomDetails = {...state.roomDetails,...action.payload}
    },
    updateRoomImages: (state, action: PayloadAction<string[] | []>) => { 
      console.log('action.payload',action.payload);
      const resultImage = action.payload;
      if(resultImage.length<=0){
        state.roomImages = [ 
            ...action.payload,
          ];
      }else{
        state.roomImages = [
      ...state.roomImages, 
        ...action.payload,
      ]; 
      }
      /** or if any issue check  [...state.hotelImages, ...action.payload]; */
    },
    deleteRoomImages: (state, action: PayloadAction<string>) => {
      state.roomImages = state.roomImages.filter(
        (image) => image !== action.payload
      );
    },
    updateUpdatedRoom:(state,action:PayloadAction<any>) => {
      state.updatedRoom={...state.updatedRoom,...action.payload}
    },
    resetAddRoom:(state,action:PayloadAction<object>)=>{
      state.roomDetails = {...state.roomDetails,roomType:'',hotelName:'',amenities:[],price:0,discountPrice:0,roomsCount:0,maxPeople:0,description:''}
      state.roomImages=[];
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
        state.allHotels = hotels.message;
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
    
    builder.addCase(getRooms.pending, (state) => {
      state.adminLoading = true;
    });

    builder.addCase(getRooms.fulfilled, (state, action) => {
      state.adminLoading = false;
      const rooms = action.payload;
      if (rooms && rooms.message) {
       
        // Don't directly modify state.currentUser, create a new object
        state.rooms = rooms.message;
        // state.allRooms = rooms.message;
        state.openLogin = false;
      } else {
        // Handle the case where currentUser or message is null or undefined
        console.error("Received invalid data in loginUser.fulfilled");
      }
    });
    builder.addCase(getRooms.rejected, (state, action) => {
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
  updateHotelDetails,
  updateHotelImages,
  deleteHotelImages,
  updateDeletedHotelImages,
  updateAddedHotelImages,
  updateLocation,
  updateUpdatedHotel,
  resetAddHotel,
  updateHotels,
  updateRooms,
  updateRoomDetails,
  updateRoomImages,
  deleteRoomImages,
  resetAddRoom,
  updateUpdatedRoom,
  startLoading,
  stopAdminLoading,
} = adminSlice.actions;

export default adminSlice.reducer;
