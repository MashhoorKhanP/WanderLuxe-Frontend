import React,{useEffect,useState} from 'react';
import { Delete, Edit, Preview } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/types';
import { deleteHotel, getHotels } from '../../../../actions/hotel';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { updateHotelDetails, updateHotelImages, updateHotels, updateLocation, updateUpdatedHotel } from '../../../../store/slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../../store/store';

interface HotelsActionsProps {
  params: any;
  setData:any;
}

const HotelsActions: React.FC<HotelsActionsProps>= ({params,setData}) => {
  console.log('HotelsActionsParams.row',params
  .row);
  const {_id,longitude,latitude,hotelName,minimumRent,parkingPrice,images,description,distanceFromCityCenter,location,email,mobile} = params.row;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const { currentAdmin } = useSelector((state: RootState) => state.admin);

  const handleEdit= () => {
    dispatch(updateHotelImages([]));
    dispatch(updateLocation({longitude,latitude}))
    dispatch(updateHotelDetails({hotelName,minimumRent,parkingPrice,description,distanceFromCityCenter,location,email,mobile}))
    dispatch(updateHotelImages(images))
    dispatch(updateUpdatedHotel({_id,hotelName,minimumRent,parkingPrice,description,distanceFromCityCenter,location,email,mobile}))
    console.log('reached to navigate')
    navigate('/admin/dashboard/hotels/edit-hotel');
  }

  const handleDelete = async(row:any,admin:any) => {
    Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete ${row.hotelName} hotel!`,
    icon:'error',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'No, cancel!',
    customClass: {
      container: 'custom-swal-container',
    },
    width: 400, // Set your desired width
    background: '#f0f0f0',
    iconHtml:'<i class="bi bi-trash" style="font-size:30px"></i>'
  }).then(async(result) => {
    if (result.isConfirmed) {
        dispatch(deleteHotel({ hotelData: row, admin }))
        toast.success('Hotels deleted successfully');
        setData((prevData:any) => !prevData);
    }
  })
};
  
  return (
    <Box>
      {/* <Tooltip title='View hotel details'>
          <IconButton onClick={() => {}}>
            <Preview/>
          </IconButton>
      </Tooltip> */}
      <Tooltip title='Edit this hotel'>
          <IconButton onClick={() => handleEdit()}>
            <Edit/>
          </IconButton>
      </Tooltip>
      {/* <Tooltip title='Delete this room'>
          <IconButton onClick={() => handleDelete(params.row,currentAdmin as any)}>
            <Delete/>
          </IconButton>
      </Tooltip> */}
    </Box>
  );
};

export default HotelsActions;