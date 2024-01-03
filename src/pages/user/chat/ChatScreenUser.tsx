import React, { forwardRef, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  IconButton,
  Rating,
  Slide,
  SlideProps,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/types";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import { WanderLuxeLogo } from "../../../assets/extraImages";
import { AppDispatch } from "../../../store/store";
import { closeChatScreen } from "../../../store/slices/userSlices/userSlice";
import ChatScreen from "../../admin/dashboard/dashboardHome/ChatScreen";



const Transition = forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  const transitionSpeed = 500;
  const [selectedLink, setSelectedLink] = useState("");
  return (
    <Slide
      direction="up"
      {...props}
      ref={ref}
      timeout={{ enter: transitionSpeed, exit: transitionSpeed }}
    />
  );
});

const ChatScreenUser: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isOpen = useSelector(
    (state: RootState) => state.user.isChatScreenOpen
  );
 
  // useEffect(() => {
  //   if (isOpen && roomId) {
  //     // Use useEffect to update room only after the component has mounted
  //     const roomDetails = rooms.find((room: any) => room._id === roomId);
  //     setRoom(roomDetails);
  //     dispatch(setRoomBookings(fullHotelBookings.filter((booking:any) => booking.roomId === roomId )));
  //     // Ensure hotel is defined before attempting to access its properties
  //     const selectedHotel = hotels.find(
  //       (selectedHotel: HotelDetails) =>
  //         selectedHotel._id === roomDetails?.hotelId
  //     );

      
  // }, [roomId, isOpen, rooms, hotels, room]);

  
  const handleClose = () => {
    dispatch(closeChatScreen());
    
  };
  
  return (
   <>
   
    {isOpen && 
    <IconButton color="inherit" sx={{ position: 'fixed', top: '5%', right: '30%', zIndex:2000}} onClick={handleClose}>
      <Close sx={{color:'#DC3545'}} />
    </IconButton>
  }
    <Dialog
      open={isOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          // Set 'open' to false, however you would do that with your particular code.
          handleClose;
        }
      }}
      TransitionComponent={Transition}
    >
      <Container sx={{width:'400px',p:1,bgcolor:'#414141'}}>
        <ChatScreen/>
      </Container>
    </Dialog>
    </> 
  );
};

export default ChatScreenUser;
