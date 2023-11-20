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
import { setAlert, setCloseLogin, setOpenOTPVerification, startLoading, stopLoading } from "../../store/slices/userSlice";
import { RootState } from "../../store/types";
import { Close, Send } from "@mui/icons-material";
import PasswordField from "./PasswordField";
import GoogleOneTapLogin from "./GoogleOneTapLogin";
import { AppDispatch } from "../../store/store";
import { loginUser, registerUser } from "../../actions/user";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const openLogin = useSelector((state: RootState) => state.user.openLogin);
  const fNameRef = useRef<HTMLInputElement>(null);
  const lNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);


  const handleClose = () => {
    dispatch(setCloseLogin());
  };

  const handleSubmit = (event: React.FormEvent) => {
    event?.preventDefault();
    
    const showErrorAlert = (message: string) => {
      dispatch(setAlert({ open: true, severity: 'error', message }));
    };

    if (isRegister) {
      
      const fields = [
        { ref: fNameRef, label: 'First name' },
        { ref: lNameRef, label: 'Last name' },
        { ref: emailRef, label: 'Email' },
        { ref: mobileRef, label: 'Mobile no' },
        { ref: passwordRef, label: 'Password' },
        { ref: confirmPasswordRef, label: 'Confirm Password' },
      ];

      for (const field of fields) {
        const value = field.ref?.current?.value;
        if (!value || value.trim().length === 0) {
          showErrorAlert(`"${field.label}" is required.`);
          return;
        }
      }

      if (!fNameRef.current?.value.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)) {
        showErrorAlert('Please enter a valid first name.');
        return;
      }
      
      if (!lNameRef.current?.value.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)) {
        showErrorAlert('Please enter a valid last name.');
        return;
      }
  
      if (!emailRef.current?.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        showErrorAlert('Please enter a valid email address.');
        return;
      }

      if (!mobileRef.current?.value.match(/^[6-9]\d{9}$/)) {
        showErrorAlert('Please enter a valid mobile number.');
        return;
      }

      // if (!passwordRef.current?.value.match(/^(?=.*[0-9]).{6,}$/)) {
      //   showErrorAlert('Please provide a strong password, Minimum 6 length!');
      //   return;
      // }
  
      if (confirmPasswordRef.current?.value.trim().length === 0) {
        showErrorAlert('Please confirm your password.');
        return;
      }
  
      if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
        showErrorAlert('Passwords do not match.');
        return;
      }
      // Perform registration logic  
      const firstName = fNameRef.current?.value;
      const lastName = lNameRef.current?.value;
      const email = emailRef.current?.value;
      const mobile = mobileRef.current?.value;
      const password = passwordRef.current?.value;
      return dispatch(registerUser({firstName,lastName,email,password,mobile})); 
    }else {
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
      
    return dispatch(loginUser({email,password}));
     
  };
}
    

     
  
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
          fullWidth
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
          type="text"
          fullWidth
          inputRef={emailRef}
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
