import { Check, Save } from '@mui/icons-material';
import { Box, CircularProgress, Fab } from '@mui/material';
import { green } from '@mui/material/colors';
import React, { useState,useEffect } from 'react';
import { updateUser } from '../../../../actions/admin';

interface UsersActionsProps {
  params: {
    row: {
      isVerified: boolean;
      isBlocked: boolean;
      _id: string;
      // Add other properties from your 'params' object
    };
    // Add other properties from your 'params' object
  };
  selectedRowId:string;
  setRowId: React.Dispatch<React.SetStateAction<string>>;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string>>;
}

const UsersActions: React.FC<UsersActionsProps> = ({params,selectedRowId,setRowId,setSelectedRowId}) => {
  const [loading, setLoading] = useState(false);
  const [success,setSuccess] = useState(false);
  
  
  const handleSubmit = async() => {
    setLoading(true);
    setTimeout(async() => {
      const {isVerified,isBlocked,_id} = params.row
        console.log('Params.row',params.row,isVerified,isBlocked)
        try {
          // Assuming updateUser is an asynchronous action (thunk)
          const result = await updateUser(isVerified, isBlocked,_id);
          if(result){
            setSuccess(true);
            setRowId('');
            setSelectedRowId('');
          }
        } catch (error) {
          // Handle error if needed
          console.error('Error updating user:', error);
        } finally {
          setLoading(false);
        }
    },1000)
  };

  useEffect(() => {
      if(selectedRowId === params.row._id && success) setSuccess(false)
    },[selectedRowId])
  
  return (
    <Box sx={{
      m:1,
      position:'relative'
    }}
    >
      {success ? (
        <Fab 
        color='primary'
        sx={{
          width:40,
          height:40,
          bgcolor:green[500],
          '&:hover':{bgcolor:green[700]}
        }}
        >
          <Check/>
        </Fab>
      ):(
        <Fab 
        color='primary'
        sx={{
          width:40,
          height:40,
        }}
        disabled={params.row._id!== selectedRowId || loading}
        onClick={handleSubmit}
        >
          <Save/>
        </Fab>
      )}
      {
        loading && (
          <CircularProgress
          size={52}
          sx={{
            color:green[500],
            position:'absolute',
            top:-6,
            left:-6,
            zIndex:1
          }}
          />

        )
      }
    </Box>
  );
};

export default UsersActions;