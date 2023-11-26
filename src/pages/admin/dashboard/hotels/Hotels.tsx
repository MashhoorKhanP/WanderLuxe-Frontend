import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddHotel from "./AddHotel";
import EditHotel from "./EditHotel";

interface HotelsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Hotels: React.FC<HotelsProps> = ({ setSelectedLink, link }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelectedLink(link);
  }, [link, setSelectedLink]);

  return (
    <>
      {location.pathname === "/admin/dashboard/hotels" ? (
        <div style={{ display: "flex" }}>
          Hotels
          <Button
            sx={{ marginLeft: "auto" }}
            onClick={() => navigate("/admin/dashboard/hotels/add-hotel")}
          >
            ADD HOTEL
          </Button>
        </div>
      ) : location.pathname === "/admin/dashboard/hotels/add-hotel" ? (
        <AddHotel />
      ) : location.pathname === "/admin/dashboard/hotels/edit-hotel" ? (
        <EditHotel />
      ) : null}
    </>
  );
};

export default Hotels;
