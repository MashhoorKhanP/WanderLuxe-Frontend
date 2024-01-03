import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/User";
import AdminRouter from "./AdminRouter";
import UserRouter from "./UserRouter";
import PageNotFound from "../components/common/NotFound";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user/*" element={<UserRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="*" element={<Navigate to="/404" />} />
      {/* Create a specific 404 page */}
      <Route path="/404" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRouter;
