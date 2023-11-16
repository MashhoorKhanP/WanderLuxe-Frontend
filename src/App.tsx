import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/user/Login";
import Notification from "./components/Notification";
import Loading from "./components/Loading";
import { useDispatch } from "react-redux";
import { updateUser } from "./store/slices/userSlice";
import OtpVerification from "./components/user/OtpVerification";

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Initialize user data from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
     // Default to an empty string if null
     if (storedUser !== null) {
      const currentUser = JSON.parse(storedUser);
      dispatch(updateUser(currentUser));
    }
  }, [dispatch]);

  return (
    <>
      <OtpVerification/>
      <Loading/>
      <Notification/>
      <Login/>
      <Navbar/>
    </>
  );
};

export default App;

