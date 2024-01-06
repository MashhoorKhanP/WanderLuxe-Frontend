import React, { useEffect, useRef } from "react";
import Dashboard from "./admin/dashboard/Dashboard";
import { Socket, io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../store/types";
import ChatScreenUser from "./user/chat/ChatScreenUser";

const Admin: React.FC = () => {
 
  return (
    <>
    <Dashboard/> 
    </>
  );
};

export default Admin;
