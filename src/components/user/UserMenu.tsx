import React from 'react'
import { Logout, ManageAccounts } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import { logoutUser, setAlert, updateUser } from '../../store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/types';
import Api from '../../service/axios';
import axios,{AxiosError} from 'axios';
import useCheckToken from '../hooks/useCheckToken';

interface UserMenuProps{
  anchorUserMenu: HTMLElement | null;
  setAnchorUserMenu:React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const UserMenu : React.FC<UserMenuProps> = ({anchorUserMenu,setAnchorUserMenu}) => {
  useCheckToken;
  const dispatch = useDispatch();
  const{ currentUser} = useSelector((state:RootState) => state.user);

  const handleCloseUserMenu = () =>{
    setAnchorUserMenu(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  

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