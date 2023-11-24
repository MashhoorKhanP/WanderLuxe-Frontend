import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import {jwtDecode} from 'jwt-decode'
import { logoutUser } from '../../store/slices/userSlice';
import { logoutAdmin } from '../../store/slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useCheckToken = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserToken = localStorage.getItem('UserToken')
  const currentAdminToken = localStorage.getItem('AdminToken')//change currentAdmin make slice 
  
  useEffect(() => {
    if (currentUserToken) {
      const decodedToken: any = jwtDecode(currentUserToken);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        toast.warning('Sessions timeout, Please log in again');
        dispatch(logoutUser());
      }
    }
  }, [currentUserToken, dispatch]);

  useEffect(() => {
    if (currentAdminToken) {
      const decodedToken: any = jwtDecode(currentAdminToken);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        toast.warning('Sessions timeout, Please log in again');
        dispatch(logoutAdmin());
        navigate('/admin/login')
      }
    }
  }, [currentAdminToken, dispatch]);
  return null;
};

export default useCheckToken