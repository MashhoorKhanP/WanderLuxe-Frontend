import React, { useEffect } from "react";
import "../../App.css";
import Navbar from "../../components/Navbar";
import Login from "../../components/user/Login";
import Notification from "../../components/Notification";
import Loading from "../../components/Loading";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/userSlice";
import OtpVerification from "../../components/user/OtpVerification";
import AdminLogin from "../../components/admin/Login";
import { useLocation } from "react-router-dom";

const Home: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <OtpVerification />
      <Loading />
      <Notification />
      <Login />
      <Navbar />
      {location.pathname === "/admin/login" && <AdminLogin />}
    </>
  );
};

export default Home;
