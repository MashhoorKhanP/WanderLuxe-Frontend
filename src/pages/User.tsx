import React, { useEffect, useRef } from "react";
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
import ChatScreenUser from "./user/chat/ChatScreenUser";
import { Socket, io } from "socket.io-client";
import { logoutUser } from "../store/slices/userSlices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/types";
import { getBanners } from "../actions/banner";
import { AppDispatch } from "../store/store";
import ForgotPassword from "../components/user/ForgotPassword";

const Home: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const socket = useRef<Socket | null>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    dispatch(getBanners());
  },[dispatch]);

  useEffect(()=>{
    if(!socket.current && currentUser){
      socket.current = io(import.meta.env.VITE_SERVER_URL);
      socket.current.emit('addUser',(currentUser?._id))
      socket.current.on('responseIsBlocked',(data:{isBlocked:boolean})=>{
        if(data.isBlocked){
         dispatch(logoutUser());
        }
      })
      
    }
  },[socket,currentUser])
  return (
    <>
      {location.pathname === "/otp-verification" && <OtpVerification />}
      <Loading />
      <Notification />
      <Login />
      <Navbar />
      <HomeScreen />
      <RoomOverviewScreen/>
      <CouponsOverviewScreen/>
      <BookingDetailsScreen/>
      <WalletHistoryScreen/>
      <ForgotPassword/>
      <ChatScreenUser socket={socket.current}/>
      <Footer />
    </>
  );
};

export default Home;
