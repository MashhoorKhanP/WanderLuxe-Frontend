import { Avatar, Button, Card, Container, ImageList, ImageListItem, ImageListItemBar, Rating, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { StarBorder } from '@mui/icons-material';
import { RootState } from '../../../store/types';

const HotelListScreen: React.FC = () => {
  const hotels = useSelector((state: RootState) => state.user.filteredHotels);
  console.log('hotelListScreen',hotels)
  return (
    <Container sx={{p:5}}>
      <ImageList gap={12} sx={{ mb: 8 ,gridTemplateColumns:'repeat(auto-fill,minmax(280px, 1fr)) !important'}}>
        {hotels.map((hotel) => (
              <Tooltip title='Click to check room availability!'>
          <Card key={hotel._id} sx={{width:'100%',height:'270px'}}>
            <ImageListItem sx={{ height: '100% !important' }}>
              
              <ImageListItemBar
              
                sx={{
                  background: '0',
                }}
                title={hotel.hotelName}
                subtitle={`𖡡 ${hotel.location}`}
                actionIcon={
                    <Avatar src={hotel.dropImage} sx={{ m: '10px' }} />
                }
                position='top'
                />
              <img src={hotel.images[0]} alt={hotel.hotelName} style={{cursor:'pointer'}} loading='lazy' />
              {/* Want to give room starts from with  */}
              <ImageListItemBar
                title={`₹${hotel.minimumRent}`}
                subtitle={'Rooms starts from'}
                actionIcon={
                  <Rating
                  sx={{ color: 'rgba(255,255,255, 0.8)', mr: '5px' }}
                    name='hotelRating'
                    defaultValue={3.5}
                    precision={0.5}
                    emptyIcon={<StarBorder sx={{ color: 'rgba(255,255,255, 0.8)' }} />}
                  />
                }
                />
               
            </ImageListItem>
          </Card>
                </Tooltip>
        ))}
      </ImageList>
    </Container>
  );
};

export default HotelListScreen;
