import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import UserRouter from "./UserRouter";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/*" element={<UserRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
  );
};

export default AppRouter;
