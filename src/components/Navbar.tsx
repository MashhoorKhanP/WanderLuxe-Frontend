import React from 'react'
import { Menu ,Lock} from '@mui/icons-material'
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import UserIcons from './user/UserIcons';
import { RootState } from '../store/types';
import { setOpenLogin } from '../store/slices/userSlice';


const Navbar: React.FC= () => {
  const dispatch = useDispatch();
  const{ currentUser} = useSelector((state:RootState) => state.user);
  const handleOpenLogin = () => {
    dispatch(setOpenLogin(true));
  }
  return (
    <AppBar position="static" sx={{ backgroundColor: '#9fa3a878' }}>
      <Container maxWidth='lg'>
       <Toolbar disableGutters>
        <Box>
          <IconButton size='large' sx={{display:{color:'#000000'}}}>
            <Menu/>
          </IconButton>
        </Box>
        <Typography variant='h6'
        component='h1'
        noWrap
        
        sx={{flexGrow:1, display:{xs:'none',md:'flex',color: '#000000'}}}
        >
          WanderLuxe
        </Typography>
        <Typography variant='h6'
        component='h1'
        noWrap
        sx={{flexGrow:1, display:{xs:'flex',md:'none',color: '#000000'}}}
        >
          WanderLuxe
        </Typography>
        {!currentUser ? (<Button color='inherit' sx={{display:{color: '#000000'}}} startIcon={<Lock/>} onClick={handleOpenLogin}>
          Login
        </Button>) : (<UserIcons/>)}
        
       </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar