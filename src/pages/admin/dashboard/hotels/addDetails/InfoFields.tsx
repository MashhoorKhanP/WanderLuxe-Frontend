import { Avatar, Container, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import pendingIcon from '../icons/progress4.gif'
import { updateHotelDetails } from '../../../../../store/slices/adminSlice';

interface InfoFieldsProps {
  mainProps: {};
  optionalProps?: {};
  minLength: number;
}

const InfoFields: React.FC<InfoFieldsProps> = ({mainProps,optionalProps={},minLength}) => {
 const dispatch = useDispatch();

  const [editing , setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  let timer:number | any;
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateHotelDetails({[e.target.name] : e.target.value}))
    if(!editing) setEditing(true);
    clearTimeout(timer)
    timer = setTimeout(() => {
      setEditing(false);
      if(e.target.value.length< minLength){
        if(!error) setError(true);
        if(success) setSuccess(false);
      }else{
        if(error) setError(false);
        if(!success) setSuccess(true);
      }
    }, 1500)

  }

  return (
    <TextField
    {...mainProps}
    {...optionalProps}
    error = {error}
    helperText = {error && minLength>0 ?(`This field must be contain ${minLength} values.`) :error && minLength===0 ?('This field is required') : ('') }
    color = {success ? 'success' : 'primary'}
    variant='outlined'
    onChange={handleChange}
    required
    InputProps={{

      endAdornment:(
        <InputAdornment position='end'>
          {editing && (
            <Avatar src={pendingIcon} sx={{width:50, height:25}}/>
          )}
        </InputAdornment>
      )
    }}
    />
  );
};

export default InfoFields;