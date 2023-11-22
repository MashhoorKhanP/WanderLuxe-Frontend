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
  console.log(currentAdminToken)

  useEffect(() => {
    if (currentUserToken) {
      console.log('currentUserToken', currentUserToken)
      const decodedToken: any = jwtDecode(currentUserToken);
      console.log('DecodeToken.expiry',decodedToken.exp)
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        toast.warning('Sessions expired, Please log in again');
        dispatch(logoutUser());
      }
    }
  }, [currentUserToken, dispatch]);

  useEffect(() => {
    if (currentAdminToken) {
      console.log('currentAdmin.token',currentAdminToken);
      const decodedToken: any = jwtDecode(currentAdminToken);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        toast.warning('Sessions expired, Please log in again');
        dispatch(logoutAdmin());
        navigate('/admin/login')
      }
    }
  }, [currentAdminToken, dispatch]);
  return null;
};

export default useCheckToken