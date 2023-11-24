import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import React, {  useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/types";
import { Close, Send } from "@mui/icons-material";
import { loginAdmin } from "../../actions/admin";
import PasswordField from "../user/PasswordField";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { setAlert } from "../../store/slices/userSlice";
import { toast } from "react-toastify";

const AdminLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { currentAdmin} = useSelector((state: RootState) => state.admin);

  useEffect(()=>{
    if(currentAdmin){
      navigate('/admin/dashboard');
    }
  },[navigate,currentAdmin]);


  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();
    console.log('Entered inside admin login handle submit')
    const showErrorAlert = (message: string) => {
      console.log('dispatched alert')
      toast.error(message);
    };

       const fields = [
        { ref: emailRef, label: 'Email' },
        { ref: passwordRef, label: 'Password' },
      ];

      for (const field of fields) {
        const value = field.ref?.current?.value;
        if (!value || value.trim().length === 0) {
          showErrorAlert(`"${field.label}" is required.`);
          return;
        }
      }
  
      if (!emailRef.current?.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        showErrorAlert('Please enter a valid email address.');
        return;
      }
      

    // Perform Login logic
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value ?? '';
    dispatch(loginAdmin({email,password}));
}
    
  return (
    <Dialog open={true}/**onClose={handleClose}*/>
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
        <DialogActions sx={{ justifyContent: "center" ,px:'19px' ,p:'40px'}}>
          <Button type="submit" sx={{width:'50%', fontSize:'16px', bgcolor:'black'}} variant="contained" endIcon={<Send/>}>
            Login
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AdminLogin;
