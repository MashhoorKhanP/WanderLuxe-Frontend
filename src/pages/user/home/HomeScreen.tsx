import React,{useEffect, useRef} from "react";
import BackgroundImage from "../../../../src/assets/backgroundImage.jpg";
import { HomeImage1, NotFound } from "../../../assets/extraImages";
import { Box, Button } from "@mui/material";
import { CorporateFare,  TravelExplore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { getHotels } from "../../../actions/hotel";
import MapScreen from "../map/MapScreen";
import HotelListScreen from "../hotels/HotelListScreen";
import RoomListScreen from "../rooms/RoomListScreen";
import { getRooms } from "../../../actions/room";
import WishListScreen from "../wishlist/WishlistScreen";
import BookingScreen from "../booking/BookingScreen";
import ChangePasswordScreen from "../password/ChangePasswordScreen";
import PaymentSuccessScreen from "../booking/PaymentSuccessScreen";
import PaymentFailedScreen from "../booking/PaymentFailedScreen";
import MyBookingsScreen from "../booking/MyBookingsScreen";
import MyWalletScreen from "../wallet/MyWalletScreen";


const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const handleFindHotels = () => {
    navigate("/user/find-hotels");
    dispatch(getHotels());
  };

  const handleViewHotels = () => {
    navigate("/user/view-hotels");
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
      ) : location.pathname === "/user/view-rooms" ? (
        <>
          <RoomListScreen />
        </>
      ) : location.pathname === "/user/wishlist" ? (
        <>
          <WishListScreen />
        </>
      ) : location.pathname === "/user/book-room" ? (
        <>
          <BookingScreen />
        </>
      ): location.pathname === "/user/payment-success" ? (
        <>
          <PaymentSuccessScreen />
        </>
      ) : location.pathname === "/user/payment-failed" ? (
        <>
          <PaymentFailedScreen />
        </>
      ): location.pathname === "/user/change-password" ? (
        <>
          <ChangePasswordScreen />
        </>
      ) : location.pathname === "/user/my-bookings" ? (
        <>
          <MyBookingsScreen/>
        </>
      ): location.pathname === "/user/my-wallet" ? (
        <>
          <MyWalletScreen/>
        </>
      ): location.pathname === "/404" ? (
        <>
          <NotFound/>
        </>
      ): (
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
            <Button
              variant="outlined"
              onClick={handleViewHotels}
              sx={{ borderColor: "white", color: "white" }}
              endIcon={<CorporateFare />}
            >
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
            <img
              src={HomeImage1}
              style={{ width: "50%" }}
              alt="HomeImage1"
             
            />
            <img
              src={BackgroundImage}
              style={{ width: "50%" }}
              alt="BackgroundImage"
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default HomeScreen;
