import React, { forwardRef, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
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
import { Close, SupportAgentOutlined } from "@mui/icons-material";
import { AppDispatch } from "../../../store/store";
import { closeChatScreen } from "../../../store/slices/userSlices/userSlice";
import ChatScreen from "../../admin/dashboard/dashboardHome/ChatScreen";
import { Socket } from "socket.io-client";



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
interface ChatScreenProps{
  socket?:Socket | null;
}

const ChatScreenUser: React.FC<ChatScreenProps> = ({socket}) => {
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

  
  const [isTitleVisible, setIsTitleVisible] = useState(true);

  const handleClose = () => {
    dispatch(closeChatScreen());
    setIsTitleVisible(!isTitleVisible);
  };

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        setIsTitleVisible(false);
      }, 3000);

      return () => {
        // Clear the timeout to prevent it from triggering after component unmount
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen]);
  
  return (
   <>
   
    {isOpen && 
    <IconButton color="inherit" sx={{ position: 'fixed', top: '5%', right: '30px', zIndex:2000}} onClick={handleClose}>
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
 
          <DialogTitle sx={{ bgcolor: '#414141', color: '#c9c9c9',display:isTitleVisible?'block':'none' }}>
            Chat support <SupportAgentOutlined />
          </DialogTitle>
        
      <Container sx={{width:'400px',p:1,bgcolor:'#414141'}}>
        <ChatScreen socket={socket}/>
      </Container>
    </Dialog>
    </> 
  );
};

export default ChatScreenUser;
