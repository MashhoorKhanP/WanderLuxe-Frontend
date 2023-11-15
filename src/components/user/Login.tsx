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
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlert, setCloseLogin, setOpenLogin, startLoading, stopLoading } from "../../store/slices/userSlice";
import { RootState } from "../../store/types";
import { Close, Send } from "@mui/icons-material";
import PasswordField from "./PasswordField";
import GoogleOneTapLogin from "./GoogleOneTapLogin";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const openLogin = useSelector((state: RootState) => state.user.openLogin);
  const [title, setTitle] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const fNameRef = useRef<HTMLInputElement>(null);
  const lNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleOpenLogin = () => {
    dispatch(setOpenLogin(true));
  };

  const handleClose = () => {
    dispatch(setCloseLogin());
  };

  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();
    //testing Loading
    dispatch(startLoading());

    setTimeout(() => {
      dispatch(stopLoading());
    },5000);
    
    //testing Notification
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;
    if(password !== confirmPassword){
      dispatch(setAlert({open:true,severity:'error',message:'Passwords do not match'}));
    }
  };
  
  useEffect(() => {
    isRegister ? setTitle('Register') : setTitle('Login');
  },[isRegister])
  return (
    <Dialog open={openLogin} onClose={handleClose}>
      <DialogTitle>
        {title}
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
      <form onSubmit={handleSubmit}>
      <DialogContent>
  <DialogContentText>
    Please fill your details in the fields below:
  </DialogContentText>
  {isRegister ? (
    <Grid container spacing={2}>
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
          inputProps={{ minLength: 2 }}
          required
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
          inputRef={lNameRef}
          inputProps={{ minLength: 2 }}
          required
        />
      </Grid>
    
      <Grid item xs={6}>
        {/* Email */}
        <TextField
          autoFocus={!isRegister}
          margin="normal"
          variant="standard"
          id="email"
          label="Email"
          type="email"
          fullWidth
          inputRef={emailRef}
          required
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
          inputRef={mobileRef}
          inputProps={{ minLength: 2 }}
          required
        />
      </Grid>
      <Grid item xs={6}>
        {/* Password */}
        <PasswordField {...{ passwordRef }} />
      </Grid>
      <Grid item xs={6}>
        {/* Confirm Password */}
        <PasswordField
          passwordRef={confirmPasswordRef}
          id="confirmPassword"
          label="Confirm Password"
        />
      </Grid>
    </Grid>
  ) : (
    <>
      {/* Email */}
      <TextField
        autoFocus={!isRegister}
        margin="normal"
        variant="standard"
        id="email"
        label="Email"
        type="email"
        fullWidth
        inputRef={emailRef}
        required
      />
      {/* Password */}
      <PasswordField {...{ passwordRef }} />
      {/* Confirm Password */}
      {isRegister && (
        <PasswordField
          passwordRef={confirmPasswordRef}
          id="confirmPassword"
          label="Confirm Password"
        />
      )}
    </>
  )}
</DialogContent>


        <DialogActions sx={{ justifyContent: "flex-end" ,px:'19px' }}>
          
          {isRegister ? (
            <Button type="submit" variant="contained" endIcon={<Send />}>
              Sign up
            </Button>
          ) : <Button type="submit" variant="contained" endIcon={<Send />}>
            Login
          </Button>}
        </DialogActions>
      </form>
      <DialogActions sx={{justifyContent:'center',p:'5px 24px'}}>
        {isRegister ? "Already have an account?" : "Don't have an account?"}
        <Button onClick={()=> setIsRegister(!isRegister)} style={{ marginTop: '5px' }}>
          {isRegister ? 'Login' : 'Register'}
          </Button>
      </DialogActions>
      <DialogActions sx={{justifyContent:'center',py:'24px'}}>
        <GoogleOneTapLogin/>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
