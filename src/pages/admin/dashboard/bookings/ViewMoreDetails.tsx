import { Box, Button, Card, Container, Divider, Grid, Stack, TextField, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RootState } from '../../../../store/types';
import { BookingDetails, RoomDetails } from '../../../../store/slices/adminSlices/adminSlice';
import { getRooms } from '../../../../actions/room';
import { updateRooms } from '../../../../store/slices/adminSlices/adminRoomSlice';

const ViewMoreDetails: React.FC = () => {
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const [searchParams] = useSearchParams();
 const [bookingData,setBookingData] = useState<BookingDetails>();
 const [room, setRoom] = useState<any>([]);

 const bookingId = searchParams.get("bookingId");
 const bookings = useSelector((state: RootState) => state.admin.bookings);
 const rooms = useSelector((state: RootState) => state.adminRoom.rooms);

 useEffect(() => {
  if(!rooms.length ){
    const result = dispatch(getRooms() as any);
    dispatch(updateRooms({ result }));
  }
  const bookingData = bookings.find((booking) => booking._id === bookingId);
  setBookingData(bookingData);

  const roomData = rooms.find((room:RoomDetails) => room._id === bookingData?.roomId);
  setRoom(roomData);
  
 },[bookingId,bookings]);


 return (
  <Container>
    <Grid container item xs={12} sm={12} border={1} borderRadius={2} style={{ paddingLeft: 0 }}>
      {bookingData && room && (
      <Box sx={{ width: "100%"}} >
      <Toolbar sx={{padding:3,borderBottom:'1px solid grey'}}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    
                  }}
                >
                  <Typography variant="h6">{bookingData?.roomType}</Typography>
                  <Typography variant="subtitle2">{bookingData?.hotelName}</Typography>
                </div>
              </Toolbar>
              
        <Stack direction="row" width="100%">
          <Box sx={{ width: '50%',pl:4,pr:4,pt:2,display:'flex',gap:1}}>
            {/* Replace with actual image source and alt text */}
            <img
              src={bookingData?.roomImage}
              alt={bookingData?.roomType}
              style={{ width: '100%', height: 'auto', objectFit: 'cover',borderTopLeftRadius:8,borderBottomLeftRadius:8 }}
            />
            <img
              src={room?.images[1] ? room.images[1] : room.images[0]}
              alt={bookingData?.roomType}
              style={{ width: '100%', height: 'auto', objectFit: 'cover',borderTopRightRadius:8,borderBottomRightRadius:8 }}
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
                      sx={{ fontSize: "14px",fontWeight:'400', textDecoration:'underline' }}>
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
                     {
                      `Name: ${bookingData?.firstName +' '+ bookingData?.lastName}`
                     }
                      
                    </Typography>
                    <br/>
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px" }}
                    >
                     {
                      `Email: ${bookingData?.email}`
                     }
                      
                    </Typography>
                    <br/>
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px" }}
                    >
                     {
                      `Mobile: ${bookingData?.mobile}`
                     }
                      
                    </Typography>
                    <br/>
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px" }}
                    >
                     {
                      `User ID: ${bookingData?.userId}`
                     }
                      
                    </Typography>
                  </Box>
                </Stack>
                <Divider
                  sx={{ width: "100%", height: "1px", bgcolor: "#777" }}
                />
                <Stack>
                <Typography
                 variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px",fontWeight:'400', textDecoration:'underline' }}>
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
                     {bookingData?.numberOfNights && bookingData.numberOfNights > 1
                        ? `${bookingData?.numberOfNights} Nights`
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
                        {`${bookingData?.adults} Adult • ${bookingData?.children} Children`}
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
                        {`Total Rooms: ${bookingData?.totalRoomsCount}`}
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
                        {  `Check-In: ${bookingData?.checkInDate} - ${bookingData?.checkInTime}`}
                          
                    </Typography>
                    <br />
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px" }}
                    >
                        {`Check-Out: ${bookingData?.checkOutDate} - ${bookingData?.checkOutTime}`}
                    </Typography>
                    <br />
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px"}}
                    >
                      Booking Status:
                    </Typography>
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px", color:bookingData.status === 'Confirmed'? 'green': 'red',fontWeight:'bold'}}
                    >
                      {` ${bookingData.status}`}
                    </Typography>
                  </Box>
                </Stack>
                <Divider
                  sx={{ width: "100%", height: "1px", bgcolor: "#777" }}
                />

                
               
                  <Stack width={"100%"} direction="row">
                    
                    <Box
                      sx={{
                        display: "inline-block",
                      }}
                    >
                      <Typography
                 variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px",fontWeight:'400', textDecoration:'underline' }}>
                  Billing Details
                </Typography><br/>
                      <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        {`Rent for a night (1Room): ₹${room.price + room.discountPrice}`}
                      </Typography>
                      {/* Room discount  */}

                      <br />
                         <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        {`Room rent for ${
                          bookingData?.numberOfNights
                        } night x ${bookingData?.totalRoomsCount} rooms: ₹${
                          (room.price + room.discountPrice) *
                          bookingData?.numberOfNights *
                          bookingData?.totalRoomsCount
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
                          bookingData.numberOfNights *
                          bookingData.totalRoomsCount
                        }`}
                      </Typography>
                      <br />
                      <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        {`Coupon Discount: -₹${
                          bookingData.couponDiscount
                        }`}
                      </Typography>
                      <br />
                      <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        {`Coupon Id: ${
                          bookingData.appliedCouponId
                        }`}
                      </Typography>
                      <br />
                      <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        {`Payment Method: ${
                          bookingData.paymentMethod
                        }`}
                      </Typography>
                      <br />
                      <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        {`Transaction Id: ${
                          bookingData.transactionId
                        }`}
                      </Typography>
                      <br />
                      <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        Invoice: <a href={bookingData.receiptUrl} style={{textDecoration:'underline',color:'#03A9F4'}} target='_blank'>Click here</a>
                      </Typography>
                      <br />
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
                          {`Amount Paid: ₹${bookingData?.totalAmount}`}
                        </Typography>
                        <br />
                      </Box>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" width="100%" justifyContent={'center'} spacing={0.5} paddingBottom={2} paddingTop={2}>
              <Button
                variant="outlined"
                
                className='book_room_btn'
                sx={{ width: '80%', p: 1, borderRadius: 0,bgcolor:'#7777',color:"#ffffff",borderColor:'white'}}
                
                onClick={() => navigate('/admin/dashboard/bookings')}
              >
                <span>Go back</span>
              </Button>
            </Stack>
          </Stack>
        </Box>
        )}
      </Grid>
    </Container>
  );
};

export default ViewMoreDetails;