import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import {
  setAlert,
  setCloseOTPVerification,
} from "../../store/slices/userSlices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/types";
import { MuiOtpInput } from "mui-one-time-password-input";
import { AppDispatch } from "../../store/store";
import { resendOTP, verifyUser } from "../../actions/user";
import { useNavigate } from "react-router-dom";

const OtpVerification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const openOtpVerification = useSelector(
    (state: RootState) => state.user.openOTPVerification
  );
  const userState = useSelector((state: RootState) => state.user); // Get user state
  const otpRef = useRef<HTMLInputElement>(null);

  const currentUserEmail = userState.currentUser?.email;

  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otpValue, setOTPValue] = useState<string>("");

  const handleOTPChange = (value: string) => {
    setOTPValue(value);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResendDisabled(false); // Set resendDisabled when timer reaches 0
      clearInterval(interval); // Stop the interval to prevent further updates
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      // Dispatch the resendOTP action and wait for the result
      const result = await dispatch(resendOTP(currentUserEmail || ""));

      // Handle the result as needed (perhaps show a success message)
      console.log("Resend OTP Result:", result);

      // Reset the timer to its initial value
      setTimer(60);
    } catch (error) {
      // Handle any errors that occurred during the resendOTP action
      console.error("Error resending OTP:", error);
    } finally {
      // Enable the Resend OTP button after a delay (if needed)
      setResendDisabled(true);
    }
  };

  const handleClose = () => {
    dispatch(setCloseOTPVerification());
    navigate("/user/home");
  };

  const handleVerifyOTP = (event: React.FormEvent) => {
    event.preventDefault();

    if (otpValue.trim().length === 0) {
      dispatch(
        setAlert({
          open: true,
          severity: "error",
          message: "OTP field should not be empty!",
        })
      );
      return;
    }

    if (!/^\d{4}$/.test(otpValue)) {
      dispatch(
        setAlert({
          open: true,
          severity: "error",
          message: "Please enter a valid OTP (numeric characters only)!",
        })
      );
      return;
    }

    try {
      dispatch(verifyUser({ otp: parseInt(otpValue) }));
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <Dialog
      open={openOtpVerification}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          // Set 'open' to false, however you would do that with your particular code.
          dispatch(setCloseOTPVerification());
        }
      }}
    >
      <DialogTitle>
        OTP Verification
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleVerifyOTP}>
        <DialogContent>
          <DialogContentText>
            Please verify the OTP send to your email:
          </DialogContentText>
          <Grid style={{ paddingTop: "20px" }}>
            <Box
              sx={{
                paddingTop: "20px",
                width: "300px",
                padding: "5px",
                margin: "auto",
              }}
            >
              <MuiOtpInput
                autoFocus
                margin="normal"
                id="otp"
                ref={otpRef}
                onChange={handleOTPChange}
                value={otpValue}
              />
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions
          style={{ paddingBottom: "20px" }}
          sx={{ justifyContent: "center", px: "19px" }}
        >
          <Button type="submit" variant="contained" disabled={!resendDisabled}>
            Verify
          </Button>
        </DialogActions>
      </form>
      <DialogActions
        style={{ justifyContent: "center", paddingBottom: "24px" }}
      >
        {timer > 0 ? (
          <span style={{ fontWeight: "500" }}>
            Resend OTP in {timer} seconds
          </span>
        ) : (
          <Button onClick={handleResend} disabled={resendDisabled}>
            Resend OTP
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OtpVerification;
