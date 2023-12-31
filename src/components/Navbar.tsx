import React, { useEffect, useRef, useState } from "react";
import { Lock } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import UserIcons from "./user/UserIcons";
import { RootState } from "../store/types";
import { User, logoutUser, setOpenLogin } from "../store/slices/userSlices/userSlice";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { getUpdatedUser } from "../actions/user";
import { AppDispatch } from "../store/store";
import { getBookings } from "../actions/booking";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const handleOpenLogin = () => {
    navigate("/login-register");
    dispatch(setOpenLogin(true));
  };
  // const socket = useRef<Socket | null>();
  
  // useEffect(()=>{
  //   if(!socket.current && currentUser){
  //     socket.current = io(import.meta.env.VITE_SERVER_URL);
  //     socket.current.emit('addUser',(currentUser?._id))
  //     socket.current.on('getUser',(data)=>{
  //       console.log('Socket Users',data);
  //     })
  //     socket.current.on('welcome', (message:any) => {
  //       console.log('SocketIOmessage', message)
  //     })
  //     socket.current.on('responseIsBlocked',(data:{isBlocked:boolean})=>{
  //       console.log('dataSocket',data);
  //       if(data.isBlocked){
  //        dispatch(logoutUser());
  //       }
  //     })
      
  //   }
  // },[socket,currentUser])

   

  // const [message,setMessage] = useState<any>([currentUser]);

  // useEffect(() => {
  //   // const socket = io(import.meta.env.VITE_SERVER_URL); // Remove this line
  //   socket.current = io(import.meta.env.VITE_SERVER_URL);
  
  //   // console.log('socket', socket.current);
  //   // socket.current.on('connection', (data) => {
  //   //   console.log('Connected!', data);
  //   // });
  
  //   // Listen for incoming messages
  //   socket.current.on('message', (newMessage) => {
  //     console.log('newMessage', newMessage);
  //     setMessage((prevMessages:any) => [...prevMessages, newMessage]);
  //   });
  
  //   // return () => {
  //   //   if (socket.current) {
  //   //     socket.current.disconnect();
  //   //   }
  //   // };
  // }, []);

  // useEffect(() => {
  //   console.log('socket message',message);
  // },[message])

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* <Box>
          <IconButton size='large' sx={{display:{color:'#000000'}}}>
            <Menu/>
          </IconButton>
        </Box> */}
            <Box>
              <img src={import.meta.env.VITE_WANDERLUXE_LOGO} style={{ width: "35px" }} />
            </Box>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              onClick={() => navigate("/home")}
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex", color: "#000000" },
                cursor: "pointer",
              }}
            >
              WanderLuxe
            </Typography>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              onClick={() => navigate("/home")}
              sx={{
                flexGrow: 1,
                display: {
                  xs: "flex",
                  md: "none",
                  color: "#000000",
                  cursor: "pointer",
                },
              }}
            >
              WanderLuxe
            </Typography>
            {!currentUser ? (
              <Button
                color="inherit"
                sx={{ display: { color: "#000000" } }}
                startIcon={<Lock />}
                onClick={handleOpenLogin}
              >
                Login
              </Button>
            ) : (
              <UserIcons />
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
