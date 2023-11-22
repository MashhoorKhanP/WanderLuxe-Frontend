import React from 'react'
import { Backdrop, CircularProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../store/types';

const Loading:React.FC= () => {
  const {loading}= useSelector((state:RootState) => state.user);
  const {adminLoading} = useSelector((state:RootState) => state.admin);
  
  return (
    <Backdrop
    open={loading || adminLoading}
    sx={{zIndex:(theme) => theme.zIndex.modal + 1}}>
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}

export default Loading