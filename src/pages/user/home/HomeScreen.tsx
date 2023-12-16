import React from "react";
import BackgroundImage from "../../../../src/assets/backgroundImage.jpg";
import { HomeImage1 } from "../../../assets/extraImages";
import { Box, Button, TextField } from "@mui/material";
import { CorporateFare, LockTwoTone, TravelExplore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { getHotels } from "../../../actions/hotel";
import MapScreen from "../map/MapScreen";
import HotelListScreen from "../hotels/HotelListScreen";
import RoomListScreen from "../rooms/RoomListScreen";
import { getRooms } from "../../../actions/room";
import RoomOverviewScreen from "../rooms/RoomOverviewScreen";
import WishListScreen from "../wishlist/WishlistScreen";
import BookingScreen from "../booking/BookingScreen";
import ChangePasswordScreen from "../password/ChangePasswordScreen";

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const handleFindHotels = () => {
    navigate("/user/find-hotels");
    dispatch(getHotels());
  };

  const handleViewHotels = () => {
    navigate('/user/view-hotels');
    dispatch(getRooms());
  };

  return (
    <>
      {location.pathname === "/user/find-hotels" ? (
        <MapScreen />
      ) : location.pathname === "/user/view-hotels" ? (
        <>
          <HotelListScreen />
        </>
      ): location.pathname === "/user/view-rooms" ? (
        <>
          <RoomListScreen/>
        </>
      ): location.pathname === "/user/wishlist" ? (
        <>
          <WishListScreen/>
        </>
      ) : location.pathname === "/user/book-room" ? (
        <>
          <BookingScreen/>
        </>
      ): location.pathname === "/user/change-password" ? (
        <>
          <ChangePasswordScreen/>
        </>
      ) : (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              position: "absolute",
              width: "100%",
              top: "10%",
              right: "20px",
              gap: 1,
              transform: "translateY(-50%)",
            }}
          >
            <Button variant='outlined' onClick={handleViewHotels}  sx={{ borderColor: 'white', color: 'white' }} endIcon={<CorporateFare />}>
              View Hotels
            </Button>
            <Button
              variant="outlined"
              onClick={handleFindHotels}
              sx={{ borderColor: "white", color: "white" }}
              endIcon={<TravelExplore />}
            >
              Find Hotels
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              zIndex: -1,
            }}
          >
            <img src={HomeImage1} style={{ width: "50%" }} alt="HomeImage1"  loading="lazy"/>
            <img
              src={BackgroundImage}
              style={{ width: "50%" }}
              alt="BackgroundImage" loading="lazy"
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default HomeScreen;
