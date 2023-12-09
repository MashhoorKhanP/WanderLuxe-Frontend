import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/types";
import { Cancel, Delete } from "@mui/icons-material";
import {
  deleteHotelImages,
  deleteRoomImages,
  updateDeletedHotelImages,
} from "../../../../../store/slices/adminSlice";
import deleteFile from "../../../../../firebase/deleteFile";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const ImagesList: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const hotelImages = useSelector(
    (state: RootState) => state.admin.hotelImages
  );

  const roomImages = useSelector((state: RootState) => state.admin.roomImages);
  
  const udpatedHotel = useSelector(
    (state: RootState) => state.admin.updatedHotel
  );
  const currentAdminId = currentAdmin?._id;

  const handleDelete = async (image: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this file!",
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
        // if(udpatedHotel) return;
        // dispatch(updateDeletedHotelImages([image]))
        if (location.pathname === "/admin/dashboard/hotels/add-hotel" || location.pathname === "/admin/dashboard/hotels/edit-hotel") {
          dispatch(deleteHotelImages(image));
          const imageName = image
            ?.split(`${currentAdminId}%2F`)[1]
            ?.split("?")[0];
          try {
            await deleteFile(`hotels/${currentAdminId}/${imageName}`);
            toast.success("File deleted successfully");
          } catch (error) {
            console.log(error);
          }
        } else if (location.pathname === "/admin/dashboard/rooms/add-room" || location.pathname === "/admin/dashboard/rooms/edit-room") {
          dispatch(deleteRoomImages(image));
          const imageName = image
            ?.split(`${currentAdminId}%2F`)[1]
            ?.split("?")[0];
          try {
            await deleteFile(`rooms/${currentAdminId}/${imageName}`);
            toast.success("File deleted successfully");
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
  };
  const images = location.pathname === "/admin/dashboard/hotels/add-hotel" || location.pathname === "/admin/dashboard/hotels/edit-hotel" ? hotelImages : roomImages;
  return (
    <ImageList
      rowHeight={250}
      sx={{
        "& .MuiImageList-root": {
          gridTemplateColumns:
            "repeat(auto-fill, minmax(150px, 1fr)) !important", // Adjust the width here
        },
      }}
    >
      {images.map((image, index) => (
        <ImageListItem key={index} cols={1} rows={1} sx={{ mt: "25px" }}>
          <img
            src={image}
            alt="hotels"
            loading="lazy"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
          <ImageListItemBar
            position="top"
            sx={{
              background:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0) 100%)",
            }}
            actionIcon={
              <IconButton
                sx={{ color: "white" }}
                onClick={() => handleDelete(image)}
              >
                <Cancel />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default ImagesList;
