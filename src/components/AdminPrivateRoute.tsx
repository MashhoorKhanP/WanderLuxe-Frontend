import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";


const AdminPrivateRoute: React.FC = () => {
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  return currentAdmin ? <Outlet/> : <Navigate to = '/admin/login' replace></Navigate>
}

export default AdminPrivateRoute;