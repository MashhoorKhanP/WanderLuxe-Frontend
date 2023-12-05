import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";


const UserPrivateRoute: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser ? <Outlet/> : <Navigate to = '/' replace></Navigate>
}

export default UserPrivateRoute;