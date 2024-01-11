import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setOpenLogin } from "../store/slices/userSlices/userSlice";

const UserPrivateRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      dispatch(setOpenLogin(true));
      toast.warning("Please log in to your account to perform this action!");
    }
  }, [currentUser, dispatch, navigate]);

  return currentUser ? <Outlet /> : null;
};

export default UserPrivateRoute;
