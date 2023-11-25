import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/types";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../../store/slices/userSlice";
import { logoutAdmin } from "../../store/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useCheckToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const warningShownRef = useRef(false);
  const currentUserToken = localStorage.getItem("UserToken");
  const currentAdminToken = localStorage.getItem("AdminToken"); //change currentAdmin make slice

  useEffect(() => {
    let token;
    let logoutAction;

    if (currentUserToken) {
      token = currentUserToken;
      logoutAction = logoutUser;
    } else if (currentAdminToken) {
      token = currentAdminToken;
      logoutAction = logoutAdmin;
    } else {
      // No token found, nothing to check
      return;
    }

    const decodedToken: any = jwtDecode(token);
    if (
      decodedToken.exp * 1000 < new Date().getTime() &&
      !warningShownRef.current
    ) {
      warningShownRef.current = true;
      toast.warning("Sessions timeout, Please log in again");
      dispatch(logoutAction());
      if (logoutAction === logoutAdmin) {
        navigate("/admin/login");
      }
    }
  }, [currentUserToken, currentAdminToken, dispatch, navigate]);

  return null;
};

export default useCheckToken;
