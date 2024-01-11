import { Edit } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteHotel } from "../../../../actions/hotel";
import { RootState } from "../../../../store/types";

import { useNavigate } from "react-router-dom";
import {
  updateHotelDetails,
  updateHotelImages,
  updateLocation,
  updateUpdatedHotel,
} from "../../../../store/slices/adminSlices/adminHotelSlice";
import { AppDispatch } from "../../../../store/store";

interface HotelsActionsProps {
  params: any;
  setData: any;
}

const HotelsActions: React.FC<HotelsActionsProps> = ({ params, setData }) => {
  const {
    _id,
    longitude,
    latitude,
    hotelName,
    minimumRent,
    parkingPrice,
    images,
    description,
    distanceFromCityCenter,
    location,
    email,
    mobile,
  } = params.row;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  const handleEdit = () => {
    dispatch(updateHotelImages([]));
    dispatch(updateLocation({ longitude, latitude }));
    dispatch(
      updateHotelDetails({
        hotelName,
        minimumRent,
        parkingPrice,
        description,
        distanceFromCityCenter,
        location,
        email,
        mobile,
      })
    );
    dispatch(updateHotelImages(images));
    dispatch(
      updateUpdatedHotel({
        _id,
        hotelName,
        minimumRent,
        parkingPrice,
        description,
        distanceFromCityCenter,
        location,
        email,
        mobile,
      })
    );

    navigate("/admin/dashboard/hotels/edit-hotel");
  };

  const handleDelete = async (row: any, admin: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${row.hotelName} hotel!`,
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
        dispatch(deleteHotel({ hotelData: row, admin }));
        toast.success("Hotels deleted successfully");
        setData((prevData: any) => !prevData);
      }
    });
  };

  return (
    <Box>
      <Tooltip title="Edit this hotel">
        <IconButton onClick={() => handleEdit()}>
          <Edit />
        </IconButton>
      </Tooltip>
      {/* <Tooltip title='Delete this room'>
          <IconButton onClick={() => handleDelete(params.row,currentAdmin as any)}>
            <Delete/>
          </IconButton>
      </Tooltip> */}
    </Box>
  );
};

export default HotelsActions;
