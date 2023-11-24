import React from 'react'
import { Logout, ManageAccounts } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import { logoutUser, updateUserProfile } from '../../store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import useCheckToken from '../hooks/useCheckToken';
import { RootState } from '../../store/types';
import Profile from './Profile'

interface UserMenuProps{
  anchorUserMenu: HTMLElement | null;
  setAnchorUserMenu:React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

interface ProfileOpen {
  open?: boolean;
  file?: File | null | undefined;
  profileImage?: string;
}

const UserMenu : React.FC<UserMenuProps> = ({anchorUserMenu,setAnchorUserMenu}) => {
  const checkToken = useCheckToken();
  const dispatch = useDispatch();

  const{ currentUser} = useSelector((state:RootState) => state.user);

  const handleCloseUserMenu = () =>{
    setAnchorUserMenu(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleOpenProfile = () => {
    const profileUpdate: Partial<ProfileOpen> = {
      open:true,
      file:null,
      profileImage:currentUser?.profileImage,
      
    };
    dispatch(updateUserProfile({...currentUser,...profileUpdate}))
  }
  checkToken;
  return (
    <>
    <Menu anchorEl={anchorUserMenu} 
   open={Boolean(anchorUserMenu)}
   onClose={handleCloseUserMenu}
   onClick={handleCloseUserMenu}
   >
    <MenuItem onClick={handleOpenProfile}>
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
   <Profile/>
    </>
   
  )
}

export default UserMenu