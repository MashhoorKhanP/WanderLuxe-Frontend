import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearAlert } from "../store/slices/userSlices/userSlice";
import { RootState } from "../store/types";

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state: RootState) => state.user.alert);
  const handleClose = (
    event: React.SyntheticEvent | MouseEvent,
    reason?: string
  ) => {
    if (reason == "clickaway") return;
    dispatch(clearAlert());
  };
  return (
    <Snackbar
      open={alert !== null}
      autoHideDuration={3000}
      onClose={(event, reason) =>
        handleClose(event as React.SyntheticEvent | MouseEvent, reason)
      }
      message={alert?.message || ""}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={alert?.severity}
        sx={{ width: "100%" }}
        variant="filled"
        elevation={6}
      >
        {alert?.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
