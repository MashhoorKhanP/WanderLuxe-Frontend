import React from 'react'
import { Logout, ManageAccounts } from '@mui/icons-material';
import { ListItemIcon, Menu, MenuItem } from '@mui/material'
import { logoutUser, setAlert } from '../../store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/types';

interface UserMenuProps{
  anchorUserMenu: HTMLElement | null;
  setAnchorUserMenu:React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const UserMenu : React.FC<UserMenuProps> = ({anchorUserMenu,setAnchorUserMenu}) => {
  const dispatch = useDispatch();
  const{ currentUser} = useSelector((state:RootState) => state.user);

  const handleCloseUserMenu = () =>{
    setAnchorUserMenu(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const testAuthorization = async () => { //here test authorization for auth and just check it is userfull for profile routing
  
    const url = import.meta.env.VITE_SERVER_URL + '/api/user/signup';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${currentUser?.token}` // Use non-null assertion here
        }
      });
      const data = await response.json();
      console.log(data);
      if(!data.success){
        throw new Error(data.message)
      }
    } catch (error) {
      const typedError = error as Error;
      dispatch(setAlert({ open: true, severity: 'error', message: typedError.message }));
    }
  };
  

  return (
   <Menu anchorEl={anchorUserMenu} 
   open={Boolean(anchorUserMenu)}
   onClose={handleCloseUserMenu}
   onClick={handleCloseUserMenu}
   >
    <MenuItem onClick={testAuthorization}>
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