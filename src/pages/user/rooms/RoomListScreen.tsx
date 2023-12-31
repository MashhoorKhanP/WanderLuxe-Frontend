import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRooms } from "../../../actions/room";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Hidden,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowBack, StarBorder } from "@mui/icons-material";
import {
  filterRooms,
  setRooms,
} from "../../../store/slices/userSlices/userSlice";
import SearchBar from "../../../components/common/SearchBar";
import PriceSlider from "../../../components/user/searchbar/PriceSlider";
import MyDatePicker from "./MyDatePicker";
import {
  openRoomOverview,
  setRoomBookings,
  setRoomId,
} from "../../../store/slices/userSlices/roomSlice";
import AdultChildrenPicker, { Options } from "./AdultChildrenPicker";
import { getBookings, getHotelBookings } from "../../../actions/booking";

const RoomListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const rooms: any = useSelector(
    (state: RootState) => state.user.filteredRooms
  );
  const [loading, setLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allRooms, setAllRooms] = useState<any>([]);
  const [searchParams] = useSearchParams();
  const [hotelBookings, setHotelBookings] = useState<any>([]);
  const fullHotelBookings: any = useSelector(
    (state: RootState) => state.user.hotelBookings
  );
  const checkInCheckoutRange: any = useSelector(
    (state: RootState) => state.room.checkInCheckOutRange
  );

  const adultChildOptions: Options = useSelector(
    (state: RootState) => state.room.adultChildrenOptions
  );
  const roomsPerPage = 6;

  const hotelId = searchParams.get("hotelId");

  const toggleDatePicker = () => {
    setIsDatePickerOpen((prev) => !prev);
  };

  console.log('adultsChild', adultChildOptions.adult + adultChildOptions.children);
  useEffect(() => {
    if (!rooms.length || !allRooms.length) {
      const fetchRooms = async () => {
        const response = await dispatch(getRooms());
        setAllRooms(response.payload.message);
        dispatch(setRooms(response.payload.message)); // assuming getHotels returns { payload: hotels }
      };
      fetchRooms();
    }
    setAllRooms(rooms);

    if (!hotelBookings.length) {
      const fetchBookings = async () => {
        const hotelDetails = {
          hotelId: hotelId as string,
        };
        // console.log('hotelDetails', hotelDetails)
        const response = await dispatch(getHotelBookings({ hotelDetails }));
      };

      fetchBookings();
    }
    setHotelBookings(fullHotelBookings);
  }, [dispatch, allRooms, hotelBookings]); //check this video:https://www.youtube.com/fwatch?v=puP_cXa_Cuo&t=783s ,Check chatGpt last prompt

  console.log("fullHotelBookings", fullHotelBookings);
  const indexOfLastRooms = currentPage * roomsPerPage;
  const indexOfFirstRooms = indexOfLastRooms - roomsPerPage;
  const currentRooms = rooms
    .slice(indexOfFirstRooms, indexOfLastRooms)
    .filter((room: any) => room.hotelId === hotelId && adultChildOptions.adult + adultChildOptions.children <= room.maxPeople );

    const isRoomAvailable = (
      room: any,
      checkInDate: Date,
      checkOutDate: Date
    ) => {
      const roomBookings = hotelBookings.filter(
        (booking: any) => booking.roomId === room._id
      );
    
      const isAvailable = roomBookings.every((booking: any) => {
        const bookingCheckInDate = new Date(booking.checkInDate);
        const bookingCheckOutDate = new Date(booking.checkOutDate);
        const bookedRoomsCount = booking.totalRoomsCount;
    
        return (
          bookingCheckInDate >= checkOutDate || bookingCheckOutDate <= checkInDate
        );
      });
    
      // Check if the room has enough capacity for adults and children
      const hasEnoughCapacity =
        adultChildOptions.adult + adultChildOptions.children <= room.maxPeople;
    
      return isAvailable && hasEnoughCapacity;
    };
    
    let filteredRooms;
    if (checkInCheckoutRange.startDate === checkInCheckoutRange.endDate) {
      filteredRooms = currentRooms;
    } else {
      filteredRooms = currentRooms.filter((room: any) => {
        const checkInDate = new Date(checkInCheckoutRange.startDate);
        const checkOutDate = new Date(checkInCheckoutRange.endDate);
    
        return isRoomAvailable(room, checkInDate, checkOutDate);
      });
    }

  console.log("filteredRooms", filteredRooms);
  const handleSearch = (query: string) => {
    setLoading(true);

    setCurrentPage(1); // Reset to the first page when searching
    // Simulating a delay (remove this in the actual implementation)
    if (query.trim().length <= 0) {
      console.log("allRooms", allRooms);
      setTimeout(() => {
        dispatch(filterRooms(allRooms));
        setLoading(false);
      }, 1000);
    } else {
      const newFilteredRooms: any = allRooms.filter((room: any) =>
        room.roomType.toLowerCase().includes(query.toLowerCase())
      );

      setTimeout(() => {
        dispatch(filterRooms(newFilteredRooms));
        setLoading(false);
      }, 1000);
    }
    // Simulating a delay (remove this in the actual implementation)
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCardClick = (roomId: string) => {
    dispatch(openRoomOverview()); // Dispatch an action to open the RoomOverviewScreen
    dispatch(setRoomId(roomId));
    // navigate('/view-rooms/room-overview');
  };
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
        <Typography variant="h5" fontWeight="bold">{`${
          filteredRooms[0]?.hotelName
            ? filteredRooms[0]?.hotelName
            : "Not Found"
        } - Rooms`}</Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-around"}
        alignItems={"center"}
        pb={2}
        gap={2}
      >
        <SearchBar onSearch={handleSearch} />
        <MyDatePicker isOpen={isDatePickerOpen} onToggle={toggleDatePicker} />
        <AdultChildrenPicker />
        <PriceSlider />
      </Box>

      <ImageList
        gap={12}
        sx={{
          mb: 8,
          gridTemplateColumns:
            "repeat(auto-fill,minmax(280px, 1fr)) !important",
        }}
      >
        {loading ? (
          <Box
            sx={{
              position: "absolute",
              top: 50,
              width: "300px",
              mt: "4%",
              ml: "35%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "250px",
            }}
          >
            <img src={import.meta.env.VITE_SPINNER_GIF} alt="Loading..." />
          </Box>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room: any) => (
            <Tooltip title="Click to view more details!" key={room._id}>
              <Card
                sx={{ width: "100%", height: "270px" }}
                onClick={() => handleCardClick(room._id)}
              >
                <ImageListItem sx={{ height: "100% !important" }}>
                  <ImageListItemBar
                    sx={{
                      background: "0",
                    }}
                    title={room.roomType}
                    subtitle={`${room.hotelName}`}
                    // actionIcon={<Avatar src={hotel.dropImage} sx={{ m: "10px" }} />}
                    position="top"
                  />
                  <img
                    src={room.images[0]}
                    alt={room.roomType}
                    style={{ cursor: "pointer" }}
                  />
                  {/* Want to give room starts from with  */}
                  <ImageListItemBar
                    title={
                      <>
                        ₹{room.price}&nbsp;
                        <Typography
                          component="span"
                          variant="subtitle1"
                          sx={{
                            textDecoration: "line-through",
                            fontSize: "14px",
                            color: "rgb(213 211 211)",
                          }}
                        >
                          ₹{room.price + room.discountPrice}
                        </Typography>
                      </>
                    }
                    subtitle={
                      <>
                        {room.amenities.map(
                          (amenity: string, index: number) => (
                            <React.Fragment key={index}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  display: "inline",
                                  fontSize: "12px",
                                  color: "rgb(213 211 211)",
                                }}
                              >
                                {amenity}
                              </Typography>
                              {index >= 0 &&
                              index < room.amenities.length - 1 ? (
                                <span>,&nbsp;</span>
                              ) : (
                                ""
                              )}
                            </React.Fragment>
                          )
                        )}
                      </>
                    }
                    actionIcon={
                      <Rating
                        sx={{ color: "rgba(255,255,255, 0.8)", mr: "5px" }}
                        name="hotelRating"
                        defaultValue={3.5}
                        precision={0.5}
                        emptyIcon={
                          <StarBorder
                            sx={{ color: "rgba(255,255,255, 0.8)" }}
                          />
                        }
                      />
                    }
                  />
                </ImageListItem>
              </Card>
            </Tooltip>
          ))
        ) : (
          <Card sx={{ textAlign: "center", boxShadow: 0 }}>
            <CardMedia
              component="img"
              alt="No Results Found"
              height="50"
              image={import.meta.env.VITE_NOTFOUND_GIF}
            />
            <CardContent>
              <Typography variant="caption">No results found.</Typography>
              <Typography variant="caption">Try a different search.</Typography>
            </CardContent>
          </Card>
        )}
      </ImageList>
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
        {rooms.length > roomsPerPage && (
          <Hidden mdDown>
            <Box>
              {Array.from({
                length: Math.ceil(rooms.length / roomsPerPage),
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

export default RoomListScreen;
