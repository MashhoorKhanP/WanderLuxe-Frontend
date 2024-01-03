import React from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import Login from "../components/user/Login";
import Notification from "../components/Notification";
import Loading from "../components/Loading";
import OtpVerification from "../components/user/OtpVerification";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import HomeScreen from "./user/home/HomeScreen";
import RoomOverviewScreen from "./user/rooms/RoomOverviewScreen";
import CouponsOverviewScreen from "./user/coupons/CouponsOverviewScreen";
import BookingDetailsScreen from "./user/booking/BookingDetailsScreen";
import WalletHistoryScreen from "./user/wallet/WalletHistoryScreen";
import { NotFound } from "../assets/extraImages";
import ChatScreenUser from "./user/chat/ChatScreenUser";

const Home: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/user/otp-verification" && <OtpVerification />}
      <Loading />
      <Notification />
      <Login />
      <Navbar />
      <HomeScreen />
      <RoomOverviewScreen/>
      <CouponsOverviewScreen/>
      <BookingDetailsScreen/>
      <WalletHistoryScreen/>
      <ChatScreenUser/>
      <Footer />
    </>
  );
};

export default Home;
