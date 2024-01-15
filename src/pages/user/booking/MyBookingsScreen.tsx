import { ArrowBack, UnfoldMoreOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  Hidden,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserBookings } from "../../../actions/booking";
import { getRooms } from "../../../actions/room";
import useCheckToken from "../../../components/hooks/useCheckToken";
import { setRoomId } from "../../../store/slices/userSlices/roomSlice";
import {
  openBookingDetails,
  setBookingId,
  setBookings,
  setRooms,
} from "../../../store/slices/userSlices/userSlice";
import { AppDispatch } from "../../../store/store";
import { RootState } from "../../../store/types";

const MyBookingsScreen: React.FC = () => {
  const checkToken = useCheckToken();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const rooms: any = useSelector(
    (state: RootState) => state.user.filteredRooms
  );
  const bookings: any = useSelector((state: RootState) => state.user.bookings);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;
  const indexOfLastHotel = currentPage * bookingsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstHotel, indexOfLastHotel);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  useEffect(() => {
    if (!rooms.length) {
      const fetchRooms = async () => {
        const response = await dispatch(getRooms());
        dispatch(setRooms(response.payload.message)); // assuming getHotels returns { payload: hotels }
      };
      fetchRooms();
    }

    const fetchBookings = async () => {
      const userId =
        currentUser?.message?._id !== undefined
          ? currentUser?.message?._id
          : currentUser?._id;
      const userDetails = {
        userId: userId as string,
      };
      const response = await dispatch(getUserBookings({ userDetails }));
      dispatch(setBookings(response.payload.message)); // assuming getHotels returns { payload: hotels }
    };

    fetchBookings();
  }, [dispatch, currentUser]);

  checkToken;
  const handleViewMoreDetails = (bookingId: string, roomId: string) => {
    dispatch(openBookingDetails());
    dispatch(setBookingId(bookingId));
    dispatch(setRoomId(roomId));
  };

  const upcomingBookings = currentBookings.filter(
    (booking: any) => booking.status === "Confirmed"
  );
  const completedBookings = currentBookings.filter(
    (booking: any) => booking.status !== "Confirmed"
  );

  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        paddingTop={4}
        flexDirection="row"
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" marginLeft={1}>
          My Bookings
        </Typography>
      </Box>
      {/* Upcoming Bookings Section */}
      {upcomingBookings.length > 0 && (
        <Box p={2}>
          <Typography variant="h6" sx={{ color: "##505050" }} fontWeight="bold">
            Upcoming Bookings{" "}
            <i className="bi bi-clock" style={{ color: "#007bff" }}></i>
          </Typography>
          <ImageList
            gap={12}
            sx={{
              paddingTop: 2,
              mb: 4,
              display: currentBookings.length > 0 ? "" : "flex",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(280px, 1fr)) !important",
            }}
          >
            {upcomingBookings.map((booking: any) => (
              <Tooltip title="" key={booking._id}>
                <Card sx={{ width: "100%", height: "270px" }}>
                  <ImageListItem sx={{ height: "100% !important" }}>
                    <ImageListItemBar
                      sx={{
                        background: "1",
                      }}
                      title={booking.roomType}
                      subtitle={`𖡡 ${booking.hotelName}`}
                      position="top"
                    />
                    <img
                      src={booking.roomImage}
                      alt={booking.RoomType}
                      // style={{ cursor: "pointer" }}
                      loading="lazy"
                    />
                    {/* Want to give room starts from with  */}
                    <ImageListItemBar
                      sx={{
                        height: "211px",
                        pt: 5,
                      }}
                      title={
                        <>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            Amount Paid
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            {`₹${booking.totalAmount}`}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            Check-In
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            {`${dayjs(booking.checkInDate).format(
                              "ddd, MMM D, YYYY"
                            )} - ${booking.checkInTime}`}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            Check-Out
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            {`${dayjs(booking.checkOutDate).format(
                              "ddd, MMM D, YYYY"
                            )} - ${booking.checkOutTime}`}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            Status
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color:
                                booking.status === "Cancelled" ||
                                booking.status === "Cancelled by Admin"
                                  ? "#DC3545"
                                  : "#15ca76",
                            }}
                          >
                            {booking.status}
                          </Typography>
                        </>
                      }
                      // subtitle={"Amount Paid"}
                      actionIcon={
                        <Tooltip title="More Details">
                          <UnfoldMoreOutlined
                            sx={{
                              color: "rgba(255,255,255, 0.8)",
                              mr: "20px",
                              cursor: "pointer",
                              transition: "transform 0.3s ease", // Add transition for smooth effect
                              "&:hover": {
                                transform: "scale(1.2)", // Increase the scale on hover
                              },
                            }}
                            onClick={() =>
                              handleViewMoreDetails(booking._id, booking.roomId)
                            } // Replace with your logic
                          />
                        </Tooltip>
                      }
                    />
                  </ImageListItem>
                </Card>
              </Tooltip>
            ))}
          </ImageList>
        </Box>
      )}

      {/* Completed Bookings Section */}
      {completedBookings.length > 0 && (
        <Box p={2}>
          <Typography variant="h6" sx={{ color: "##505050" }} fontWeight="bold">
            Completed Bookings{" "}
            <i className="bi bi-check-circle" style={{ color: "#28a745" }}></i>
          </Typography>
          <ImageList
            gap={12}
            sx={{
              paddingTop: 2,
              mb: 8,
              display: currentBookings.length > 0 ? "" : "flex",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(280px, 1fr)) !important",
            }}
          >
            {completedBookings.map((booking: any) => (
              <Tooltip title="" key={booking._id}>
                <Card sx={{ width: "100%", height: "270px" }}>
                  <ImageListItem sx={{ height: "100% !important" }}>
                    <ImageListItemBar
                      sx={{
                        background: "1",
                      }}
                      title={booking.roomType}
                      subtitle={`𖡡 ${booking.hotelName}`}
                      position="top"
                    />
                    <img
                      src={booking.roomImage}
                      alt={booking.RoomType}
                      // style={{ cursor: "pointer" }}
                      loading="lazy"
                    />
                    {/* Want to give room starts from with  */}
                    <ImageListItemBar
                      sx={{
                        height: "211px",
                        pt: 5,
                      }}
                      title={
                        <>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            Amount Paid
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            {`₹${booking.totalAmount}`}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            Check-In
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            {`${dayjs(booking.checkInDate).format(
                              "ddd, MMM D, YYYY"
                            )} - ${booking.checkInTime}`}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            Check-Out
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            {`${dayjs(booking.checkOutDate).format(
                              "ddd, MMM D, YYYY"
                            )} - ${booking.checkOutTime}`}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "underline",
                              fontSize: "12px",
                              color: "#ececec",
                            }}
                          >
                            Status
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color:
                                booking.status === "Cancelled" ||
                                booking.status === "Cancelled by Admin"
                                  ? "#DC3545"
                                  : "#15ca76",
                            }}
                          >
                            {booking.status}
                          </Typography>
                        </>
                      }
                      // subtitle={"Amount Paid"}
                      actionIcon={
                        <Tooltip title="More Details">
                          <UnfoldMoreOutlined
                            sx={{
                              color: "rgba(255,255,255, 0.8)",
                              mr: "20px",
                              cursor: "pointer",
                              transition: "transform 0.3s ease", // Add transition for smooth effect
                              "&:hover": {
                                transform: "scale(1.2)", // Increase the scale on hover
                              },
                            }}
                            onClick={() =>
                              handleViewMoreDetails(booking._id, booking.roomId)
                            } // Replace with your logic
                          />
                        </Tooltip>
                      }
                    />
                  </ImageListItem>
                </Card>
              </Tooltip>
            ))}
          </ImageList>
        </Box>
      )}

      {/* No Booking Found Section */}
      {currentBookings.length <= 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" display="flex" padding={2}>
            Not booked yet? Book now...
          </Typography>
          <img
            src={import.meta.env.VITE_NOBOOKINGFOUND_GIF}
            style={{
              borderRadius: "15px",
              width: "100%",
              maxWidth: "280px",
              height: "auto",
            }}
            alt="No Booking found..."
          />
          <Stack
            direction="row"
            width="100%"
            spacing={2}
            justifyContent="center"
            paddingTop={4}
            paddingBottom={2}
          >
            <Button
              variant="outlined"
              className="book_room_btn"
              sx={{ width: "20%", p: 1, borderRadius: 0 }}
              color="inherit"
              onClick={() => navigate(`/view-hotels`)}
            >
              <span>Book rooms</span>
            </Button>
            <Button
              variant="outlined"
              className="book_room_btn"
              sx={{ width: "20%", p: 1, borderRadius: 0 }}
              color="inherit"
              onClick={() => navigate(`/home`)}
            >
              <span>Back to home</span>
            </Button>
          </Stack>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
        {currentBookings.length > bookingsPerPage && (
          <Hidden mdDown>
            <Box>
              {Array.from({
                length: Math.ceil(currentBookings.length / bookingsPerPage),
              }).map((_, index) => (
                <Typography
                  key={index + 1}
                  variant="button"
                  sx={{
                    cursor: "pointer",
                    margin: 1,
                    color: currentPage === index + 1 ? "black" : "#929292",
                    outline: "2px solid", // Add outline property
                    outlineColor: "primary.main", // Specify the outline color
                    padding: 1, // Adjust padding as needed
                  }}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Typography>
              ))}
            </Box>
          </Hidden>
        )}
      </Box>
    </Container>
  );
};

export default MyBookingsScreen;
