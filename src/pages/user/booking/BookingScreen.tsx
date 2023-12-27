import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { setAlert } from "../../../store/slices/userSlices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  openCouponOverview,
  setCoupons,
} from "../../../store/slices/userSlices/couponSlice";
import { getCoupons } from "../../../actions/coupon";
import { Coupon } from "../coupons/CouponsOverviewScreen";
import { Options } from "../rooms/AdultChildrenPicker";
import { postPaymentRequest } from "../../../actions/booking";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


const BookingScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const fNameRef = useRef<HTMLInputElement>(null);
  const lNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const [room, setRoom] = useState<any>([]);
  const [searchParams] = useSearchParams();
  const couponCodeRef = useRef<HTMLInputElement>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { currentUser } : any = useSelector((state: RootState) => state.user);
  const roomId = searchParams.get("roomId");
  const additionalroomsNeeded = searchParams.get("additionalroomsNeeded");
  const totalRoomNeeded = Number(additionalroomsNeeded) + 1;

  console.log('appliedCounpon',appliedCoupon)

  const [stripe, setStripe] = useState<any>();

  const adultChildOptions: Options = useSelector(
    (state: RootState) => state.room.adultChildrenOptions
  );
  const rooms: any = useSelector(
    (state: RootState) => state.user.filteredRooms
  );
  const checkInCheckoutRange: any = useSelector(
    (state: RootState) => state.room.checkInCheckOutRange
  );
  
  if(room.price === undefined){
    navigate('/user/view-hotels');
  }
  const coupons = useSelector((state: RootState) => state.coupon.coupons);
  const [roomsNeeded, setRoomsNeeded] = useState<number>(1);
  const [couponDiscount,setCouponDiscount] = useState<number>(0);
  const [payableAmount, setPayableAmount] = useState<number>(
    room.price * checkInCheckoutRange.numberOfNights
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const toggleDatePicker = () => {
    setIsDatePickerOpen((prev) => !prev);
  };
  console.log('couponDiscount',couponDiscount);
  useEffect(() => {
    if (roomId) {
      // Use useEffect to update room only after the component has mounted
      const roomDetails = rooms.find((room: any) => room._id === roomId);
      setRoom(roomDetails);
    }
    if (!coupons.length) {
      const fetchCoupons = async () => {
        const response = await dispatch(getCoupons());
        dispatch(setCoupons(response.payload.message));
      };
      fetchCoupons();
    }
  }, [roomId, rooms, room, coupons]);

  useEffect(() => {
    // Check if room is not empty before calculating payableAmount
    if (room && checkInCheckoutRange.numberOfNights) {
      setPayableAmount(
        room.price * checkInCheckoutRange.numberOfNights * totalRoomNeeded
      );
    }
  }, [room, checkInCheckoutRange.numberOfNights, totalRoomNeeded]);

  useEffect(() => {
    // Filter available coupons based on your conditions
    const filteredCoupons = coupons.filter(
      (coupon: Coupon) =>
        new Date(coupon.expiryDate) > new Date() &&
        coupon.couponCount > 0 &&
        !coupon.isCancelled
    );
    setAvailableCoupons(filteredCoupons);
  }, [coupons]);

  const handleExploreCoupons = () => {
    dispatch(openCouponOverview());
  };

  const applyCoupon = () => {
    const couponCode = couponCodeRef.current?.value;
    const selectedCoupon: any = availableCoupons.find(
      (coupon) => coupon.couponCode === couponCode
    );

    if (selectedCoupon) {
      setAppliedCoupon(selectedCoupon);

      if (selectedCoupon.discountType === "percentage") {
        const couponDiscount =
          (room.price * selectedCoupon.discount) / 100 >
          selectedCoupon.maxDiscount
            ? selectedCoupon.maxDiscount
            : (room.price * selectedCoupon.discount) / 100;

        setPayableAmount(
          room.price * checkInCheckoutRange.numberOfNights * totalRoomNeeded -
            couponDiscount
        );
        setCouponDiscount(couponDiscount);
      } else if (selectedCoupon.discountType === "fixedAmount") {
        setCouponDiscount(selectedCoupon.discount);
        setPayableAmount(
          room.price * checkInCheckoutRange.numberOfNights * totalRoomNeeded -
            selectedCoupon.discount
        );
      }
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    // Reset payable amount to the original amount without the coupon discount
    setPayableAmount(
      room.price * checkInCheckoutRange.numberOfNights * totalRoomNeeded
    );
  };

  const handlePayNow = async(event: React.FormEvent) => {
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
    console.log('couponDiscount',couponDiscount);

    if (!mobileRef.current?.value.match(/^[6-9]\d{9}$/)) {
      showErrorAlert("Please enter a valid mobile number.");
      return;
    }
    const bookingDetails = {
      firstName : fNameRef.current?.value,
      lastName : lNameRef.current?.value,
      email : emailRef.current?.value,
      mobile : mobileRef.current?.value,
      userId:currentUser?._id === undefined ? currentUser?.message?._id : currentUser?._id,
      roomId:room._id,
      roomType:room.roomType,
      hotelName:room.hotelName,
      roomImage:room.images[0],
      appliedCouponId:appliedCoupon?._id ? appliedCoupon?._id: 'No Coupon Applied',
      couponDiscount:couponDiscount,
      totalRoomsCount:totalRoomNeeded,
      checkInDate:checkInCheckoutRange.startDate.toDateString(),
      checkOutDate:checkInCheckoutRange.endDate.toDateString(),
      checkInTime:checkInCheckoutRange.startTime,
      checkOutTime:checkInCheckoutRange.endTime,
      numberOfNights:checkInCheckoutRange.numberOfNights,
      adults:adultChildOptions.adult,
      children:adultChildOptions.children,
      totalAmount:payableAmount,
      paymentMethod:'Online Payment' // when adding wallet add condition here wallet ? Wallet : Online Payment
    }

    if(!stripe){
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    }
    dispatch(postPaymentRequest({bookingDetails}))
    
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
                      {checkInCheckoutRange.numberOfNights > 1
                        ? `${checkInCheckoutRange.numberOfNights} Nights`
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
                      {`Max People (per room): ${room.maxPeople}`}
                    </Typography>
                  </Box>
                </Stack>
                {adultChildOptions && (
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
                        {`${adultChildOptions.adult} Adult • ${adultChildOptions.children} Children`}
                      </Typography>
                    </Box>
                  </Stack>
                )}
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
                      {`Total Rooms: ${totalRoomNeeded}`}
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
                      {checkInCheckoutRange.startDate
                        ? `Check-In: ${checkInCheckoutRange.startDate.toDateString()} - ${
                            checkInCheckoutRange.startTime
                          }`
                        : ""}
                    </Typography>
                    <br />
                    <Typography
                      variant="h6"
                      component={"span"}
                      sx={{ fontSize: "14px" }}
                    >
                      {checkInCheckoutRange.endDate
                        ? `Check-Out: ${checkInCheckoutRange.endDate.toDateString()} - ${
                            checkInCheckoutRange.endTime
                          }`
                        : ""}
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
                    inputRef={couponCodeRef}
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
                    onClick={applyCoupon}
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
                    onClick={handleExploreCoupons}
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
                {checkInCheckoutRange.numberOfNights && (
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
                        {`Rent for a night (1Room): ₹${
                          room.price + room.discountPrice
                        }`}
                      </Typography>

                      <br />

                      <Typography
                        variant="h6"
                        component={"span"}
                        sx={{ fontSize: "14px" }}
                      >
                        {`Room rent for ${
                          checkInCheckoutRange.numberOfNights
                        } night x ${totalRoomNeeded} rooms: ₹${
                          (room.price + room.discountPrice) *
                          checkInCheckoutRange.numberOfNights *
                          totalRoomNeeded
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
                          checkInCheckoutRange.numberOfNights *
                          totalRoomNeeded
                        }`}
                      </Typography>
                      <br />
                      {/* Display applied coupon information */}
                      {appliedCoupon && (
                        <Stack
                          direction="row"
                          justifyContent="start"
                          width={"100%"}
                        >
                          <Typography
                            variant="h6"
                            component={"span"}
                            sx={{
                              fontSize: "14px", // Set the desired font size for Coupon Discount
                              // Add any other custom styles for the Typography component
                            }}
                          >
                            {`Coupon discount: ${
                              appliedCoupon.discountType === "percentage"
                                ? "-₹"
                                : "-₹"
                            }${
                              appliedCoupon.discountType === "percentage"
                                ? appliedCoupon.maxDiscount
                                : appliedCoupon.discount
                            }`}
                          </Typography>
                          <Button
                            variant="text"
                            onClick={removeCoupon}
                            sx={{
                              ml: 2,
                              p: 0,
                              fontSize: "12px",
                              color: "red",
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            Remove
                          </Button>
                        </Stack>
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
                          {`Payable Amount: ₹${payableAmount}`}
                        </Typography>
                        <br />
                      </Box>
                    </Box>
                  </Stack>
                )}
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

                  {checkInCheckoutRange &&
                    (checkInCheckoutRange.startDate === undefined ||
                    checkInCheckoutRange.endDate === undefined ||
                    checkInCheckoutRange.startTime === undefined ||
                    checkInCheckoutRange.endTime === undefined ||
                    checkInCheckoutRange.startDate.toLocaleDateString() ===
                      checkInCheckoutRange.endDate.toLocaleDateString() ? (
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/user/view-rooms')}
                        sx={{
                          width: "100%",
                          p: 1,
                          borderRadius: 0,
                          borderColor: "red",
                          color: "red",
                          "&:hover": {
                            border: "1.5px solid red",
                            borderColor: "red",
                          },
                        }}
                      >
                        Select checkout date
                      </Button>
                    ) : (
                      <Button
                        className="book_room_btn"
                        variant="outlined"
                        sx={{ width: "100%", p: 1, borderRadius: 0 }}
                        color="inherit"
                        onClick={handlePayNow}
                      >
                        <span>Pay Now</span>
                      </Button>
                    ))}
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
