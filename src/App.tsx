import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Home from "./pages/admin/Home";
import { useDispatch } from "react-redux";
import { updateUser } from "../../frontend/src/store/slices/userSlice";
import AdminLogin from "./components/admin/Login";
import { updateAdmin } from "./store/slices/adminSlice";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string; // Comment is passed from Home.tsx
  profileImage: string;
  token: string;
  isGoogle: boolean;
}

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  token: string;
}

const App: React.FC = () => {
  const dispatch = useDispatch();

  // Initialize user data from local storage
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
    } else {
      // Handle the case where storedUser is null (no user data in local storage)
    }
  }, [dispatch]);

  useEffect(() => {
    const storedAdmin: object | any = localStorage.getItem("currentAdmin");
    if (storedAdmin !== null) {
      try {
        const currentUser: User = JSON.parse(storedAdmin);
        // Assuming updateUser is synchronous; adjust if it's asynchronous
        dispatch(updateAdmin(currentUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Handle the error more gracefully (e.g., show a message, clear local storage)
      }
    } else {
      // Handle the case where storedAdmin is null (no user data in local storage)
    }
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
