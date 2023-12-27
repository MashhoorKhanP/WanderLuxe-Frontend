import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminPrivateRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAdmin  = localStorage.getItem('currentAdmin');
  console.log("current Admin", currentAdmin);
  useEffect(() => {
    if (!currentAdmin) {
      navigate("/admin/login");
      toast.warning(
        "Please log in to your admin account to perform this action!"
      );
    }
  }, [currentAdmin, dispatch, navigate]);

  return currentAdmin ? <Outlet /> : null;
};

export default AdminPrivateRoute;
