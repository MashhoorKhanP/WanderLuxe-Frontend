import React from 'react';
import { Box, Button, Container, ImageList, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PaymentSuccess } from '../../../assets/extraImages';

const PaymentSuccessScreen: React.FC = () => {
  const navigate = useNavigate();

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
          onClick={() => navigate(`/user/view-hotels`)}
        >
          <span>Book rooms</span>
        </Button>
        <Button
          variant="outlined"
          className="book_room_btn"
          sx={{ width: '20%', p: 1, borderRadius: 0 }}
          color="inherit"
          onClick={() => navigate(`/user/home`)}
        >
          <span>Back to home</span>
        </Button>
      </Stack>
    </Container>
  );
};

export default PaymentSuccessScreen;
