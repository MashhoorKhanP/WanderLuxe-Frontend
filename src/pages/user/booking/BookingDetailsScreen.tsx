import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  IconButton,
  Slide,
  SlideProps,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { userCancelBooking } from "../../../actions/booking";
import {
  RoomDetails,
  startLoading,
} from "../../../store/slices/adminSlices/adminSlice";
import { setRoomId } from "../../../store/slices/userSlices/roomSlice";
import {
  closeBookingDetails,
  setBookingId,
  stopLoading,
} from "../../../store/slices/userSlices/userSlice";
import { AppDispatch } from "../../../store/store";
import { RootState } from "../../../store/types";

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

const BookingDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [booking, setBooking] = useState<any>([]);
  const [room, setRoom] = useState<any>([]);
  const { currentUser }: any = useSelector((state: RootState) => state.user);
  const isOpen = useSelector(
    (state: RootState) => state.user.isBookingDetailsOpen
  );
  const bookingId = useSelector(
    (state: RootState) => state.user.selectedBookingId
  );
  const roomId = useSelector((state: RootState) => state.room.selectedRoomId);
  const bookings: any = useSelector((state: RootState) => state.user.bookings);
  const rooms: any = useSelector(
    (state: RootState) => state.user.filteredRooms
  );

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
    dispatch(closeBookingDetails());
    dispatch(setBookingId(""));
    dispatch(setRoomId(""));
  };

  const handleCancelBooking = () => {
    const updatedBooking: any = {
      _id: bookingId,
      roomId: roomId,
      userId: currentUser?._id,
      status: "Cancelled",
    };
    dispatch(closeBookingDetails());
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to cancel the booking?`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No, Go Back!",
      customClass: {
        container: "custom-swal-container",
      },
      width: 400, // Set your desired width
      background: "#f0f0f0",
      iconHtml: '<i class="bi bi-x-lg" style="font-size:30px"></i>',
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(userCancelBooking({ updatedBooking }));
        startLoading();
        stopLoading();
      }
    });
  };

  return (
    <Dialog
      fullScreen
      className="dialog_container"
      open={isOpen && location.pathname === "/my-bookings"}
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
            <Typography variant="h6">{booking.roomType}</Typography>
            <Typography variant="subtitle2">{booking.hotelName}</Typography>
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
        {booking && room && (
          <Box sx={{ width: "100%" }}>
            <Stack direction="row" width="100%">
              <Box
                sx={{
                  width: "50%",
                  pl: 4,
                  pr: 4,
                  pt: 2,
                  display: "flex",
                  gap: 1,
                }}
              >
                {/* Replace with actual image source and alt text */}
                <img
                  src={booking?.roomImage}
                  alt={booking?.roomType}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  }}
                />
                <img
                  src={room?.images?.[1] ? room.images[1] : room.images?.[0]}
                  alt={booking?.roomType}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                />
              </Box>
            </Stack>

            <Stack
              sx={{ pl: 4, pt: 1, pr: 4, pb: 4 }}
              spacing={1}
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Typography
                variant="h6"
                component={"span"}
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  textDecoration: "underline",
                }}
              >
                Customer Details
              </Typography>
              <Stack>
                <Box
                  sx={{
                    display: "inline-block",
                  }}
                >
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Name: ${booking?.firstName + " " + booking?.lastName}`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Email: ${booking?.email}`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Mobile: ${booking?.mobile}`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`User ID: ${booking?.userId}`}
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ width: "100%", height: "1px", bgcolor: "#777" }} />
              <Stack>
                <Typography
                  variant="h6"
                  component={"span"}
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    textDecoration: "underline",
                  }}
                >
                  Booking Details
                </Typography>
                <Box
                  sx={{
                    display: "inline-block",
                  }}
                >
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {booking?.numberOfNights && booking.numberOfNights > 1
                      ? `${booking?.numberOfNights} Nights`
                      : `${1} Night`}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "inline-block",
                  }}
                ></Box>
              </Stack>
              <Stack direction="row">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`${booking?.adults} Adult • ${booking?.children} Children`}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Total Rooms: ${booking?.totalRoomsCount}`}
                  </Typography>
                </Box>
              </Stack>

              <Stack pb={1}>
                <Box
                  sx={{
                    display: "inline-block",
                  }}
                >
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Check-In: ${dayjs(booking?.checkInDate).format(
                      "ddd, MMM D, YYYY"
                    )} - ${booking?.checkInTime}`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Check-Out: ${dayjs(booking?.checkOutDate).format(
                      "ddd, MMM D, YYYY"
                    )} - ${booking?.checkOutTime}`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    Booking Status:
                  </Typography>
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{
                      fontSize: "14px",
                      color:
                        booking.status === "Cancelled" ||
                        booking.status === "Cancelled by Admin"
                          ? "#DC3545"
                          : "#198754",
                      fontWeight: "bold",
                    }}
                  >
                    {` ${booking.status}`}
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ width: "100%", height: "1px", bgcolor: "#777" }} />

              <Stack width={"100%"} direction="row">
                <Box
                  sx={{
                    display: "inline-block",
                  }}
                >
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      textDecoration: "underline",
                    }}
                  >
                    Billing Details
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Rent for a night (1Room): ₹${
                      room.price + room.discountPrice
                    }`}
                  </Typography>
                  {/* Room discount  */}

                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Room rent for ${booking?.numberOfNights} night x ${
                      booking?.totalRoomsCount
                    } rooms: ₹${
                      (room.price + room.discountPrice) *
                      booking?.numberOfNights *
                      booking?.totalRoomsCount
                    }`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Instant discount: -₹${
                      room.discountPrice *
                      booking.numberOfNights *
                      booking.totalRoomsCount
                    }`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Coupon Discount: -₹${booking.couponDiscount}`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Coupon Id: ${booking.appliedCouponId}`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Payment Method: ${booking.paymentMethod}`}
                  </Typography>
                  <br />
                  <Typography
                    variant="h6"
                    component={"span"}
                    sx={{ fontSize: "14px" }}
                  >
                    {`Transaction Id: ${booking.transactionId}`}
                  </Typography>
                  <br />
                  {booking.paymentMethod === "Online Payment" && (
                    <>
                      <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        Invoice:{" "}
                        <a
                          href={booking.receiptUrl}
                          style={{ textDecoration: "underline", color: "blue" }}
                          target="_blank"
                        >
                          Click here
                        </a>
                      </Typography>

                      <br />
                    </>
                  )}
                  <Divider
                    sx={{
                      width: "100%",
                      height: ".5px",
                      bgcolor: "#777",
                      mt: 2,
                    }}
                  />
                  <Box paddingTop={2}>
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "24px" }}
                    >
                      {`Amount Paid: ₹${booking?.totalAmount}`}
                    </Typography>
                    <br />
                  </Box>
                </Box>
              </Stack>

              <Stack
                direction="row"
                width="100%"
                justifyContent={"center"}
                spacing={0.5}
                paddingBottom={2}
                paddingTop={2}
              >
                <Button
                  variant="outlined"
                  className="book_room_btn"
                  sx={{
                    width: "20%",
                    p: 1,
                    borderRadius: 0,
                    bgcolor: "#ffffff",
                    color: "#000000",
                    border: "1px solid black",
                  }}
                  onClick={handleClose}
                >
                  <span>Go back</span>
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    width: "20%",
                    p: 1,
                    borderRadius: 0,
                    bgcolor: "",
                    color: "#DC3545",
                    border: "1px solid #DC3545",
                    transition: "background-color 0.5s, color 0.5s",
                    "&:hover": {
                      bgcolor: "#DC3545",
                      color: "white",
                      border: "none",
                    },
                  }}
                  disabled={booking.status != "Confirmed"}
                  onClick={handleCancelBooking}
                >
                  <span>Cancel Booking</span>
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Container>
    </Dialog>
  );
};

export default BookingDetailsScreen;
