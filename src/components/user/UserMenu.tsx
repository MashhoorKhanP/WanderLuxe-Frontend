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

  const testAuthorization = async () => { //here test authorization for auth and just check it is userfull for profile routing
  
    const url = '/user/signup';
    try {
      const response = await Api.post(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser?.token}`
          }
        }
      );
      const data = await response.data;
      console.log(data);
      if(!data.success){
        if(response.status === 401) dispatch(logoutUser());
        throw new Error(data.message)
      }
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError;
      dispatch(setAlert({ open: true, severity: 'error', message: axiosError.message }));
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