import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Outlet, useNavigate } from "react-router-dom";
import { setOpenLogin } from "../store/slices/userSlices/userSlice";
import { toast } from "react-toastify";

const UserPrivateRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

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
