import React, { useState } from 'react'
import { Button } from '@mui/material'
import GoogleIcon from '../../assets/googleIcon.png'
import { useDispatch } from 'react-redux'
import { setAlert, setCloseLogin, updateUser } from '../../store/slices/userSlice'
import { jwtDecode } from 'jwt-decode'
import { googleregister } from '../../actions/user'
import { useNavigate } from 'react-router-dom'

declare global {
  interface Window {
    google: any; // Adjust the type according to the actual structure of the google object
  }
}

interface DecodedToken {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
  // Add other properties as needed
}

const GoogleOneTapLogin:React.FC = () => {
  const dispatch = useDispatch();
  const navigate =useNavigate()
  const [disable,setDisabled] = useState(false);

  const handleResponse = (response:any) => {
    const token = response.credential
    const decodedToken :DecodedToken = jwtDecode(token)
    const { sub: id, email, given_name: firstName, family_name: lastName, picture: profileImage } = decodedToken;
    //dispatch(updateUser({id,email,firstName,lastName,profileImage,token,isGoogle:true}))
    dispatch(googleregister({email,firstName,lastName,profileImage,password:token,isGoogle:true,isVerified:true})as any)
    
  }

  const handleGoogleLogin = () => {
    navigate('/google-login')
    setDisabled(true);
    try{
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback:handleResponse
      })
      window.google.accounts.id.prompt((notification:any)=>{
        if(notification.isNotDisplayed()){
          throw new Error ('Try to clear the cookies or try again later')
        }
        if(notification.isSkippedMoment() || notification.isDismissedMoment()){
          setDisabled(false);
        }
      })
    }catch(error){
      const typedError = error as Error;
      dispatch(setAlert({open:true,severity:'error',message:typedError.message}))
      console.log(error);
    }
  };
  return (
    <Button variant='outlined' startIcon={<img src={GoogleIcon}  alt="Google" style={{ width: '25px' }}/>} disabled={disable} onClick={handleGoogleLogin}>
      Sign in with Google
    </Button>
  )
}

export default GoogleOneTapLogin