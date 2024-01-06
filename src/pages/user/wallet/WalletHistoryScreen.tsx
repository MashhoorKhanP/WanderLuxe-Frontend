import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store/types";
import {
  closeWalletHistory,
} from "../../../store/slices/userSlices/userSlice";
import {
  Box,
  Container,
  Dialog,
  Divider,
  IconButton,
  Slide,
  SlideProps,
  Toolbar,
  Typography,
} from "@mui/material";
import { getRooms } from "../../../actions/room";
import { updateRooms } from "../../../store/slices/adminSlices/adminRoomSlice";
import { RoomDetails } from "../../../store/slices/adminSlices/adminSlice";
import { Close } from "@mui/icons-material";
import { setRoomId } from "../../../store/slices/userSlices/roomSlice";
import { AppDispatch } from "../../../store/store";
import dayjs from "dayjs";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import { grey } from "@mui/material/colors";
import { current } from "@reduxjs/toolkit";
import moment from "moment";

const Transition = forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  const transitionSpeed = 500;

  return (
    <Slide
      direction="down"
      {...props}
      ref={ref}
      timeout={{ enter: transitionSpeed, exit: transitionSpeed }}
    />
  );
});

const WalletHistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [booking, setBooking] = useState<any>([]);
  const [room, setRoom] = useState<any>([]);

  const isOpen = useSelector(
    (state: RootState) => state.user.isWalletHistoryOpen
  );
  const bookingId = useSelector(
    (state: RootState) => state.user.selectedBookingId
  );
  const roomId = useSelector((state: RootState) => state.room.selectedRoomId);
  const bookings: any = useSelector((state: RootState) => state.user.bookings);
  const rooms: any = useSelector(
    (state: RootState) => state.user.filteredRooms
  );

  console.log("rooms: ", rooms);
  useEffect(() => {
    if (isOpen && bookingId) {
      const bookingDetails = bookings.find(
        (booking: any) => booking._id === bookingId
      );
      setBooking(bookingDetails);
    }
    const roomData = rooms.find((room: RoomDetails) => room._id === roomId);
    setRoom(roomData);
  }, [bookingId, isOpen, bookings, booking, rooms, roomId]);

  const handleClose = () => {
    dispatch(closeWalletHistory());
    // dispatch(setBookingId(""));
    // dispatch(setRoomId(""));
    // navigate('/view-rooms');
  };

  const rendertransactionTypeCell = (params: any) => {
    const transactionType = params.row.transactionType;

    let textColor;
    if (transactionType === 'Credit') {
      textColor = "#198754";
    } else {
      textColor = "#DC3545";
    }

    return <span style={{ color: textColor }}>{`${transactionType}`}</span>;
  };

  const columns: GridColDef[] = useMemo(
    () => [
      
      {
        field: "transactionDate",
        headerName: "Transaction Date",
        
        renderCell: (params) =>
          moment(params.row.transactionDate).format("DD-MM-YYYY HH:MM:SS"),
        width: 180,
      },
      {
        field: "transactionDetails",
        headerName: "Details",
        width: 180,
        
      },
      {
        field: "transactionType",
        headerName: "Type",
        renderCell: (params) => rendertransactionTypeCell(params),
        width:100,
        
      },
      {
        field: "transactionAmount",
        headerName: "Amount",
        width:100,
        renderCell: (params) => `₹${params.row.transactionAmount}`,
      },
      {
        field: "currentBalance",
        headerName: "Current Balance",
        width: 150,
        
        renderCell: (params) => `₹${params.row.currentBalance}`,
      },
      {
        field: "transactionId",
        headerName: "Transaction ID",
        width: 250,
        
      },
    ],
    []
  );
  
  const sortModel = useMemo(
    () => [
      {
        field: 'transactionDate',
        sort: 'desc',
      },
    ],
    []
  );
  
  return (
    <Dialog
      fullScreen
      className="dialog_container"
      open={isOpen && location.pathname === "/my-wallet"}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          // Set 'open' to false, however you would do that with your particular code.
          handleClose;
        }
      }}
      TransitionComponent={Transition}
    >
      <Container>
        <Toolbar sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography variant="h6" fontSize={'25px'} fontWeight={'bold'}>Wallet History</Typography>
            {/* <Typography variant="subtitle2">{booking.hotelName}</Typography> */}
          </div>
          <IconButton color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </Toolbar>
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            bgcolor: "#777",
          }}
        />
        <br />
        <div
          className="container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ height: 400, width: "95%" }}>
        <DataGrid
              
              columns={columns}
              rows={currentUser?.walletHistory || []}
              getRowId={(row) => row._id}
              pageSizeOptions={[10, 25, 50, 75, 100]}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              sx={{
                border:'1px solid black',
                [`& .${gridClasses.row}`]: {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? grey[300] : grey[900],
                },
              }}
              // onCellEditStop={(params) => setSelectedRowId(params.id.toString())} //give on onCellEditStart
              // onCellEditStart={(params) => setRowId(params.id.toString())}
            />
            </Box>
            </div>
      </Container>
    </Dialog>
  );
};

export default WalletHistoryScreen;
