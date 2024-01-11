import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getHotels } from "../../../actions/hotel";
import errorHandle from "../../../components/hooks/errorHandler";

interface AdminHotelState {
  adminLoading: boolean;
  hotels: [];
  allHotels: [];
  hotelImages: string[];
  hotelDetails: HotelDetails;
  hotelLocation: { longitude: number; latitude: number };
  updatedHotel: {};
  deletedHotelImages: string[];
  addedHotelImages: string[];
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

const initialState: AdminHotelState = {
  hotels: [],
  allHotels: [],
  adminLoading: false,
  hotelImages: [],
  hotelDetails: {
    _id: "",
    hotelName: "",
    location: "",
    distanceFromCityCenter: 0,
    mobile: "",
    email: "",
    minimumRent: 0,
    description: "",
    parkingPrice: 0,
  },
  hotelLocation: {
    longitude: 0,
    latitude: 0,
  },
  updatedHotel: {},
  deletedHotelImages: [],
  addedHotelImages: [],
};

const adminHotelSlice = createSlice({
  name: "adminHotel",
  initialState,
  reducers: {
    updateHotelDetails: (
      state,
      action: PayloadAction<Partial<HotelDetails>>
    ) => {
      state.hotelDetails = { ...state.hotelDetails, ...action.payload };
    },
    updateHotelImages: (state, action: PayloadAction<string[] | []>) => {
      console.log("action.payload", action.payload);
      const resultImage = action.payload;
      if (resultImage.length <= 0) {
        state.hotelImages = [...action.payload];
      } else {
        state.hotelImages = [...state.hotelImages, ...action.payload];
      }
      /** or if any issue check  [...state.hotelImages, ...action.payload]; */
    },
    deleteHotelImages: (state, action: PayloadAction<string>) => {
      state.hotelImages = state.hotelImages.filter(
        (image) => image !== action.payload
      );
    },
    updateLocation: (state, action: PayloadAction<object>) => {
      state.hotelLocation = { ...state.hotelLocation, ...action.payload };
    },
    resetAddHotel: (state, action: PayloadAction<object>) => {
      state.hotelLocation = {
        ...state.hotelLocation,
        longitude: 0,
        latitude: 0,
      };
      state.hotelDetails = {
        ...state.hotelDetails,
        hotelName: "",
        location: "",
        distanceFromCityCenter: 0,
        mobile: "",
        email: "",
        minimumRent: 0,
        description: "",
        parkingPrice: 0,
      };
      state.hotelImages = [];
    },
    updateHotels: (state, action: PayloadAction<any>) => {
      state.hotels = action.payload;
    },
    updateUpdatedHotel: (state, action: PayloadAction<any>) => {
      state.updatedHotel = { ...state.updatedHotel, ...action.payload };
    },
    updateDeletedHotelImages: (state, action: PayloadAction<string[]>) => {
      console.log("action.payload", action.payload);
      state.deletedHotelImages = [
        ...state.deletedHotelImages,
        ...action.payload,
      ];
      /** or if any issue check  [...state.hotelImages, ...action.payload]; */
    },
    updateAddedHotelImages: (state, action: PayloadAction<string[]>) => {
      state.addedHotelImages = [...state.addedHotelImages, ...action.payload];

      /** or if any issue check  [...state.hotelImages, ...action.payload]; */
    },
  },
  extraReducers: (builder) => {
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
  },
});

export const {
  updateHotelDetails,
  updateHotelImages,
  deleteHotelImages,
  updateDeletedHotelImages,
  updateAddedHotelImages,
  updateLocation,
  updateUpdatedHotel,
  resetAddHotel,
  updateHotels,
} = adminHotelSlice.actions;

export default adminHotelSlice.reducer;
