import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import {jwtDecode} from 'jwt-decode'
import { logoutUser } from '../../store/slices/userSlice';

const useCheckToken: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (currentUser) {
      const decodedToken: any = jwtDecode(currentUser.token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        dispatch(logoutUser());
      }
    }
  }, [currentUser, dispatch]);

  return null;
};

export default useCheckToken