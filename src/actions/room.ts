import { AxiosError } from "axios";
import errorHandle from "../components/hooks/errorHandler";
import { RoomDetails } from "../store/slices/adminSlices/adminSlice";
import fetchData from "./utils/fetchData";
import { createAsyncThunk } from "@reduxjs/toolkit";
import deleteImages from "./utils/deleteImages";
import { Admin } from "./hotel";

interface DeleteRoomPayload {
  roomData: RoomDetails;
  admin: Admin;
}

interface UpdateRoomPayload {
  updatedRoom: {
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
  };
}

//Admin Side
export const addRoom = async (roomData: RoomDetails) => {
  try {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/admin/rooms/add-room",
      method: "POST",
      body: roomData,
    });
    if (result?.data && result.data.message) {
      // If there is an error message, throw an error to trigger the rejected action
      throw new Error(result.data.message);
    }
    // If no error message, return the result
    return result;
  } catch (error) {
    const typedError = error as Error | AxiosError;

    console.error("Error logging in:", typedError);
    errorHandle(typedError);
    console.error("Error in loginUser:", error);
    // dispatch(setAlert({open: true, severity: 'error', message: typedError.message || 'Login failed' }))
    throw error;
  }
};

export const deleteRoom = createAsyncThunk(
  "room/deleteRoom",
  async ({ roomData, admin }: DeleteRoomPayload) => {
    const result = await fetchData({
      url:
        import.meta.env.VITE_SERVER_URL +
        `/api/admin/rooms/delete-room/${roomData._id}`,
      method: "DELETE",
      body: {},
    });

    // Check for errors in the result and throw if necessary
    if (result?.data && result.data.message) {
      throw new Error(result.data.message);
    }

    // Delete images after successful deletion
    deleteImages(roomData.images, admin._id);

    return { roomData } as DeleteRoomPayload;
  }
);

export const updateRoom = async ({ updatedRoom }: UpdateRoomPayload) => {
  console.log("updatedRoom from room.ts", updatedRoom);
  const result = await fetchData({
    url:
      import.meta.env.VITE_SERVER_URL +
      `/api/admin/rooms/update-room/${updatedRoom._id}`,
    method: "PATCH",
    body: updatedRoom,
  });

  // Check for errors in the result and throw if necessary
  if (result?.data && result.data.message) {
    throw new Error(result.data.message);
  }

  return result;
};

//User Side / Admin Actions
export const getRooms = createAsyncThunk("user/getRooms", async () => {
  console.log("Entered inside the getRooms in room.ts");
  try {
    const result = await fetchData({
      url: import.meta.env.VITE_SERVER_URL + "/api/user/find-rooms",
      method: "GET",
    });
    if (result?.data && result.data.message) {
      // If there is an error message, throw an error to trigger the rejected action
      throw new Error(result.data.message);
    }
    // If no error message, return the result
    return result;
  } catch (error) {
    const typedError = error as Error | AxiosError;

    console.error("Error logging in:", typedError);
    errorHandle(typedError);
    console.error("Error in loginUser:", error);
    // dispatch(setAlert({open: true, severity: 'error', message: typedError.message || 'Login failed' }))
    throw error;
  }
});
