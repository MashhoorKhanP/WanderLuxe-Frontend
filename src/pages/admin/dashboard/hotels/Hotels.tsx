import { Avatar,Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './hotels.css';
import { DataGrid ,GridColDef, gridClasses  } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/types";
import moment from "moment";
import { grey } from "@mui/material/colors";
import HotelsActions from "./HotelsActions";
import { AppDispatch } from "../../../../store/store";
import { getHotels } from "../../../../actions/hotel";
import { updateHotelDetails, updateHotelImages, updateHotels, updateUpdatedHotel } from "../../../../store/slices/adminSlice";
import AddHotel from "./AddHotel";
import EditHotel from "./EditHotel";

interface UsersProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

interface Users {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  mobileNo: string;
  email: string;
  createdAt: string | Date;
  isVerified: boolean;
  isBlocked: boolean;
}

//Hotels old starting
interface HotelsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Hotels: React.FC<HotelsProps> = ({ setSelectedLink, link }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const hotels = useSelector((state: RootState) => state.admin.hotels);
  console.log("Hotels List from Hotels.tsx", hotels);

  const [data,setData] = useState<boolean>(true);
  useEffect(() => {
    setSelectedLink(link);
  }, [setSelectedLink, link]);
  
  useEffect(() => {
      const result = dispatch(getHotels() as any);
      dispatch(updateHotels({result}))
    
  }, [data,dispatch]);

  const handleAddHotel = () => {
    dispatch(updateHotelDetails({hotelName:'',minimumRent:0,parkingPrice:0,description:'',distanceFromCityCenter:0,location:'',email:'',mobile:''}));
    dispatch(updateHotelImages([]));
    dispatch(updateUpdatedHotel({}));
    navigate("/admin/dashboard/hotels/add-hotel")
  }

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "images",
        headerName: "Images",
        width: 70,
        renderCell: (params) => <Avatar src={params.row.images[0]} variant="rounded" />,
        sortable: false,
        filterable: false,
      },
      { field: "hotelName", headerName: "Name", width: 210 },
      { field: "location", headerName: "Location", width: 100 },
      { field: "longitude", headerName: "Longitude", width: 75 },
      { field: "latitude", headerName: "Latitude", width: 70 },
      { field: "minimumRent", headerName: "Rent(min)", width: 80,align:'center', renderCell:(params) => `₹${params.row.minimumRent}` },
      { field: "parkingPrice", headerName: "Parking Fee", width: 100,align:'center', },
      { field: "email", headerName: "Email", width: 150 },
      { field: "mobile", headerName: "Contact No", width: 140 },
      {
        field: "createdAt",
        headerName: "Created At",
        width: 150,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },
      { field: "_id", headerName: "Hotel ID", type: "string", width: 110},
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
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        type: "actions",
        renderCell: (params) => (
          <HotelsActions
            {...{ params, setData/**selectedRowId, setRowId, setSelectedRowId*/ }}
          />
        ),
      },
    ],
    [/**rowId, selectedRowId*/]
  );

  return (
    <>
      {location.pathname === "/admin/dashboard/hotels" ? (
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
            onClick={handleAddHotel}
          >
            ADD HOTEL
          </Button>
        </Box>
          <Box sx={{ height: 400, width: "95%" }}>
      <Typography
        variant="h4"
        component="h4"
        sx={{ textAlign: "center", mt: 3, mb: 3 }}
      >
        Manage Hotels
      </Typography>
      <DataGrid
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
      />
    </Box>
        </div>
      ) : location.pathname === "/admin/dashboard/hotels/add-hotel" ? (
        <AddHotel />
      ) : location.pathname === "/admin/dashboard/hotels/edit-hotel" ? (
        <AddHotel />
      ) : null}
    </>
  );
};

export default Hotels;
