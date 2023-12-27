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
import { WanderLuxeLogo } from "../assets/extraImages";
import { Socket, io } from "socket.io-client";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const handleOpenLogin = () => {
    navigate("/user/login-register");
    dispatch(setOpenLogin(true));
  };
  const socket = useRef<Socket | null>();
  
  useEffect(()=>{
    if(!socket.current && currentUser){
      socket.current = io(import.meta.env.VITE_SERVER_URL);
      if(currentUser.message){
        const userId = currentUser.message._id;
        socket.current.emit('addUser',(userId))  
      }else{
        socket.current.emit('addUser',(currentUser?._id))
      }
      socket.current.on('getUser',(data)=>{
        console.log(data);
      })
      socket.current.on('responseIsBlocked',(data:{isBlocked:boolean})=>{
        console.log('dataSocket',data);
        if(data.isBlocked){
         dispatch(logoutUser());
        }
      })
      
    }
  },[socket,currentUser])

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#9fa3a878" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* <Box>
          <IconButton size='large' sx={{display:{color:'#000000'}}}>
            <Menu/>
          </IconButton>
        </Box> */}
            <Box>
              <img src={WanderLuxeLogo} style={{ width: "35px" }} />
            </Box>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              onClick={() => navigate("/user/home")}
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
              onClick={() => navigate("/user/home")}
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
