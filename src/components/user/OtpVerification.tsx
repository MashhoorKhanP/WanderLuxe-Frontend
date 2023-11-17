import { Close } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState ,useRef} from 'react'
import { setAlert, setCloseOTPVerification, setOpenOTPVerification, verifyUser } from '../../store/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { MuiOtpInput } from 'mui-one-time-password-input'
import { AppDispatch } from '../../store/store'

const OtpVerification:React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const openOtpVerification = useSelector((state:RootState) => state.user.openOTPVerification);
  const otpRef = useRef<HTMLInputElement>(null);

  const [timer,setTimer] = useState(60);
  const [resendDisabled,setResendDisabled] = useState(false);
  const [otpValue, setOTPValue] = useState<string>('');

  const handleOTPChange = (value:string) =>{

    setOTPValue(value);
  }
  
  useEffect(() =>{
    let interval : NodeJS.Timeout;

    if(timer > 0) {
       interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer -1);
       },1000);
    }else{
      setResendDisabled(false);
    }

    return () => clearInterval(interval)
  },[timer])

  const handleResend = () =>{
    setTimer(60);
    setResendDisabled(true);

    setTimeout(() =>{
      setResendDisabled(false);
    },3000);
  };

  const handleClose = () => {
    dispatch(setCloseOTPVerification());
  }

  const handleVerifyOTP = (event:React.FormEvent) =>{
    event.preventDefault();

    const otp = otpRef.current?.value;

    if(otp?.trim().length ===0){
      dispatch(setAlert({ open: true, severity: 'error', message:'Fields should not be empty!' }));
      return;
    }

    

    try{
       dispatch(verifyUser({otp:parseInt(otpValue)}))
    }catch(error){
      console.error('Error verifying OTP:', error);
    }
  }
  return (
    <Dialog open={openOtpVerification} onClose={handleClose}>
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
          <Close/>
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleVerifyOTP}>
      <DialogContent>
  <DialogContentText>
    Please verify the OTP send to your email:
  </DialogContentText>
      <Grid style={{paddingTop:'20px'}}>
      <Box
            sx={{
              paddingTop: '20px',
              width: '300px',
              padding: '5px',
              margin: 'auto',
            }}
          >
            <MuiOtpInput autoFocus margin="normal" id="otp" ref={otpRef} onChange={handleOTPChange} value={otpValue}
             />
          </Box>
      </Grid>
</DialogContent>
        <DialogActions  style={{paddingBottom:'20px'}} sx={{ justifyContent: "center" ,px:'19px' }}>
            <Button type="submit" variant="contained">
              Verify
            </Button>
        </DialogActions>
      </form>
      <DialogActions style={{ justifyContent: 'center', paddingBottom: '24px' }}>
        {timer > 0 ? (
          <span style={{fontWeight:'500'}}>Resend OTP in {timer} seconds</span>
        ) : (
          <Button onClick={handleResend} disabled={resendDisabled}>
            Resend OTP
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default OtpVerification