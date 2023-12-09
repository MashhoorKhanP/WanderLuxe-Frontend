import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { useSearchParams } from 'react-router-dom';
import { getRooms } from '../../../actions/room';
import { Box, Card, CardContent, CardMedia, Container, Hidden, ImageList, ImageListItem, ImageListItemBar, Rating, Tooltip, Typography } from '@mui/material';
import { NotFound, SpinnerGif } from '../../../assets/extraImages';
import { StarBorder } from '@mui/icons-material';
import { filterRooms, setRooms } from '../../../store/slices/userSlice';
import SearchBar from '../../../components/common/SearchBar';
import PriceSlider from '../../../components/user/searchbar/PriceSlider';

const RoomListScreen: React.FC = () => {
 const dispatch  = useDispatch<AppDispatch>();
 const rooms:any = useSelector((state: RootState) => state.user.filteredRooms);
 const [loading, setLoading] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
 const [allRooms, setAllRooms] = useState<any>([]);
 const [searchParams] = useSearchParams();
 const roomsPerPage = 6;

 const hotelId = searchParams.get('hotelId');
 

 useEffect(() => {
  if(!rooms.length){
    const fetchRooms = async () => {
    const response = await dispatch(getRooms());
    setAllRooms(response.payload.message);
    dispatch(setRooms(response.payload.message)); // assuming getHotels returns { payload: hotels }
  };
  fetchRooms();
  }
}, [dispatch]);

  const indexOfLastHotel = currentPage * roomsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstHotel, indexOfLastHotel).filter((room:any) => room.hotelId === hotelId);
  
  const handleSearch = (query: string) => {
    setLoading(true);
    
    setCurrentPage(1); // Reset to the first page when searching
    // Simulating a delay (remove this in the actual implementation)
    if(query.trim().length<=0){
      console.log('allRooms', allRooms)
      setTimeout(() => {
        dispatch(filterRooms(allRooms));
        setLoading(false);
      }, 1000); 
    }else{
      const newFilteredRooms:any = allRooms.filter(
      (room:any) =>
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
        ) : currentRooms.length > 0 ? (
          currentRooms.map((room:any) => (
            <Tooltip title="Click to view more details!" key={room._id}>
              <Card sx={{ width: "100%", height: "270px" }} >
                <ImageListItem sx={{ height: "100% !important" }} >
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
                    loading="lazy"
                  />
                  {/* Want to give room starts from with  */}
                  <ImageListItemBar
                     title={
                      <>
                        ₹{room.price}&nbsp;
                        <Typography component="span" variant="subtitle1" sx={{ textDecoration: 'line-through',fontSize:'14px', color: 'rgb(213 211 211)' }}>
                          ₹{room.price + room.discountPrice}
                        </Typography>
                      </>                   
                     }
                     subtitle={
                      <>
                      {room.amenities.map((amenity: string, index: number) => (
                        <React.Fragment key={index}>
                          <Typography variant="subtitle2" sx={{ display: 'inline', fontSize: '12px', color: 'rgb(213 211 211)' }}>
                            {amenity}
                          </Typography>
                          {index >= 0 && index < room.amenities.length - 1 ?<span>,&nbsp;</span>:''}
                        </React.Fragment>
                      ))}
                    </>
                     }

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
        {rooms.length > roomsPerPage && (
          <Hidden mdDown>
            <Box>
              {Array.from({ length: Math.ceil(rooms.length / roomsPerPage) }).map((_, index) => (
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