import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/types';
import { Box, Button, Card, Container, Hidden, IconButton, ImageList, ImageListItem, ImageListItemBar, Stack, Tooltip, Typography } from '@mui/material';
import { BedOutlined, Favorite, FavoriteBorder } from '@mui/icons-material';
import { NoBookingFound } from '../../../assets/extraImages';
import { getUserBookings } from '../../../actions/booking';
import { AppDispatch } from '../../../store/store';
import { setBookings } from '../../../store/slices/userSlices/userSlice';
import useCheckToken from '../../../components/hooks/useCheckToken';
import { useNavigate } from 'react-router-dom';


const MyBookingsScreen: React.FC = () => {
  const checkToken = useCheckToken();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const bookings:any = useSelector((state: RootState) => state.user.bookings);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;
  console.log('currentUser from MyBookingScreen',currentUser);
  console.log('UserBooking',bookings);
  const indexOfLastHotel = currentPage * bookingsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstHotel, indexOfLastHotel);
  console.log('currentUser.messsge',currentUser?.message);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  useEffect(() => {
      const fetchBookings = async () => {
        const userId = currentUser?.message?._id !== undefined ? currentUser?.message?._id : currentUser?._id;
        const userDetails={
          userId:userId as string
        }
        const response = await dispatch(getUserBookings({userDetails}));
        dispatch(setBookings(response.payload.message)); // assuming getHotels returns { payload: hotels }
      };

      fetchBookings();
  }, [dispatch,currentUser]);

  checkToken;
  return (
    <Container>
      <Box paddingTop={4}>
        <Typography variant="h5" fontWeight="bold">
          My Bookings
        </Typography>
      </Box>
      <ImageList
        gap={12}
        sx={{
          paddingTop: 2,
          mb: 8,
          display: 'flex',
          gridTemplateColumns:
            "repeat(auto-fill,minmax(280px, 1fr)) !important",
        }}
      > 
        {currentBookings.length <= 0 ? (
            <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
              <Typography variant="h5" fontWeight='bold' display="flex" padding={2}>
                Not booked yet? Book now...
              </Typography>
              <img src={NoBookingFound} 
            style={{ borderRadius: '15px', width: '100%', maxWidth: '280px', height: 'auto' }}
            alt="No Booking found..." />
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
        sx={{ width: '20%', p: 1, borderRadius: 0 }}
        color="inherit"
        onClick={() => navigate(`/user/view-hotels`)}
      >
        <span>Book rooms</span>
      </Button>
      <Button
        variant="outlined"
        className="book_room_btn"
        sx={{ width: '20%', p: 1, borderRadius: 0 }}
        color="inherit"
        onClick={() => navigate(`/user/home`)}
      >
        <span>Back to home</span>
      </Button>
    </Stack>
            </Box>
            
            
        ) : currentBookings.length > 0 ? (
          currentBookings.map((booking:any) => (
           
      <Tooltip title="" key={booking._id}>
              <Card sx={{ width: "100%", height: "270px" }}>
                <ImageListItem sx={{ height: "100% !important" }}>
                  <ImageListItemBar
                    sx={{
                      background: "0",
                    }}
                    title={booking.roomType}
                    subtitle={`𖡡 ${booking.hotelName}`}
                    // actionIcon={
                    //   <>
                        
                    //     <Tooltip
                    //       title={
                    //         currentUser?.wishlist?.includes(hotel._id)
                    //           ? "Remove from wishlist"
                    //           : "Add to wishlist"
                    //       }
                    //     >
                    //       <IconButton
                    //         onClick={() =>
                    //           handleWishlist(hotel._id, hotel.hotelName)
                    //         } // Add your wishlist logic here
                    //         sx={{
                    //           position: "absolute",
                    //           top: "55px",
                    //           right: "10px",
                    //           color: "white",
                    //           transition: "color 0.3s ease",
                    //           "&:hover": { color: "red" },
                    //         }}
                    //       >
                    //         {currentUser?.wishlist?.includes(hotel._id) ? (
                    //           <Favorite sx={{ color: "red" }} />
                    //         ) : (
                    //           <FavoriteBorder />
                    //         )}
                    //       </IconButton>
                    //     </Tooltip>
                    //     <Tooltip title="View Rooms">
                    //       <IconButton
                    //         onClick={() => handleViewRoom(hotel._id)} // Add your wishlist logic here
                    //         sx={{
                    //           position: "absolute",
                    //           top: "85px",
                    //           right: "10px",
                    //           color: "white",
                    //           transition: "color 0.3s ease",
                    //           "&:hover": { color: "red" },
                    //         }}
                    //       >
                    //         <BedOutlined
                    //           sx={{
                    //             color: "white",
                    //             transition: "color 0.3s ease",
                    //             "&:hover": { color: "red" },
                    //           }}
                    //           onClick={() => handleViewRoom(hotel._id)}
                    //         />
                    //       </IconButton>
                    //     </Tooltip>
                    //   </>
                    // }
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
                    // onClick={() => handleViewBookingDetails(booking._id)}
                    title={`₹${booking.totalAmount}`}
                    subtitle={"Paid"}
                    // actionIcon={
                    //   <Rating
                    //     sx={{ color: "rgba(255,255,255, 0.8)", mr: "5px" }}
                    //     name="hotelRating"
                    //     defaultValue={3.5}
                    //     precision={0.5}
                    //     emptyIcon={
                    //       <StarBorder
                    //         sx={{ color: "rgba(255,255,255, 0.8)" }}
                    //       />
                    //     }
                    //   />
                    // }
                  />
                </ImageListItem>
              </Card>
            </Tooltip>
          ))
        ) : (
          ""
        )}
      
    
            </ImageList>
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