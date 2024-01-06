import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Container, ImageList, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PaymentSuccess } from '../../../assets/extraImages';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { getUpdatedUser } from '../../../actions/user';
import { RootState } from '../../../store/types';

const PaymentSuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);

  
  
  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="bold" display="flex" paddingBottom={2}>
            Payment Success!
          </Typography>

          <img
            src={PaymentSuccess}
            style={{ borderRadius: '15px', width: '100%', maxWidth: '350px', height: 'auto' }}
            alt="Payment Success..."
          />
        </Box>
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
          onClick={() => navigate(`/view-hotels`)}
        >
          <span>Book rooms</span>
        </Button>
        <Button
          variant="outlined"
          className="book_room_btn"
          sx={{ width: '20%', p: 1, borderRadius: 0 }}
          color="inherit"
          onClick={() => navigate(`/my-bookings`)}
        >
          <span>My Bookings</span>
        </Button>
      </Stack>
    </Container>
  );
};

export default PaymentSuccessScreen;
