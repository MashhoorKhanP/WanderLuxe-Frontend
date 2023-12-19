import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import errorHandle from "../../../components/hooks/errorHandler";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getRooms } from "../../../actions/room";
import { Options } from "../../../pages/user/rooms/AdultChildrenPicker";

interface RoomState {
  loading: boolean;
  rooms: [];
  isRoomOverviewOpen: boolean;
  selectedRoomId: string | null;
  checkInCheckOutRange: {};
  adultChildrenCount:number;
  adultChildrenOptions:Options;
  additionalRoomsNeeded:number;
}

const getTodayOrTomorrowDate = () => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  // If the current hour is before 6 PM, return the current date
  // Otherwise, return the date of tomorrow
  return currentHour < 18
    ? currentDate
    : new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
};

const today = getTodayOrTomorrowDate();

const initialState: RoomState = {
  loading: false,
  rooms: [],
  isRoomOverviewOpen: false,
  selectedRoomId: null,
  checkInCheckOutRange: {
    startDate: today,
    endDate: today,
    startTime: "",
    endTime: "",
    numberOfNights: 1,
  },
  adultChildrenCount:1,
  adultChildrenOptions:{
    adult:1,
    children:0
  },
  additionalRoomsNeeded:1
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    openRoomOverview: (state) => {
      state.isRoomOverviewOpen = true;
    },
    closeRoomOverview: (state) => {
      state.isRoomOverviewOpen = false;
      state.selectedRoomId = null;
    },
    setAdultChildren:(state,action:PayloadAction<number>) => {
      state.adultChildrenCount= action.payload;
    },
    setAdultChildrenOptions:(state,action:PayloadAction<object>) => {
      state.adultChildrenOptions = {...state.adultChildrenOptions,...action.payload};
    },
    setAdditionalRoomsNeeded:(state,action:PayloadAction<number>) => {
      state.additionalRoomsNeeded= action.payload;
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.selectedRoomId = action.payload;
    },
    setCheckInCheckOutRange: (state, action: PayloadAction<any>) => {
      state.checkInCheckOutRange = {
        ...state.checkInCheckOutRange,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    //Rooms
    builder.addCase(getRooms.pending, (state) => {
      // state.loading = true;
    });

    builder.addCase(getRooms.fulfilled, (state, action) => {
      // state.loading = false;
      const rooms = action.payload;
      console.log("rooms", rooms);
      if (rooms && rooms.message) {
        // Don't directly modify state.currentUser, create a new object
        state.rooms = rooms.message;
        // state.allRooms = rooms.message;
        // state.openLogin = false;
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
      // state.loading = false;
    });
  },
});

export const {
  setRoomId,
  closeRoomOverview,
  openRoomOverview,
  setCheckInCheckOutRange,
  setAdultChildren,
  setAdditionalRoomsNeeded,
  setAdultChildrenOptions
} = roomSlice.actions;

export default roomSlice.reducer;
