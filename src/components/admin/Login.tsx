import { Send } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAdmin } from "../../actions/admin";
import { AppDispatch } from "../../store/store";
import { RootState } from "../../store/types";
import PasswordField from "../user/PasswordField";

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    if (currentAdmin) {
      navigate("/admin/dashboard/home");
    }
  }, [navigate, currentAdmin]);

  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();
    const showErrorAlert = (message: string) => {
      toast.error(message);
    };

    const fields = [
      { ref: emailRef, label: "Email" },
      { ref: passwordRef, label: "Password" },
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

    // Perform Login logic
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value ?? "";
    dispatch(loginAdmin({ email, password }));
  };

  return (
    <>
      <Dialog open={true} /**onClose={handleClose}*/>
        <DialogTitle>
          Admin login
          {/* <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton> */}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <DialogContentText>
              Please fill your details in the fields below:
            </DialogContentText>
            <>
              {/* Email */}
              <TextField
                margin="normal"
                variant="standard"
                id="email"
                label="Email"
                type="email"
                fullWidth
                inputRef={emailRef}
              />
              {/* Password */}
              <PasswordField {...{ passwordRef }} />
            </>
          </DialogContent>
          <DialogActions
            sx={{ justifyContent: "center", px: "19px", p: "40px" }}
          >
            <Button
              type="submit"
              sx={{ width: "50%", fontSize: "16px", bgcolor: "black" }}
              variant="contained"
              endIcon={<Send />}
            >
              Login
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AdminLogin;
