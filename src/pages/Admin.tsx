import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Dashboard from "./admin/dashboard/Dashboard";
import Users from "./admin/dashboard/users/Users";
import Hotels from "./admin/dashboard/hotels/Hotels";
import Rooms from "./admin/dashboard/rooms/Rooms";
import Banners from "./admin/dashboard/banners/Banners";
import Bookings from "./admin/dashboard/bookings/Bookings";
import Coupons from "./admin/dashboard/coupons/Coupons";
import Offers from "./admin/dashboard/offers/Offers";

const Admin: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Dashboard />
      {/* {location.pathname==='/admin/dashboard/users' && <Users/>}
      {location.pathname==='/admin/dashboard/hotels' && <Hotels/>}
      {location.pathname==='/admin/dashboard/rooms' && <Rooms/>}
      {location.pathname==='/admin/dashboard/bookings' && <Bookings/>}
      {location.pathname==='/admin/dashboard/coupons' && <Coupons/>}
      {location.pathname==='/admin/dashboard/offers' && <Offers/>}
      {location.pathname==='/admin/dashboard/banners' && <Banners/>} */}
    </>
  );
};

export default Admin;
