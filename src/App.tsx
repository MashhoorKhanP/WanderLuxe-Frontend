import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/user/Login";
import Notification from "./components/Notification";
import Loading from "./components/Loading";
export default function App() {
  return (
    <>
      <Loading/>
      <Notification />
      <Login />
      <Navbar />
    </>
  );
}
