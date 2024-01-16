import { Close, SupportAgentOutlined } from "@mui/icons-material";
import {
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  Slide,
  SlideProps,
  Tooltip,
} from "@mui/material";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { closeChatScreen } from "../../../store/slices/userSlices/userSlice";
import { AppDispatch } from "../../../store/store";
import { RootState } from "../../../store/types";
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
interface ChatScreenProps {
  socket?: Socket | null;
}

const ChatScreenUser: React.FC<ChatScreenProps> = ({ socket }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.user.isChatScreenOpen);
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
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <Tooltip title='Close Chat'>
        <IconButton
          color="inherit"
          sx={{ position: "fixed", top: "5%", right: "30px", zIndex: 2000,borderRadius:"50px" ,bgcolor:'#494949db'}}
          onClick={handleClose}
        >
          <Close sx={{ color: "#DC3545" ,fontWeight:'bold', fontSize:'30px' }} />
        </IconButton>
        </Tooltip>
      )}
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
        <DialogTitle
          sx={{
            bgcolor: "#414141",
            color: "#c9c9c9",
            display: isTitleVisible ? "block" : "none",
          }}
        >
          Chat support <SupportAgentOutlined />
        </DialogTitle>

        <Container sx={{ width: "400px", p: 1, bgcolor: "#414141" }}>
          <ChatScreen socket={socket} />
        </Container>
      </Dialog>
    </>
  );
};

export default ChatScreenUser;
