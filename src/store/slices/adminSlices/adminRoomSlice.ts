import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getRooms } from "../../../actions/room";

interface AdminRoomState {
  adminLoading: boolean;
  roomDetails: RoomDetails;
  roomImages: string[];
  rooms: [];
  updatedRoom: {};
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

const initialState: AdminRoomState = {
  adminLoading: false,

  roomImages: [],
  roomDetails: {
    roomType: "",
    hotelId: "",
    hotelName: "",
    amenities: [],
    price: 0,
    discountPrice: 0,
    roomsCount: 10,
    maxPeople: 0,
    description: "",
  },
  rooms: [],
  updatedRoom: {},
};

const adminRoomSlice = createSlice({
  name: "adminRoom",
  initialState,
  reducers: {
    //Rooms part
    updateRooms: (state, action: PayloadAction<any>) => {
      state.rooms = action.payload;
    },
    updateRoomDetails: (state, action: PayloadAction<Partial<RoomDetails>>) => {
      state.roomDetails = { ...state.roomDetails, ...action.payload };
    },
    updateRoomImages: (state, action: PayloadAction<string[] | []>) => {
      const resultImage = action.payload;
      if (resultImage.length <= 0) {
        state.roomImages = [...action.payload];
      } else {
        state.roomImages = [...state.roomImages, ...action.payload];
      }
      /** or if any issue check  [...state.hotelImages, ...action.payload]; */
    },
    deleteRoomImages: (state, action: PayloadAction<string>) => {
      state.roomImages = state.roomImages.filter(
        (image) => image !== action.payload
      );
    },
    updateUpdatedRoom: (state, action: PayloadAction<any>) => {
      state.updatedRoom = { ...state.updatedRoom, ...action.payload };
    },
    resetAddRoom: (state, action: PayloadAction<object>) => {
      state.roomDetails = {
        ...state.roomDetails,
        roomType: "",
        hotelName: "",
        amenities: [],
        price: 0,
        discountPrice: 0,
        roomsCount: 10,
        maxPeople: 0,
        description: "",
      };
      state.roomImages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRooms.pending, (state) => {
      state.adminLoading = true;
    });

    builder.addCase(getRooms.fulfilled, (state, action) => {
      state.adminLoading = false;
      const rooms = action.payload;
      if (rooms && rooms.message) {
        // Don't directly modify state.currentUser, create a new object
        state.rooms = rooms.message;
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
  updateRooms,
  updateRoomDetails,
  updateRoomImages,
  deleteRoomImages,
  resetAddRoom,
  updateUpdatedRoom,
} = adminRoomSlice.actions;

export default adminRoomSlice.reducer;
