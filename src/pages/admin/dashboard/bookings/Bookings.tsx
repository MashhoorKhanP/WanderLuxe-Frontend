import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/types";
import { getBookings } from "../../../../actions/booking";
import moment from "moment";
import useCheckToken from "../../../../components/hooks/useCheckToken";
import { BookingDetails } from "../../../../store/slices/adminSlices/adminSlice";
import BookingActions from "./BookingActions";
import ViewMoreDetails from "./ViewMoreDetails";

interface BookingsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Bookings: React.FC<BookingsProps> = ({ setSelectedLink, link }) => {
  const checkToken = useCheckToken();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rowId, setRowId] = useState<string>("");
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const bookings = useSelector((state: RootState) => state.admin.bookings);
  const [data, setData] = useState<boolean>(true);

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  useEffect(() => {
    const result = dispatch(getBookings() as any);
    // dispatch(updateCoupons({ result }));
  }, [data, dispatch]);

  checkToken;
  const renderStatusCell = (params: any) => {
    const bookingStatus = params.row.status;

    let textColor;
    if (bookingStatus === "Cancelled") {
      textColor = "#DC3545";
    } else if (bookingStatus === "Cancelled by Admin") {
      textColor = "#DC3545";
    } else {
      textColor = "#198754";
    }

    return (
      <span
        style={{ color: textColor, fontWeight: "bold" }}
      >{`${bookingStatus}`}</span>
    );
  };
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "roomImage",
        headerName: "Image",
        width: 70,
        renderCell: (params) => <Avatar src={params.row.roomImage} />,
        sortable: false,
        filterable: false,
      },
      {
        field: "firstName",
        headerName: "Name",
        width: 100,
        renderCell: (params) => (
          <div>
            {params.row.firstName} {params.row.lastName}
          </div>
        ),
      },
      { field: "mobile", headerName: "Mobile", width: 110 },
      { field: "roomType", headerName: "Room", width: 120 },
      { field: "hotelName", headerName: "Hotel", width: 120 },
      {
        field: "numberOfNights",
        headerName: "Days",
        width: 60,
        align: "center",
      },
      {
        field: "status",
        headerName: "Booking Status",
        width: 200,
        editable: true,
        renderCell: (params) => (
          <Tooltip title="Double click to change status!">
            <span>{renderStatusCell(params)}</span>
          </Tooltip>
        ),

        renderEditCell: (params) => (
          // params.value !== 'Cancelled' && (
          <Select
            value={params.value}
            onChange={(e) => {
              // Use the api object from params to commit cell edits
              params.api.setEditCellValue({
                id: params.id,
                field: params.field,
                value: e.target.value,
              });
            }}
            sx={{
              fontWeight: "bold",
              color: params.value === "Cancelled" ? "#DC3545" : "#198754",
              width: 200,
            }}
          >
            <MenuItem
              value="Confirmed"
              sx={{ color: "green", fontWeight: "bold" }}
            >
              Confirm Booking
            </MenuItem>
            <MenuItem
              value="On Check-In"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              On Check-In
            </MenuItem>
            <MenuItem
              value="Checked-Out"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Checked-Out
            </MenuItem>
            {params.value === "Confirmed" && (
              <MenuItem
                value="Cancelled by Admin"
                sx={{ color: "red", fontWeight: "bold" }}
              >
                Cancel Booking
              </MenuItem>
            )}
          </Select>
          // )
        ),
      },
      {
        field: "checkInDate",
        headerName: "Check-In",
        align: "center",
        renderCell: (params) =>
          moment(params.row.checkInDate).format("DD-MM-YYYY"),
      },
      {
        field: "checkOutDate",
        headerName: "Check-Out",
        align: "center",
        renderCell: (params) =>
          moment(params.row.checkOutDate).format("DD-MM-YYYY"),
      },
      { field: "totalRoomsCount", headerName: "No.of Rooms", align: "center" },
      {
        field: "totalAmount",
        headerName: "Amount",
        align: "center",
        renderCell: (params) => `₹${params.row.totalAmount}`,
      },

      {
        field: "createdAt",
        headerName: "Created At",
        width: 140,
        renderCell: (params) =>
          moment(params.row.createdAt).format("DD-MM-YYYY HH:MM:SS"),
      },

      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        type: "actions",
        renderCell: (params) => (
          <BookingActions
            {...{ params, selectedRowId, setData, setRowId, setSelectedRowId }}
          />
        ),
      },

      { field: "_id", headerName: "User ID", type: "string", width: 110 },
      { field: "roomId", headerName: "Room ID", type: "string", width: 110 },

    ],
    [rowId, selectedRowId]
  );
  return location.pathname === "/admin/dashboard/bookings" ? (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ height: 400, width: "95%" }}>
        <Typography
          variant="h4"
          component="h4"
          sx={{ textAlign: "center", mt: 2, mb: 3 }}
        >
          Manage Bookings
        </Typography>
        <DataGrid
          columns={columns}
          rows={bookings as BookingDetails[]}
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
          onCellEditStop={(params) => setSelectedRowId(params.id.toString())}
          onCellEditStart={(params) => setRowId(params.id.toString())}
        />
      </Box>
    </div>
  ) : location.pathname === "/admin/dashboard/bookings/view-more" ? (
    <ViewMoreDetails />
  ) : null;
};

export default Bookings;
