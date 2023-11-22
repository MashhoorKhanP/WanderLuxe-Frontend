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

// interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;                  // Comment is passed to the App.tsx
//   profileImage: string;
//   token: string;
//   isGoogle: boolean;
// }

const Home: React.FC = () => {
  // const dispatch = useDispatch();

  // // Initialize user data from local storage
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("currentUser");
  
  //   if (storedUser !== null) {
  //     try {
  //       const currentUser:User = JSON.parse(storedUser);
  //       // Assuming updateUser is synchronous; adjust if it's asynchronous
  //       dispatch(updateUser(currentUser));
  //     } catch (error) {
  //       console.error("Error parsing stored user data:", error);
  //       // Handle the error more gracefully (e.g., show a message, clear local storage)
  //     }
  //   } else {
  //     // Handle the case where storedUser is null (no user data in local storage)
  //   }
  // }, [dispatch]);
  const location = useLocation();

  return (
    <>
      <OtpVerification/>
      <Loading/>
      <Notification/>
      <Login/>
      <Navbar/>
      {location.pathname === '/admin/login' && (<AdminLogin/>)}
    </>
  );
};

export default Home;