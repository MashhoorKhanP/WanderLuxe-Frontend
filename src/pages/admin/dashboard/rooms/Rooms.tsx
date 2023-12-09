import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddHotel from "../hotels/AddHotel";
import AddRoom from "./AddRoom";
import { getHotels } from "../../../../actions/hotel";
import { updateHotels } from "../../../../store/slices/adminSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store/store";

interface RoomsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Rooms: React.FC<RoomsProps> = ({ setSelectedLink, link }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  useEffect(() => {
    setSelectedLink(link);
  }, []);


  const handleAddRoom = () => {
    navigate("/admin/dashboard/rooms/add-room")
  }

  return (

    <>
    {location.pathname === "/admin/dashboard/rooms" ? (
      <div className="container" style={{ display: "flex", flexDirection: "column"}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: 8,
          paddingTop: 1,
        }}
      >
        <Button
          onClick={handleAddRoom}
        >
          ADD ROOM
        </Button>
      </Box>
        <Box sx={{ height: 400, width: "95%" }}>
    <Typography
      variant="h4"
      component="h4"
      sx={{ textAlign: "center", mt: 3, mb: 3 }}
    >
      Manage Rooms
    </Typography>
    {/* <DataGrid
      columns={columns}
      rows={hotels}
      getRowId={(row) => row._id}
      pageSizeOptions={[10, 25, 50, 75, 100]}
      getRowSpacing={(params) => ({
        top: params.isFirstVisible ? 0 : 5,
        bottom: params.isLastVisible ? 0 : 5,
      })}
      sx={{
        [`& .${gridClasses.row}`]: {
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? grey[200] : grey[900],
        },
      }}
      // onCellEditStop={(params) => setSelectedRowId(params.id.toString())} //give on onCellEditStart
      // onCellEditStart={(params) => setRowId(params.id.toString())}
    /> */}
  </Box>
      </div>
    ) : location.pathname === "/admin/dashboard/rooms/add-room" ? (
      <AddRoom />
    ) : location.pathname === "/admin/dashboard/rooms/edit-room" ? (
      <AddRoom />
    ) : null}
  </>
  );
};

export default Rooms;
