import { Close } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../actions/user";
import {
  closeForgotPasswordScreen,
  setAlert,
  setOpenLogin,
  setOpenOTPVerification,
} from "../../store/slices/userSlices/userSlice";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/types";
import PasswordField from "./PasswordField";

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const isOpen = useSelector(
    (state: RootState) => state.user.isForgotPasswordOpen
  );

  const handleClose = () => {
    dispatch(closeForgotPasswordScreen());
    dispatch(setOpenLogin(true));
  };

  const handleChangePassword = (event: React.FormEvent) => {
    event?.preventDefault();

    const showErrorAlert = (message: string) => {
      dispatch(setAlert({ open: true, severity: "error", message }));
    };

    const fields = [
      { ref: emailRef, label: "Email" },
      { ref: newPasswordRef, label: "New Password" },
      { ref: confirmNewPasswordRef, label: "Confirm Password" },
    ];

    for (const field of fields) {
      const value = field.ref?.current?.value;
      if (!value || value.trim().length === 0) {
        showErrorAlert(`"${field.label}" is required.`);
        return;
      }
    }

    if (
      !emailRef.current?.value.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      showErrorAlert("Please enter a valid email address.");
      return;
    }

    if (!newPasswordRef.current?.value.match(/^(?=.*[0-9]).{6,}$/)) {
      showErrorAlert(
        "Please provide a strong password, Minimum 6 length with number & chara!"
      );
      return;
    }

    if (confirmNewPasswordRef.current?.value.trim().length === 0) {
      showErrorAlert("Please confirm your password.");
      return;
    }

    if (
      newPasswordRef.current?.value !== confirmNewPasswordRef.current?.value
    ) {
      showErrorAlert("Confirmed password do not match.");
      return;
    }

    const email: string = emailRef.current?.value;
    const newPassword: string = newPasswordRef.current?.value;

    const result = dispatch(
      forgotPassword({
        forgotPasswordData: {
          email: email as string,
          newPassword,
        },
      })
    );
    const resultUnwrapped = result.unwrap();
    resultUnwrapped.then((thenResult) => {
      // Check if thenResult is not null or undefined
      if (thenResult !== null) {
        dispatch(closeForgotPasswordScreen());
        navigate(`/otp-verification?forgotPassword=${true}`);
        dispatch(setOpenOTPVerification(true));
      }
    });
  };
  return (
    <>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
          backdropFilter: "blur(5px)",
        }}
        open={isOpen}
        onClick={handleClose}
      />
      <Dialog open={isOpen} onClose={handleClose} sx={{ opacity: "90%" }}>
        <DialogTitle>
          Forgot Password
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
        <DialogContent>
          <DialogContentText>
            Please fill the fields below to change password:
          </DialogContentText>
          <Box p={4} display="flex" justifyContent="center">
            <Grid container xs={12} sm={12} md={12} justifyContent="center">
              <Grid item>
                {/* Box 1 */}
                <Box sx={{ width: "100%" }} padding={2}>
                  <TextField
                    autoFocus={isOpen}
                    margin="normal"
                    variant="standard"
                    id="email"
                    label="Email"
                    type="text"
                    fullWidth
                    inputRef={emailRef}
                  />
                  <PasswordField
                    {...{
                      passwordRef: newPasswordRef,
                      id: "newPassword",
                      label: "New Password",
                    }}
                  />
                  <PasswordField
                    {...{
                      passwordRef: confirmNewPasswordRef,
                      id: "confirmPassword",
                      label: "Confirm New Password",
                    }}
                  />

                  {/* Box for the button */}
                  <Box
                    display="flex"
                    paddingTop={5}
                    paddingLeft={1}
                    paddingRight={1}
                    gap={1}
                    flexDirection="row"
                  >
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      sx={{
                        flex: 1,
                        p: 1,
                        borderRadius: 0,
                        bgcolor: "black",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color border bgColor 0.3s ease",
                        "&:hover": {
                          bgcolor: "#d1d1d1",
                          color: "#000000",
                          border: "1px solid black",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      variant="outlined"
                      sx={{
                        flex: 1,
                        p: 1,
                        borderRadius: 0,
                        bgcolor: "black",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color border bgColor 0.3s ease",
                        "&:hover": {
                          bgcolor: "#d1d1d1",
                          color: "#000000",
                          border: "1px solid black",
                        },
                      }}
                    >
                      Change Password
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>{" "}
    </>
  );
};

export default ForgotPassword;
