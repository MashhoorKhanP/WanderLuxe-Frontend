import React, { useEffect } from "react";
import '../App.css';
import Navbar from "../components/Navbar";
import Login from "../components/user/Login";
import Notification from "../components/Notification";
import Loading from "../components/Loading";
import OtpVerification from "../components/user/OtpVerification";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import HomeScreen from "./user/home/HomeScreen";
import MapScreen from "./user/map/MapScreen";

const Home: React.FC = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname==='/user/otp-verification' &&<OtpVerification />}
      <Loading />
      <Notification />
      <Login />
      <Navbar />
      <HomeScreen/>
      <Footer />
    </>
  );
};

export default Home;
