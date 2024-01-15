import { ArrowBack, Close, Edit, PasswordOutlined } from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile } from "../../actions/user";
import {
  setAlert,
  updateUserProfile,
} from "../../store/slices/userSlices/userSlice";
import { RootState } from "../../store/types";

interface Profile {
  open?: boolean;
  file?: File | null | undefined;
  profileImage?: string; // Add profileImage property to the Profile interface
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fNameRef = useRef<HTMLInputElement>(null);
  const lNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  const { profile, currentUser } = useSelector(
    (state: RootState) => state.user
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const handleClose = () => {
    dispatch(updateUserProfile({ ...profile, open: false }));
    // navigate('/home')
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isEditMode) {
      const file =
        event.target.files && event.target.files.length > 0
          ? event.target.files[0]
          : null;
      if (file) {
        const profileImage = URL.createObjectURL(file);

        const profileUpdate: Partial<Profile> = {
          file,
          profileImage,
        };
        dispatch(updateUserProfile({ ...profile, ...profileUpdate }));
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event?.preventDefault();

    const showErrorAlert = (message: string) => {
      dispatch(setAlert({ open: true, severity: "error", message }));
    };

    const fields = [
      { ref: fNameRef, label: "First name" },
      { ref: lNameRef, label: "Last name" },
      { ref: emailRef, label: "Email" },
      { ref: mobileRef, label: "Mobile no" },
    ];

    for (const field of fields) {
      const value = field.ref?.current?.value;
      if (!value || value.trim().length === 0) {
        showErrorAlert(`"${field.label}" is required.`);
        return;
      }
    }

    if (
      !fNameRef.current?.value.match(
        /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
      )
    ) {
      showErrorAlert("Please enter a valid first name.");
      return;
    }

    if (
      !lNameRef.current?.value.match(
        /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
      )
    ) {
      showErrorAlert("Please enter a valid last name.");
      return;
    }

    if (
      !emailRef.current?.value.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      showErrorAlert("Please enter a valid email address.");
      return;
    }

    if (!mobileRef.current?.value.match(/^[6-9]\d{9}$/)) {
      showErrorAlert("Please enter a valid mobile number.");
      return;
    }

    try {
      // Perform registration logic
      const firstName = fNameRef.current?.value;
      const lastName = lNameRef.current?.value;
      const email = emailRef.current?.value;
      const mobile = mobileRef.current?.value;

      // Wait for the async thunk to complete
      const result = await updateProfile({
        currentUser,
        updatedFields: {
          firstName,
          lastName,
          email,
          mobile,
          file: profile.file,
        },
      });

      if (result) {
        navigate("/profile");
        dispatch(updateUserProfile({ ...result, open: false }));
        setIsEditMode(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      // Handle errors if necessary
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
          backdropFilter: "blur(5px)",
        }}
        open={profile.open ?? false}
        onClick={handleClose}
      />
      <Dialog
        open={profile?.open ?? false}
        onClose={handleClose}
        sx={{ opacity: "90%" }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          Profile
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              pb: 0,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 5 }}>
            <DialogContentText sx={{ textAlign: "start" }}>
              Profile Image:
            </DialogContentText>
            <DialogContentText sx={{ textAlign: "end" }}>
              <Tooltip title={!isEditMode ? "Edit Profile" : "Back to Profile"}>
                {!isEditMode ? (
                  <Edit
                    onClick={() => {
                      setIsEditMode(true);
                      // navigate("/edit-profile");
                    }}
                  />
                ) : (
                  <ArrowBack
                    onClick={() => {
                      setIsEditMode(false);
                      // navigate("/profile");
                    }}
                  />
                )}
              </Tooltip>
            </DialogContentText>
            <label htmlFor="profileImage">
              <input
                accept="image/*"
                id="profileImage"
                type="file"
                style={{ display: "none" }}
                onChange={handleChange}
                disabled={!isEditMode}
              />
              <Avatar
                src={profile.profileImage}
                sx={{ width: 80, height: 80, cursor: "pointer" }}
              />
            </label>
            <Grid container spacing={2} pt={2}>
              <Grid item xs={6}>
                {/* First Name */}
                <TextField
                  autoFocus
                  margin="normal"
                  variant="standard"
                  id="firstName"
                  label="First name"
                  type="text"
                  inputRef={fNameRef}
                  defaultValue={currentUser?.firstName}
                  fullWidth
                  disabled={!isEditMode}
                />
              </Grid>
              <Grid item xs={6}>
                {/* Last Name */}
                <TextField
                  margin="normal"
                  variant="standard"
                  id="lastName"
                  label="Last name"
                  type="text"
                  fullWidth
                  defaultValue={currentUser?.lastName}
                  inputRef={lNameRef}
                  disabled={!isEditMode}
                />
              </Grid>

              <Grid item xs={6}>
                {/* Email */}
                <TextField
                  margin="normal"
                  variant="standard"
                  id="email"
                  label="Email"
                  type="text"
                  fullWidth
                  defaultValue={currentUser?.email}
                  inputRef={emailRef}
                  disabled={!isEditMode}
                />
              </Grid>
              <Grid item xs={6}>
                {/* Mobile Number */}
                <TextField
                  margin="normal"
                  variant="standard"
                  id="mobile"
                  label="Mobile no"
                  type="text"
                  fullWidth
                  defaultValue={currentUser?.mobile}
                  inputRef={mobileRef}
                  disabled={!isEditMode}
                />
              </Grid>
            </Grid>
          </DialogContent>

          {isEditMode ? (
            <DialogActions sx={{ justifyContent: "center", px: "19px" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: "green" }}
              >
                Update
              </Button>
            </DialogActions>
          ) : (
            ""
          )}
        </form>
        <DialogActions
          sx={{ justifyContent: "center", px: "19px", pb: "25px" }}
        >
          <Button
            onClick={() => {
              handleClose && handleClose();
              navigate("/change-password");
            }}
            disabled={currentUser?.isGoogle}
            variant="contained"
            sx={{
              bgcolor: "black",
              transition: "color border bgColor 0.3s ease",
              "&:hover": {
                bgcolor: "#ffffff",
                color: "#000000",
                border: "1px solid black",
              },
            }}
            endIcon={<PasswordOutlined />}
          >
            Change password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
