import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { Favorite, FavoriteBorder, FavoriteOutlined, StarBorder } from "@mui/icons-material";
import { RootState } from "../../../store/types";
import PriceSlider from "../../../components/user/searchbar/PriceSlider";
import SearchBar from "../../../components/common/SearchBar";
import { NotFound, SpinnerGif } from "../../../assets/extraImages";
import { getHotels } from "../../../actions/hotel";
import { AppDispatch } from "../../../store/store";
import {filterHotels,setHotels, setOpenLogin } from "../../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HotelListScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const hotels = useSelector((state: RootState) => state.user.filteredHotels);
  const{ currentUser} = useSelector((state:RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allHotels, setAllHotels] = useState<any>([]);
  const hotelsPerPage = 6;
  
  useEffect(() => {
    if(!hotels.length){
    const fetchHotels = async () => {
      const response = await dispatch(getHotels());
      setAllHotels(response.payload.message);
      dispatch(setHotels(response.payload.message)); // assuming getHotels returns { payload: hotels }
    };

    fetchHotels();
  }
  }, [dispatch]);

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel)

  const handleSearch = (query: string) => {
    setLoading(true);
    
    setCurrentPage(1); // Reset to the first page when searching
    // Simulating a delay (remove this in the actual implementation)
    if(query.trim().length<=0){
      console.log('allHotels', allHotels)
      setTimeout(() => {
        dispatch(filterHotels(allHotels));
        setLoading(false);
      }, 1000); 
    }else{
      const newFilteredHotels:any = allHotels.filter(
      (hotel:any) =>
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

  const handleViewRoom = (hotelId:string) => {
    
    navigate(`/user/view-rooms?hotelId=${hotelId}`)
  }

  const handleWishlist = (hotelId:string) => {
    if(!currentUser){
      navigate('/user/login-register');
      dispatch(setOpenLogin(true));
      toast.warning('Please login to wishlist hotels!');
    }
  }
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Container>
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
          <Box
            sx={{
              position: "absolute",
              top: 50,
              left: "38%",
              width: "300px",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "250px",
            }}
            
          >
            <img src={SpinnerGif} alt="Loading..." />
          </Box>
        ) : currentHotels.length > 0 ? (
          currentHotels.map((hotel) => (
            <Tooltip title="Click to check room availability!" key={hotel._id} onClick={() => handleViewRoom(hotel._id)}>
              <Card sx={{ width: "100%", height: "270px" }} >
                <ImageListItem sx={{ height: "100% !important" }} >
                  <ImageListItemBar 
                    sx={{
                      background: "0",
                    }}
                    
                    title={hotel.hotelName}
                    subtitle={`𖡡 ${hotel.location}`}
                    actionIcon={<>
                       <Avatar src={hotel.dropImage} sx={{ m: "10px" }} />
                      <IconButton
                       onClick={() => handleWishlist(hotel._id)} // Add your wishlist logic here
                        sx={{ position: 'absolute', top: '55px', right: '10px',color:'white'}}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </>}
                    position="top"
                  />
                  <img
                    src={hotel.images[0]}
                    alt={hotel.hotelName}
                    style={{ cursor: "pointer" }}
                    loading="lazy"
                  />
                  {/* Want to give room starts from with  */}
                  <ImageListItemBar
                    title={`₹${hotel.minimumRent}`}
                    subtitle={"Rooms start from"}
                    actionIcon={
                      <Rating
                        sx={{ color: "rgba(255,255,255, 0.8)", mr: "5px" }}
                        name="hotelRating"
                        defaultValue={3.5}
                        precision={0.5}
                        emptyIcon={<StarBorder sx={{ color: "rgba(255,255,255, 0.8)" }} />}
                      />
                    }
                  />
                </ImageListItem>
              </Card>
            </Tooltip>
          ))
        ) : (
          <Card sx={{ textAlign: "center",boxShadow:0}}>
          <CardMedia
            component="img"
            alt="No Results Found"
            height="50"
            image={NotFound}
            loading="lazy"
            
          />
          <CardContent>
            <Typography variant="caption">No results found.</Typography>
            <Typography variant="caption">
              Try a different search.
            </Typography>
          </CardContent>
        </Card>
        )}
      </ImageList>
      <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
        {hotels.length > hotelsPerPage && (
          <Hidden mdDown>
            <Box>
              {Array.from({ length: Math.ceil(hotels.length / hotelsPerPage) }).map((_, index) => (
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
