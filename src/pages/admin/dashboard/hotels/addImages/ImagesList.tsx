import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store/types";
import { Add, Cancel, Delete } from "@mui/icons-material";
import deleteFile from "../../../../../firebase/deleteFile";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteHotelImages } from "../../../../../store/slices/adminSlices/adminHotelSlice";
import { deleteRoomImages } from "../../../../../store/slices/adminSlices/adminRoomSlice";
import { deleteBannerImages } from "../../../../../store/slices/adminSlices/adminSlice";
import { getBanners, updateBanners } from "../../../../../actions/banner";
import { AppDispatch } from "../../../../../store/store";

const ImagesList: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const banner = useSelector((state: RootState) => state.admin.banners);
  const [bannerText, setBannerText] = useState<string>(banner?.text); // State for the banner text
  const [prevBannerImages, setPrevBannerImages] = useState<any>([]);

  
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const hotelImages = useSelector(
    (state: RootState) => state.adminHotel.hotelImages
  );
  const roomImages = useSelector((state: RootState) => state.adminRoom.roomImages);
  const bannerImages = useSelector((state: RootState) => state.admin.bannerImages);
  useEffect(() => {
    if(!bannerImages.length){
      dispatch(getBanners());
      bannerImages && setPrevBannerImages(bannerImages) 
    }
    console.log('bannerimages from ',bannerImages)
  }, [dispatch]);

  const udpatedHotel = useSelector(
    (state: RootState) => state.adminHotel.updatedHotel
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
        if (
          location.pathname === "/admin/dashboard/hotels/add-hotel" ||
          location.pathname === "/admin/dashboard/hotels/edit-hotel"
        ) {
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
        } else if (
          location.pathname === "/admin/dashboard/rooms/add-room" ||
          location.pathname === "/admin/dashboard/rooms/edit-room"
        ) {
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
        }else if (
          location.pathname === "/admin/dashboard/banners"
        ) {
          dispatch(deleteBannerImages(image));
          const imageName = image
            ?.split(`${currentAdminId}%2F`)[1]
            ?.split("?")[0];
          try {
            await deleteFile(`banners/${currentAdminId}/${imageName}`);
            toast.success("File deleted successfully");
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
  };
  const images:any =
    location.pathname === "/admin/dashboard/hotels/add-hotel" ||
    location.pathname === "/admin/dashboard/hotels/edit-hotel"
      ? hotelImages
      : location.pathname === "/admin/dashboard/rooms/add-room" ||
      location.pathname === "/admin/dashboard/rooms/edit-room"?  roomImages
      :"/admin/dashboard/rooms/edit-room" ? bannerImages : ''

  const handleSubmit = async() => {
    const imagesChanged = !arraysAreEqual(prevBannerImages, bannerImages);
    if (imagesChanged) {
  
       const result = await updateBanners({updatedBanners:{
        _id:banner._id as string,
        images:bannerImages as [],
        text: bannerText,
       }})
      if(result){
        setPrevBannerImages(bannerImages);
        toast.success('Banner updated successfully');
      }
    } else {
      // No changes, display a message or handle accordingly
      toast.info('No changes to update banner!');
    }
  }
  
  const arraysAreEqual = (arr1: string[], arr2: string[]) => {
  
    return (
      arr1.length === arr2.length &&
      arr1.every((value) => arr2.includes(value))
    );
  };
  return (
    <>
    <ImageList
      rowHeight={250}
      sx={{
        "& .MuiImageList-root": {
          gridTemplateColumns:
            "repeat(auto-fill, minmax(150px, 1fr)) !important", // Adjust the width here
        },
      }}
    >
      {images.map((image: string, index:number) => (
        <ImageListItem key={index} cols={1} rows={1} sx={{ mt: "25px" }}>
          <img
            src={image}
            alt="hotels"
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
      <Box
        display="flex"
        alignItems="center"
        padding={2}
        flexDirection="row" // Center vertically
        width="100%"
      >
          <Stack
            sx={{
              alignItems: "center",
              justifyContent: "center",
              pt: 5,
              gap: 4,
            }}
            direction="row" 
            width={'100%'}
            >
            <TextField
              multiline
              label="Banner Text"
              variant="outlined"
              sx={{
                width:'50%'
              }}
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              />
              {(!arraysAreEqual(prevBannerImages, bannerImages) && bannerImages.length === 4 || bannerText !== banner?.text) && (
             <Button
          variant="contained"
          endIcon={<Add />}
          onClick={handleSubmit}
          disabled={!bannerText}
        >
          UPDATE BANNER
        </Button>
          )}
          <Button
      variant="outlined"
      style={{ borderColor: "red", color: "red" }}
      endIcon={<Cancel />}
      onClick={() => navigate(-1)}
    >
      CANCEL
    </Button>
          </Stack>
  
      </Box>
    </>
  );
};

export default ImagesList;
