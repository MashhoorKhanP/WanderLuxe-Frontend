import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Navigate, Outlet } from "react-router-dom";
import { setOpenLogin } from '../store/slices/userSlice';
import { toast } from 'react-toastify';


const UserPrivateRoute: React.FC = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser ? <Outlet/> : <Navigate to = '/' replace></Navigate> && dispatch(setOpenLogin(true)) && toast.warning('Please login in to your account perform this action!')
}

export default UserPrivateRoute;