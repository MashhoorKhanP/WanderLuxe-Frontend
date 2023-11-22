import React from 'react'
import { Logout, ManageAccounts } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import { logoutUser } from '../../store/slices/userSlice';
import { useDispatch } from 'react-redux';
import useCheckToken from '../hooks/useCheckToken';

interface UserMenuProps{
  anchorUserMenu: HTMLElement | null;
  setAnchorUserMenu:React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const UserMenu : React.FC<UserMenuProps> = ({anchorUserMenu,setAnchorUserMenu}) => {
  const checkToken = useCheckToken();
  const dispatch = useDispatch();

  const handleCloseUserMenu = () =>{
    setAnchorUserMenu(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  checkToken;
  return (
   <Menu anchorEl={anchorUserMenu} 
   open={Boolean(anchorUserMenu)}
   onClose={handleCloseUserMenu}
   onClick={handleCloseUserMenu}
   >
    <MenuItem>
      <ListItemIcon>
        <ManageAccounts fontSize='small'/>
      </ListItemIcon>
      Profile
    </MenuItem>
    <MenuItem onClick={handleLogout}>
      <ListItemIcon>
        <Logout fontSize='small'/>
      </ListItemIcon>
      Logout
    </MenuItem>
   </Menu> 
  )
}

export default UserMenu