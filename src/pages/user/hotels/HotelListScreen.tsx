import {
  ArrowBack,
  BedOutlined,
  Favorite,
  FavoriteBorder,
  StarBorder,
} from "@mui/icons-material";
import {
  Avatar,
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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getHotels } from "../../../actions/hotel";
import { addRemoveFromWishlist } from "../../../actions/user";
import SearchBar from "../../../components/common/SearchBar";
import PriceSlider from "../../../components/user/searchbar/PriceSlider";
import {
  setAdultChildrenOptions,
  setCheckInCheckOutRange,
} from "../../../store/slices/userSlices/roomSlice";
import {
  filterHotels,
  setHotels,
  setOpenLogin,
} from "../../../store/slices/userSlices/userSlice";
import { AppDispatch } from "../../../store/store";
import { RootState } from "../../../store/types";

const HotelListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const hotels = useSelector((state: RootState) => state.user.filteredHotels);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allHotels, setAllHotels] = useState<any>([]);
  const hotelsPerPage = 6;

  const getTodayOrTomorrowDate = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // If the current hour is before 6 PM, return the current date
    // Otherwise, return the date of tomorrow
    return currentHour < 18
      ? currentDate
      : new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  };

  const today = getTodayOrTomorrowDate();

  useEffect(() => {
    if (!hotels.length || !allHotels.length) {
      const fetchHotels = async () => {
        const response = await dispatch(getHotels());
        setAllHotels(response.payload.message);
        dispatch(setHotels(response.payload.message)); // assuming getHotels returns { payload: hotels }
      };

      fetchHotels();
    }
    dispatch(setCheckInCheckOutRange({}));
    dispatch(
      setCheckInCheckOutRange({
        startDate: today,
        endDate: today,
        startTime: "",
        endTime: "",
        numberOfNights: 1,
      })
    );
    dispatch(
      setAdultChildrenOptions({
        adult: 1,
        children: 0,
      })
    );
  }, [dispatch, allHotels]);

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);

  const handleSearch = (query: string) => {
    setLoading(true);

    setCurrentPage(1); // Reset to the first page when searching
    // Simulating a delay (remove this in the actual implementation)
    if (query.trim().length <= 0) {
      console.log("allHotels", allHotels);
      setTimeout(() => {
        dispatch(filterHotels(allHotels));
        setLoading(false);
      }, 1000);
    } else {
      const newFilteredHotels: any = allHotels.filter(
        (hotel: any) =>
          hotel.hotelName.toLowerCase().includes(query.toLowerCase()) ||
          hotel.location.toLowerCase().includes(query.toLowerCase())
      );

      setTimeout(() => {
        dispatch(filterHotels(newFilteredHotels));
        setLoading(false);
      }, 1000);
    }
    // Simulating a delay (remove this in the actual implementation)
  };

  const handleViewRoom = (hotelId: string) => {
    navigate(`/view-rooms?hotelId=${hotelId}`);
  };

  const handleWishlist = (hotelId: string) => {
    if (!currentUser) {
      navigate("/login-register");
      dispatch(setOpenLogin(true));
      toast.warning("Please login to wishlist hotels!");
    } else {
      dispatch(
        addRemoveFromWishlist({
          wishlistData: {
            hotelId,
            userId: currentUser?._id as string,
          },
        })
      );
      navigate("/view-hotels");
    }
  };
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        paddingTop={4}
        flexDirection="row"
      >
        <IconButton onClick={() => navigate("/home")}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Hotels
        </Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pb={2}
      >
        <SearchBar onSearch={handleSearch} />
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
          <ImageList
            sx={{ padding: 14, justifyContent: "center", alignItems: "center" }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "300px",
                height: "100vh",
                ml: "25%",
                mt: "4%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={import.meta.env.VITE_SPINNER_GIF} alt="Loading..." />
            </Box>
          </ImageList>
        ) : currentHotels.length > 0 ? (
          currentHotels.map((hotel) => (
            <Tooltip title="" key={hotel._id}>
              <Card sx={{ width: "100%", height: "270px" }}>
                <ImageListItem sx={{ height: "100% !important" }}>
                  <ImageListItemBar
                    sx={{
                      background: "0",
                    }}
                    title={hotel.hotelName}
                    subtitle={`𖡡 ${hotel.location}`}
                    actionIcon={
                      <>
                        <Avatar src={hotel.dropImage} sx={{ m: "14px",width:'35px',height:'35px' }} />
                        <Tooltip
                          title={
                            currentUser?.wishlist?.includes(hotel._id)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <IconButton
                            onClick={() => handleWishlist(hotel._id)} // Add your wishlist logic here
                            sx={{
                              position: "absolute",
                              top: "55px",
                              right: "10px",
                              color: "white",
                              transition: "color 0.3s ease",
                              "&:hover": { color: "red" },
                            }}
                          >
                            {currentUser?.wishlist?.includes(hotel._id) ? (
                              <Favorite sx={{ color: "red" }} />
                            ) : (
                              <FavoriteBorder />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Rooms">
                          <IconButton
                            onClick={() => handleViewRoom(hotel._id)} // Add your wishlist logic here
                            sx={{
                              position: "absolute",
                              top: "85px",
                              right: "10px",
                              color: "white",
                              transition: "color 0.3s ease",
                              "&:hover": { color: "red" },
                            }}
                          >
                            <BedOutlined
                              sx={{
                                color: "white",
                                transition: "color 0.3s ease",
                                "&:hover": { color: "red" },
                              }}
                              onClick={() => handleViewRoom(hotel._id)}
                            />
                          </IconButton>
                        </Tooltip>
                      </>
                    }
                    position="top"
                  />
                  <img
                    src={hotel.images[0]}
                    alt={hotel.hotelName}
                    // style={{ cursor: "pointer" }}
                  />
                  {/* Want to give room starts from with  */}
                  <ImageListItemBar
                    onClick={() => handleViewRoom(hotel._id)}
                    title={`₹${hotel.minimumRent}`}
                    subtitle={"Rooms start from"}
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
        {hotels.length > hotelsPerPage && (
          <Hidden mdDown>
            <Box>
              {Array.from({
                length: Math.ceil(hotels.length / hotelsPerPage),
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

export default HotelListScreen;
