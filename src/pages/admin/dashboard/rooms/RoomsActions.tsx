import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteRoom } from "../../../../actions/room";
import {
  updateRoomDetails,
  updateRoomImages,
  updateUpdatedRoom,
} from "../../../../store/slices/adminSlices/adminRoomSlice";
import { AppDispatch } from "../../../../store/store";
import { RootState } from "../../../../store/types";

interface RoomsActionsProps {
  params: any;
  setData: any;
}

const RoomsActions: React.FC<RoomsActionsProps> = ({ params, setData }) => {
  const {
    _id,
    roomType,
    hotelId,
    price,
    discountPrice,
    hotelName,
    amenities,
    roomsCount,
    maxPeople,
    images,
    description,
  } = params.row;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  const handleEdit = () => {
    dispatch(updateRoomImages([]));
    dispatch(
      updateRoomDetails({
        roomType,
        price,
        discountPrice,
        hotelId,
        hotelName,
        amenities,
        roomsCount,
        maxPeople,
        description,
      })
    );
    dispatch(updateRoomImages(images));
    dispatch(
      updateUpdatedRoom({
        _id,
        roomType,
        price,
        discountPrice,
        hotelId,
        hotelName,
        amenities,
        roomsCount,
        maxPeople,
        description,
      })
    );
    navigate("/admin/dashboard/rooms/edit-room");
  };

  const handleDelete = async (row: any, admin: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${row.roomType} by ${row.hotelName} hotel!`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, cancel!",
      customClass: {
        container: "custom-swal-container",
      },
      width: 400, // Set your desired width
      background: "#f0f0f0",
      iconHtml: '<i class="bi bi-trash" style="font-size:30px"></i>',
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(deleteRoom({ roomData: row, admin }));
        toast.success("Room deleted successfully");
        setData((prevData: any) => !prevData);
      }
    });
  };

  return (
    <Box>
      <Tooltip title="Edit this room">
        <IconButton onClick={() => handleEdit()}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this room">
        <IconButton
          onClick={() => handleDelete(params.row, currentAdmin as any)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RoomsActions;
