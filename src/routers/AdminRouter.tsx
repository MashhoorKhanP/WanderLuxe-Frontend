import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AdminPrivateRoute from "../components/AdminPrivateRoute";
import AdminLogin from "../components/admin/Login";
import PageNotFound from "../components/common/NotFound";
import Admin from "../pages/Admin";
import { updateAdmin } from "../store/slices/adminSlices/adminSlice";

interface Admin {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  token: string;
}

const AdminRouter: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      navigate("/admin/login");
      // dispatch(logoutAdmin());
      // Handle the case where storedUser is null (no user data in local storage)
    }
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/*" element={<AdminLogin />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="" element={<Navigate to="/admin/login" />} />
      <Route path="*" element={<PageNotFound />} />

      <Route path="" element={<AdminPrivateRoute />}>
        <Route path="dashboard/*" element={<Admin />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
