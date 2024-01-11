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
  Button,
  Card,
  Container,
  Hidden,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { getHotels } from "../../../actions/hotel";
import { addRemoveFromWishlist } from "../../../actions/user";
import { setHotels } from "../../../store/slices/userSlices/userSlice";
import { AppDispatch } from "../../../store/store";
import { RootState } from "../../../store/types";

const WishListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const hotels = useSelector((state: RootState) => state.user.hotels); //Check either fileteredHotels or not
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [allHotels, setAllHotels] = useState<any>([]);
  const hotelsPerPage = 6;

  useEffect(() => {
    if (!hotels.length || !allHotels.length) {
      const fetchHotels = async () => {
        const response = await dispatch(getHotels());
        setAllHotels(response.payload.message);
        dispatch(setHotels(response.payload.message)); // assuming getHotels returns { payload: hotels }
      };

      fetchHotels();
    }
  }, [dispatch, allHotels]);

  const handleViewRoom = (hotelId: string) => {
    navigate(`/view-rooms?hotelId=${hotelId}`);
  };

  const handleWishlist = (hotelId: string, hotelName: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to remove ${hotelName} from wishlist!`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "No, cancel!",
      customClass: {
        container: "custom-swal-container",
      },
      width: 400, // Set your desired width
      background: "#f0f0f0",
      iconHtml: '<i class="bi bi-trash" style="font-size:30px"></i>',
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(
          addRemoveFromWishlist({
            wishlistData: {
              hotelId,
              userId: currentUser?._id as string,
            },
          })
        );
        navigate("/wishlist");
        toast.success("Hotel removed from wishlist!");
      }
    });
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels
    .filter((hotel) => currentUser?.wishlist?.includes(hotel._id))
    .slice(indexOfFirstHotel, indexOfLastHotel);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        <Typography variant="h5" fontWeight="bold">
          Wishlist
        </Typography>
      </Box>
      <ImageList
        gap={12}
        sx={{
          paddingTop: 2,
          display: currentHotels.length > 0 ? "" : "flex",
          mb: 8,
          gridTemplateColumns:
            "repeat(auto-fill,minmax(280px, 1fr)) !important",
        }}
      >
        {currentHotels.length <= 0 ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              display="flex"
              padding={2}
            >
              Your wishlist is empty!
            </Typography>
            <img
              src={import.meta.env.VITE_WISHLISTEMPTY_IMAGE}
              style={{ borderRadius: "15px", width: "100%", maxWidth: "360px" }}
              alt="Empty wishlist..."
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
                <span>Wishtlist Now</span>
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
                        <Avatar src={hotel.dropImage} sx={{ m: "10px" }} />
                        <Tooltip
                          title={
                            currentUser?.wishlist?.includes(hotel._id)
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <IconButton
                            onClick={() =>
                              handleWishlist(hotel._id, hotel.hotelName)
                            } // Add your wishlist logic here
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
                    loading="lazy"
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
          ""
        )}
      </ImageList>
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
        {currentHotels.length > hotelsPerPage && (
          <Hidden mdDown>
            <Box>
              {Array.from({
                length: Math.ceil(currentHotels.length / hotelsPerPage),
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

export default WishListScreen;
