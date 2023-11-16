import { Close, Done, Send } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField } from '@mui/material'
import React, { useRef } from 'react'
import { setCloseOTPVerification, setOpenOTPVerification } from '../../store/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { MuiOtpInput } from 'mui-one-time-password-input'

const OtpVerification:React.FC = () => {
  const dispatch = useDispatch();
  const openOtpVerification = useSelector((state:RootState) => state.user.openOTPVerification);
  const otpRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    dispatch(setCloseOTPVerification());
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
          <Close />
        </IconButton>
      </DialogTitle>
      <form>
      <DialogContent>
  <DialogContentText>
    Please verify the OTP send to your email:
  </DialogContentText>
      <Grid style={{paddingTop:'20px'}}>
        <MuiOtpInput
          autoFocus
          margin="normal"
          id="otp"
          // Apply custom styles using sx prop
          sx={{
            // Adjust the styles as needed
            width: '300px', // Set the width
            margin: 'auto', // Center the component horizontally
          }}
        />
      </Grid>
</DialogContent>
        <DialogActions  style={{paddingBottom:'20px'}} sx={{ justifyContent: "center" ,px:'19px' }}>
            <Button type="submit" variant="contained">
              Verify
            </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default OtpVerification