
import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Dashboard from "./admin/dashboard/Dashboard";



const Admin: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Dashboard/>
    </>
  );
};

export default Admin;