import React, { useEffect } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import Home from "../pages/User"
import AdminLogin from "../components/admin/Login"
import Dashboard from "../pages/admin/dashboard/Dashboard"
import Admin from "../pages/Admin"
import { useDispatch } from "react-redux"
import { logoutUser, updateUser } from "../store/slices/userSlice"
import { logoutAdmin, updateAdmin } from "../store/slices/adminSlice"


interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string; // Comment is passed from Home.tsx
  profileImage: string;
  token: string;
  isGoogle: boolean;
}

interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  token: string;
}

const UserRouter :React.FC =() => {
  const dispatch = useDispatch();
  const navigate =  useNavigate();
  useEffect(() => {
    const storedUser: object | any = localStorage.getItem("currentUser");
    if (storedUser !== null) {
      try {
        const currentUser: User = JSON.parse(storedUser);
        // Assuming updateUser is synchronous; adjust if it's asynchronous
        dispatch(updateUser
          (currentUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Handle the error more gracefully (e.g., show a message, clear local storage)
      }
    } else if (storedUser === null || storedUser === undefined) {
      navigate('/user/home');
      dispatch(logoutUser());
      // Handle the case where storedUser is null (no user data in local storage)
    }
  }, [dispatch]);
  return(
    <Routes>
      <Route path="home" element={<Home/>}/>
      <Route path="login-register" element={<Home/>}/>
      <Route path="login" element={<Home/>}/>
      <Route path="register" element={<Home/>}/>
      <Route path="google-login" element={<Home/>}/>
      <Route path="profile" element={<Home/>}/>
      <Route path="edit-profile" element={<Home/>}/>
      <Route path="otp-verification" element={<Home/>}/>

    </Routes>
  )
}

const AdminRouter :React.FC =() => {
  const dispatch = useDispatch();
  const navigate =  useNavigate();
  useEffect(() => {
    const storedAdmin: object | any = localStorage.getItem("currentAdmin");
    if (storedAdmin !== null) {
      try {
        const currentAdmin: Admin = JSON.parse(storedAdmin);
        // Assuming updateUser is synchronous; adjust if it's asynchronous
        dispatch(updateAdmin(currentAdmin));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Handle the error more gracefully (e.g., show a message, clear local storage)
      }
    } else if (storedAdmin === null || storedAdmin === undefined) {
      navigate('/admin/login')
      dispatch(logoutAdmin());
      // Handle the case where storedUser is null (no user data in local storage)
    }
  }, [dispatch]);
  return(
    <Routes>
      <Route path="/*" element={<AdminLogin/>}/>
      <Route path="/login" element={<AdminLogin/>} />
      <Route path="*" element={<Navigate to="/admin/login"/>}/>
      {/* <Route path="dashboard" element={<Dashboard/>}/> */}
      <Route path="dashboard/*" element={<Admin />} />
    </Routes>
  )
  
}

const AppRouter : React.FC = () => {
   return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/user/*" element={<UserRouter/>}/>
      <Route path="/admin/*" element = {<AdminRouter/>}/>
    </Routes>
   )
}

export default AppRouter;