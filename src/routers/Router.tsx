import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/User";
import AdminRouter from "./AdminRouter";
import UserRouter from "./UserRouter";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/*" element={<UserRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      {/* <Route path="*" element={<Navigate to="/404" />} /> */}
    </Routes>
  );
};

export default AppRouter;
