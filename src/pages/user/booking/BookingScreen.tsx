import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  ImageListItem,
  ImageListItemBar,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { setAlert } from "../../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Redeem } from "@mui/icons-material";
import { HomeImage1 } from "../../../assets/extraImages";

const BookingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fNameRef = useRef<HTMLInputElement>(null);
  const lNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const [room, setRoom] = useState<any>([]);
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId");

  const rooms: any = useSelector(
    (state: RootState) => state.user.filteredRooms
  );
  const checkInCheckoutRange:any = useSelector((state:RootState) => state.room.checkInCheckOutRange);

  console.log("room", room);
  useEffect(() => {
    if (roomId) {
      // Use useEffect to update room only after the component has mounted
      const roomDetails = rooms.find((room: any) => room._id === roomId);
      setRoom(roomDetails);

      // Ensure hotel is defined before attempting to access its properties
    }
  }, [roomId, rooms, room]);

  const handlePayNow = (event: React.FormEvent) => {
    event?.preventDefault();

    const showErrorAlert = (message: string) => {
      dispatch(setAlert({ open: true, severity: "error", message }));
    };

    const fields = [
      { ref: fNameRef, label: "First name" },
      { ref: lNameRef, label: "Last name" },
      { ref: emailRef, label: "Email" },
      { ref: mobileRef, label: "Mobile no" },
    ];

    for (const field of fields) {
      const value = field.ref?.current?.value;
      if (!value || value.trim().length === 0) {
        showErrorAlert(`"${field.label}" is required.`);
        return;
      }
    }

    if (
      !fNameRef.current?.value.match(
        /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
      )
    ) {
      showErrorAlert("Please enter a valid first name.");
      return;
    }

    if (
      !lNameRef.current?.value.match(
        /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
      )
    ) {
      showErrorAlert("Please enter a valid last name.");
      return;
    }

    if (
      !emailRef.current?.value.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      showErrorAlert("Please enter a valid email address.");
      return;
    }

    if (!mobileRef.current?.value.match(/^[6-9]\d{9}$/)) {
      showErrorAlert("Please enter a valid mobile number.");
      return;
    }

    // Perform registration logic
    const firstName = fNameRef.current?.value;
    const lastName = lNameRef.current?.value;
    const email = emailRef.current?.value;
    const mobile = mobileRef.current?.value;

    // const result = dispatch(
    //   registerUser({ firstName, lastName, email, password, mobile }) //set this to a variable and check is userAlreadyExist then no navigate
    // );
    // const resultUnwrapped = result.unwrap();
    // resultUnwrapped.then((thenResult) => {
    //   console.log("success", thenResult);

    //   // Check if thenResult is not null or undefined
    //   if (thenResult != null) {
    //     navigate("/user/otp-verification");
    //   }
    // });
  };
  return (
    <Container>
      <Box paddingTop={4}>
        <Typography variant="h5" fontWeight="bold">
          Confirm Booking
        </Typography>
      </Box>
      <Box p={2} justifyContent="space-between">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {/* Box 1 */}
            <Box sx={{ width: "95%" }}>
              <form>
                <Typography>
                  Please fill your details for booking in the fields below:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    {/* First Name */}
                    <TextField
                      autoFocus
                      margin="normal"
                      variant="outlined"
                      id="firstName"
                      label="First name"
                      type="text"
                      inputRef={fNameRef}
                      fullWidth
                      InputProps={{ sx: { borderRadius: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* Last Name */}
                    <TextField
                      margin="normal"
                      variant="outlined"
                      id="lastName"
                      label="Last name"
                      type="text"
                      fullWidth
                      InputProps={{ sx: { borderRadius: 0 } }}
                      inputRef={lNameRef}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    {/* Email */}
                    <TextField
                      margin="normal"
                      variant="outlined"
                      id="email"
                      label="Email"
                      type="text"
                      fullWidth
                      InputProps={{ sx: { borderRadius: 0 } }}
                      inputRef={emailRef}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    {/* Mobile Number */}
                    <TextField
                      margin="normal"
                      variant="outlined"
                      id="mobile"
                      label="Mobile no"
                      type="text"
                      fullWidth
                      inputRef={mobileRef}
                      InputProps={{ sx: { borderRadius: 0 } }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Box>
            <Divider
              sx={{ width: "96%", height: "1px", bgcolor: "#777", mt: 2 }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            border={1}
            borderRadius={2}
            style={{ paddingLeft: 0 }}
          >
            {/* Box 2 */}
            <Box sx={{ width: "100%" }} pl={0}>
              <Toolbar>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Typography variant="h6">{room.roomType}</Typography>
                  <Typography variant="subtitle2">{room.hotelName}</Typography>
                </div>
              </Toolbar>
              <Stack direction="row" justifyContent="center" width={"100%"}>
                <Card sx={{ width: "90%", borderRadius: "0" }}>
                  {room.images && room.images.length > 0 && (
                    <img
                      src={room.images[0]}
                      alt={room.hotelName}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                    />
                  )}
                </Card>
              </Stack>
              <Stack
                sx={{ pl: 4, pt: 1, pr: 4, pb: 4 }}
                spacing={1}
                alignItems="flex-start"
                justifyContent="space-between"
              >
                {/* <Stack direction="row">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: '75%',
                }}
              >
                <Box>
                  <Typography variant="h6" component={"span"} sx={{fontSize:'26px'}}>
                    {`₹${room.price}`}
                  </Typography>
                  <Typography
                    variant="h6"
                    component={"span"}
                    style={{
                      textDecoration: "line-through",
                      fontSize: "16px",
                      color: "#777",
                    }}
                  >
                    {`₹${room.price + room.discountPrice}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack> */}
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
                      {checkInCheckoutRange.numberOfNights > 1? `${checkInCheckoutRange.numberOfNights} Nights`
  :  `${1}Night`}

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
                      {`Max People: ${room.maxPeople}`}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {room.amenities &&
                        room.amenities.map((amenity: string, index: number) => (
                          <>
                            <Typography
                              variant="h6"
                              sx={{ fontSize: "14px" }}
                              key={index}
                            >
                              {`${amenity}`}
                            </Typography>
                            {index >= 0 && index < room.amenities.length - 1 ? (
                              <Typography
                                sx={{ pl: 0.5, pr: 0.5, fontSize: "14px" }}
                                variant="h6"
                              >
                                •
                              </Typography>
                            ) : (
                              ""
                            )}
                          </>
                        ))}
                    </Box>
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
                      {checkInCheckoutRange.startDate ? (`Check In: ${checkInCheckoutRange.startDate.toDateString()} - ${checkInCheckoutRange.startTime}`) : ('')}
                    </Typography>
                    <br />
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px" }}
                    >
                     {checkInCheckoutRange.endDate ? (`Check Out: ${checkInCheckoutRange.endDate.toDateString()} - ${checkInCheckoutRange.endTime}`) : ('')}

                    </Typography>
                  </Box>
                </Stack>
                <Divider
                  sx={{ width: "100%", height: "1px", bgcolor: "#777" }}
                />

                <Stack
                  direction="row"
                  justifyContent="center"
                  width={"100%"}
                  pt={1.5}
                  pl={1.5}
                  pr={1.5}
                >
                  <TextField
                    InputProps={{ sx: { borderRadius: 0 } }}
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Coupon Code"
                  />
                  <Button
                    variant="contained"
                    component={"span"}
                    sx={{
                      width: "60%",
                      fontSize: "14px",
                      ml: "1px",
                      borderRadius: "0",
                      bgcolor: "black",
                      transition: "color 0.3s ease",
                      "&:hover": { bgcolor: "rgb(47 47 47)" },
                    }}
                  >
                    APPLY
                  </Button>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="start"
                  width={"100%"}
                  pl={1.5}
                >
                  <Button
                    variant="text"
                    sx={{
                      width: "120px",
                      padding: 0,
                      height: "20px",
                      fontSize: "12px",
                      color: "black",
                      transition: "fontSize 0.8s ease",
                      "&:hover": {
                        fontSize: "12.5px",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Explore Coupons
                  </Button>
                </Stack>
{checkInCheckoutRange.numberOfNights &&(
                <Stack width={"100%"} direction="row">
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
                      {`Room rent for ${checkInCheckoutRange.numberOfNights} night: ₹${(room.price+room.discountPrice)*checkInCheckoutRange.numberOfNights}`}
                    </Typography>
                    
                    <br />
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px" }}
                    >
                      {`Instant discount: -₹${room.discountPrice*checkInCheckoutRange.numberOfNights}`}
                    </Typography>
                    <br />
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px" }}
                    >
                      {`Coupon discount: -₹${150}`}
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
                        {`Payable Amount: ₹${room.price*checkInCheckoutRange.numberOfNights}`}
                      </Typography>
                      <br />
                    </Box>
                  </Box>
                </Stack>
)
                    }
                <Stack
                  direction="row"
                  width={"100%"}
                  spacing={0.5}
                  paddingBottom={2}
                  paddingTop={2}
                >
                  <Button
                    variant="outlined"
                    sx={{ width: "100%", p: 1, borderRadius: 0 }}
                    color="inherit"
                    onClick={() =>
                      navigate(`/user/view-rooms?hotelId=${room.hotelId}`)
                    }
                  >
                    <span>Go back</span>
                  </Button>
                  <Button
                    className="book_room_btn"
                    variant="outlined"
                    sx={{ width: "100%", p: 1, borderRadius: 0 }}
                    color="inherit"
                    onClick={handlePayNow}
                  >
                    <span>Pay Now</span>
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BookingScreen;
