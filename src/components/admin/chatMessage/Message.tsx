import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { format } from "timeago.js";
import { RootState } from "../../../store/types";
import "./message.css";
import { Avatar } from "@mui/material";

interface MessageProps {
  message: {
    text: string;
    createdAt: any;
    sender: string;
  };
  own: boolean | any;
}

const Message: React.FC<MessageProps> = ({ message, own }) => {
  const location = useLocation();
  const [user, setUser] = useState<any>([]);
  const allUsers = useSelector((state: RootState) => state.admin.users);
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (location.pathname === "/admin/dashboard/chat-screen") {
      const usersData = allUsers.find(
        (user: any) => user._id === message.sender
      );
      if (usersData) {
        setUser(usersData);
      } else {
        setUser(currentAdmin);
      }
    } else {
      const currentAdmin = {
        profileImage: import.meta.env.VITE_WANDERLUXE_LOGO_BG,
      };
      const usersData =
        currentUser?._id === message.sender ? currentUser : currentAdmin;
      setUser(usersData);
    }
  }, [location.pathname]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {/* <img className="messageImg" src={user?.profileImage} alt="" /> */}
        <Avatar
            style={{ backgroundColor: "#868686" }}
            src={
              user?.profileImage
            }
            alt={user?.firstName}
            className="messageImg"
          >
            {user?.firstName?.charAt(0).toUpperCase()}
          </Avatar>
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">{format(message?.createdAt)}</div>
    </div>
  );
};

export default Message;
