import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddRoom from "./AddRoom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store/store";
import { RootState } from "../../../../store/types";
import { getRooms } from "../../../../actions/room";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import moment from "moment";
import RoomsActions from "./RoomsActions";
import { grey } from "@mui/material/colors";
import {
  updateRoomDetails,
  updateRoomImages,
  updateRooms,
  updateUpdatedRoom,
} from "../../../../store/slices/adminSlices/adminRoomSlice";

interface RoomsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Rooms: React.FC<RoomsProps> = ({ setSelectedLink, link }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const rooms = useSelector((state: RootState) => state.adminRoom.rooms);

  const [data, setData] = useState<boolean>(true);

  useEffect(() => {
    setSelectedLink(link);
  }, [setSelectedLink, link]);

  useEffect(() => {
    const result = dispatch(getRooms() as any);
    dispatch(updateRooms({ result }));
  }, [data, dispatch]);

  const handleAddRoom = () => {
    //check the handleAdd Hotel in Hotels.tsx
    dispatch(
      updateRoomDetails({
        roomType: "",
        hotelId: "",
        hotelName: "",
        amenities: [],
        price: 0,
        discountPrice: 0,
        roomsCount: 1,
        maxPeople: 0,
        description: "",
      })
    );
    dispatch(updateRoomImages([]));
    dispatch(updateUpdatedRoom({}));
    navigate("/admin/dashboard/rooms/add-room");
  };
  const renderRoomsStatusCell = (params: any) => {
    const roomStatus = params.row.status;

    let textColor;
    if (roomStatus === "Available") {
      textColor = "green";
    } else if (roomStatus === "Occupied") {
      textColor = "orange";
    } else {
      textColor = "green";
    }

    return <span style={{ color: textColor }}>{`${roomStatus}`}</span>;
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "images",
        headerName: "Images",
        width: 70,
        renderCell: (params) => (
          <Avatar src={params.row.images[0]} variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      { field: "roomType", headerName: "Room Type", width: 150 },
      { field: "hotelName", headerName: "Hotel Name", width: 150 },
      {
        field: "price",
        headerName: "Rent (per night)",
        width: 120,
        align: "center",
        renderCell: (params) => `₹${params.row.price}`,
      },
      {
        field: "status",
        headerName: "Room Status(current)",
        width: 150,
        align: "center",
        renderCell: (params) => renderRoomsStatusCell(params),
      },
      // {
      //   field: "roomsCount",
      //   headerName: "Room Count",
      //   width: 100,
      //   align: "center",
      //   renderCell: (params) => (params.row.roomsCount),
      // },
      {
        field: "maxPeople",
        headerName: "Max People",
        width: 100,
        align: "center",
      },
      // { field: "parkingPrice", headerName: "Parking Fee", width: 100,align:'center', },
      // { field: "mobile", headerName: "Contact No", width: 140 },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 140,
        align: "center",
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        type: "actions",
        renderCell: (params) => (
          <RoomsActions
            {...{
              params,
              setData /**selectedRowId, setRowId, setSelectedRowId*/,
            }}
          />
        ),
      },
      // { field: "discountPrice", headerName: "Discount Price", width: 100 ,align:'center'},
      // { field: "amenities", headerName: "Ammenities", type: "array", width: 150},
      { field: "_id", headerName: "Room ID", type: "string", width: 110 },
      { field: "hotelId", headerName: "Hotel ID", type: "string", width: 110 },

      // {
      //   field: "isVerified",
      //   headerName: "Verified",
      //   width: 110,
      //   type: "boolean",
      //   editable: true,
      // },
      // {
      //   field: "isBlocked",
      //   headerName: "Blocked",
      //   width: 110,
      //   type: "boolean",
      //   editable: true,
      // },
    ],

    [
      /**rowId, selectedRowId*/
    ]
  );

  return (
    <>
      {location.pathname === "/admin/dashboard/rooms" ? (
        <div
          className="container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: 8,
              paddingTop: 1,
            }}
          >
            <Button onClick={handleAddRoom}>ADD ROOM</Button>
          </Box>
          <Box sx={{ height: 400, width: "95%" }}>
            <Typography
              variant="h4"
              component="h4"
              sx={{ textAlign: "center", mt: 0, mb: 3 }}
            >
              Manage Rooms
            </Typography>
            <DataGrid
              columns={columns}
              rows={rooms}
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
            />
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
