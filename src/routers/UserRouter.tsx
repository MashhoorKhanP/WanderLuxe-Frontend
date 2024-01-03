import React, { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/User";
import { useDispatch } from "react-redux";
import { logoutUser, updateUser } from "../store/slices/userSlices/userSlice";
import UserPrivateRoute from "../components/UserPrivateRoute";
import PageNotFound from "../components/common/NotFound";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string; // Comment is passed from Home.tsx
  profileImage: string;
  token: string;
  isGoogle: boolean;
}

const UserRouter: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser: object | any = localStorage.getItem("currentUser");
    if (storedUser !== null) {
      try {
        const currentUser: User = JSON.parse(storedUser);
        // Assuming updateUser is synchronous; adjust if it's asynchronous
        dispatch(updateUser(currentUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Handle the error more gracefully (e.g., show a message, clear local storage)
      }
    } else if (storedUser === null || storedUser === undefined) {
      navigate("/user/home");
      // dispatch(logoutUser());
      // Handle the case where storedUser is null (no user data in local storage)
    }
  }, [dispatch]);
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="login-register" element={<Home />} />
      <Route path="login" element={<Home />} />
      <Route path="register" element={<Home />} />
      <Route path="google-login" element={<Home />} />
      <Route path="profile" element={<Home />} />
      <Route path="otp-verification" element={<Home />} />
      <Route path="find-hotels" element={<Home />} />
      <Route path="view-hotels" element={<Home />} />
      <Route path="view-rooms" element={<Home />} />
      <Route path="*" element={<Navigate to="404" />} />
      {/* Create a specific 404 page */}
      <Route path="404" element={<PageNotFound />} />
      {/* <Route path='view-rooms/room-overview' element={<Home/>}/> */}

      <Route path="" element={<UserPrivateRoute />}>
        <Route path="edit-profile" element={<Home />} />
        <Route path="change-password" element={<Home />} />
        <Route path="wishlist" element={<Home />} />
        <Route path="book-room" element={<Home />} />
        <Route path='payment-success' element={<Home/>}/>
        <Route path='payment-failed' element={<Home/>}/>
        <Route path='my-bookings' element={<Home/>}/>
        <Route path='my-wallet' element={<Home/>}/>
      </Route>
    </Routes>
  );
};

export default UserRouter;
