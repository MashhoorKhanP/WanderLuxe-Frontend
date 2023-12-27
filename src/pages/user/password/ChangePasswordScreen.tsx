import React, { useRef } from "react";
import PasswordField from "../../../components/user/PasswordField";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { setAlert } from "../../../store/slices/userSlices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/types";
import { changePassword } from "../../../actions/user";
import { AppDispatch } from "../../../store/store";
import { toast } from "react-toastify";

const ChangePasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleChangePassword = (event: React.FormEvent) => {
    event?.preventDefault();

    const showErrorAlert = (message: string) => {
      dispatch(setAlert({ open: true, severity: "error", message }));
    };

    const fields = [
      { ref: currentPasswordRef, label: "Current Password" },
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

    if (currentPasswordRef.current?.value === newPasswordRef.current?.value) {
      showErrorAlert(
        "New passwords should be different from current password!"
      );
      return;
    }

    const currentPassword = currentPasswordRef.current?.value as string;
    const newPassword: string = newPasswordRef.current?.value;

    const result = dispatch(
      changePassword({
        changePasswordData: {
          userId: currentUser?._id as string,
          currentPassword,
          newPassword,
        },
      })
    );
    const resultUnwrapped = result.unwrap();
    resultUnwrapped.then((thenResult) => {

      // Check if thenResult is not null or undefined
      if (thenResult !== null) {
        toast.success("Password changed successfully!");
      }
    });
  };
  return (
    <Container sx={{ width: "100%" }}>
      <Box p={4} display="flex" justifyContent="center">
        <Grid container xs={12} sm={12} md={6} justifyContent="center">
          <Grid item border={1}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              paddingTop={4}
            >
              <Typography variant="h5" fontWeight="bold">
                Change Password
              </Typography>
            </Box>
            {/* Box 1 */}
            <Box sx={{ width: "100%" }} padding={6}>
              <Typography>
                Please fill the fields below to change password:
              </Typography>
              <PasswordField
                {...{
                  passwordRef: currentPasswordRef,
                  id: "currentPassword",
                  label: "Current Password",
                }}
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
                  onClick={() => navigate("/user/home")}
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
    </Container>
  );
};

export default ChangePasswordScreen;
