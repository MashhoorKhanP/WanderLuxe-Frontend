import React from 'react';
import BackgroundImage from '../../../../src/assets/backgroundImage.jpg'
import {HomeImage2} from '../../../assets/extraImages'
import { Box, Dialog } from '@mui/material';

const HomeScreen: React.FC = () => {
 
  return (
    <>
    <Box  sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <img src={BackgroundImage} style={{width:'50%'}}/>
      <img src={HomeImage2} style={{width:'50%'}}/>
    </Box>
    </>
  );
};

export default HomeScreen;