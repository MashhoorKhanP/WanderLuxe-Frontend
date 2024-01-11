import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutAdmin } from "../../store/slices/adminSlices/adminSlice";
import { logoutUser } from "../../store/slices/userSlices/userSlice";
import { AppDispatch } from "../../store/store";

const useCheckToken = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const warningShownRef = useRef(false);
  const currentUserToken = localStorage.getItem("UserToken");
  const currentAdminToken = localStorage.getItem("AdminToken");

  useEffect(() => {
    if (currentUserToken) {
      const decodedUserToken: any = jwtDecode(currentUserToken);
      if (
        decodedUserToken.exp * 1000 < new Date().getTime() &&
        !warningShownRef.current
      ) {
        warningShownRef.current = true;
        toast.warning("User session timed out. Please log in again.");
        dispatch(logoutUser());
        navigate("/home");
      }
    }

    if (currentAdminToken) {
      const decodedAdminToken: any = jwtDecode(currentAdminToken);

      if (
        decodedAdminToken.exp * 1000 < new Date().getTime() &&
        !warningShownRef.current
      ) {
        warningShownRef.current = true;
        toast.warning("Admin session timed out. Please log in again.");
        dispatch(logoutAdmin());
        navigate("/admin/login");
      }
    }
  }, [currentUserToken, currentAdminToken, dispatch, navigate]);

  return null;
};

export default useCheckToken;
