// import React, { useState } from 'react';
// import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, List, ListItem, MenuItem, Popover, Select, Stack, TextField } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../../../store/types';
// import { SelectInputProps } from '@mui/material/Select/SelectInput';
// import RoomInfoFields from './RoomInfoFields';
// import { updateRoomDetails } from '../../../../../store/slices/adminSlice';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// type RoomFields = {
//  hotelName: string;
//  amenities: string[];
// };

// type Hotel = {
//  _id: string;
//  hotelName: string;
// };

// const AddDetails: React.FC = () => {
// const dispatch = useDispatch();
// const navigate = useNavigate();
// const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
//   const [extraAmenity, setExtraAmenity] = useState<string>('');
//   const [amenityError, setAmenityError] = useState<string>('');
// const hotels: any = useSelector((state: RootState) => state.admin.allHotels);
// const roomDetails:any = useSelector((state:RootState) => state.admin.roomDetails);
// console.log('roomDetails ',roomDetails)

//  const [roomFields, setRoomDetails] = useState<RoomFields>({
//     hotelName: '',
//     amenities: [],
//  });

//  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRoomDetails({
//       ...roomFields,
//       [event.target.name]: event.target.value,
//     });
//  };

//  const handleHotelChange = (selectedHotel: string) => {
//     setRoomDetails({
//       ...roomFields,
//       hotelName: selectedHotel,
//     });
//     dispatch(updateRoomDetails({...roomFields})); //check here 

//  };

//  const handleAmenitiesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//   const selectedAmenities = event.target.value as string | string[];

//   setRoomDetails({
//     ...roomFields,
//     amenities: Array.isArray(selectedAmenities) ? selectedAmenities : [selectedAmenities],
//   });
//   dispatch(updateRoomDetails({...roomFields}));

// };
// // Function to handle popover open
// const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
//   setPopoverAnchor(event.currentTarget);
// };

// // Function to handle popover close
// const handlePopoverClose = () => {
//   setPopoverAnchor(null);
// };

// const handleAddNewAmenity = () => {
//   if (extraAmenity.trim() !== '') {
//     if (roomFields.amenities.includes(extraAmenity.trim())) {
//       toast.warning('Amenity already exists!');
//       return;
//     }
//     if (roomDetails.amenities.includes(extraAmenity.trim()) ) {
//       toast.warning('Amenity already exists!');
//       return;
//     }
//     setRoomDetails({
//       ...roomFields,
//       amenities: [...roomFields.amenities, extraAmenity.trim()],
//     });
//     setExtraAmenity('');
//     setAmenityError('');
//     handlePopoverClose();
//   } else {
//     setAmenityError('This field is required');
//   }
// };

//  // Function to handle checkbox change for existing amenities
//  const handleAmenityCheckboxChange = (amenity: string) => {
//   const updatedAmenities = roomFields.amenities.includes(amenity)
//     ? roomFields.amenities.filter((a) => a !== amenity)
//     : [...roomFields.amenities, amenity];

//   setRoomDetails({
//     ...roomFields,
//     amenities: updatedAmenities,
//   });
// };
//  return (
//     <Stack
//       sx={{
//         alignItems: 'center',
//         '& .MuiTextField-root': { width: '100%', maxWidth: 500, m: 1 },
//       }}
//     >
//       <Grid container spacing={2}>
//       <Grid item xs={6}>
//           <RoomInfoFields
//             mainProps={{
//               name: "roomType",
//               label: "Room Type",
//               value:roomDetails.roomType
//             }}
//             minLength={5}
            
//           />
//         </Grid>
//         <Grid item xs={6}>
//         <RoomInfoFields
//             mainProps={{
//               name: "price",
//               label: "Rent Per Day",
//               value:roomDetails.price
//             }}
//             optionalProps={{ type: "number" }}
//             minLength={0}
//           />
//         </Grid>
//         <Grid item xs={6}>
//           <TextField
//             name="hotelName"
//             label="Select Hotel"
//             variant="outlined"
//             fullWidth
//             select
//             value={ roomFields.hotelName}
//             onChange={(e) => handleHotelChange(e.target.value as string)}
//           >
//             {hotels.map((hotel:any) => (
//               <MenuItem key={hotel._id} value={hotel.hotelName}>
//                 {hotel.hotelName}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={6}>
//           <FormControl fullWidth variant="outlined">
//             <InputLabel htmlFor="amenities" style={{marginLeft:'9px'}}>Amenities</InputLabel>
//             <Select
//               name="amenities"
//               label="Amenities"
//               variant="outlined"
//               multiple
//               sx={{width:'92%',marginLeft:'8px'}}
//               value={roomDetails.amenities}
//               onChange={handleAmenitiesChange as SelectInputProps<string | string[]>['onChange']}
//               inputProps={{
//                 id: 'amenities',
//               }}
//             >
//               {[...new Set(['Wi-fi','Spa',...roomDetails.amenities, ...roomFields.amenities])].map((amenity: string) => (
//                 <MenuItem key={amenity} value={amenity}>
//                   {amenity}
//                 </MenuItem>
//               ))}
//             </Select>
            
//             <Button onClick={handlePopoverOpen} variant="text" color="primary">
//               Add Amenities
//             </Button>
//           </FormControl>
//         </Grid>
//         <Popover
//         open={Boolean(popoverAnchor)}
//         anchorEl={popoverAnchor}
//         onClose={handlePopoverClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <Box p={2}>
//         <TextField
//             label="Enter New Amenity"
//             value={extraAmenity}
//             onChange={(e) => setExtraAmenity(e.target.value)}
//             InputProps={{
//               placeholder: amenityError,
//               style: { color: amenityError ? 'red' : 'inherit' },
//             }}
//             error={!!amenityError}
//           />
//           <Button
//             variant="text"
//             color="primary"
//             onClick={handleAddNewAmenity}
//             sx={{ marginTop: '8px', ml: 2 }}
//           >
//             Add Amenity
//           </Button>
//           <List>
//             {roomFields.amenities.map((amenity) => (
//               <ListItem key={amenity}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={roomFields.amenities.includes(amenity)}
//                       onChange={() => handleAmenityCheckboxChange(amenity)}
//                     />
//                   }
//                   label={amenity}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Popover>
//         <Grid item xs={6}>
//           <RoomInfoFields
//             mainProps={{
//               name: "discountPrice",
//               label: "Discount Price",
//               value:roomDetails.discountPrice
//             }}
//             optionalProps={{ type: "number" }}
//             minLength={0}
//           />
//         </Grid>
//         <Grid item xs={6}>
//           <RoomInfoFields
//             mainProps={{
//               name: "roomsCount",
//               label: "Rooms Available",
//               min: 1,
//               value:roomDetails.roomsCount
//             }}
//             optionalProps={{ type: "number" }}
//             minLength={1}
//           />
//         </Grid> 
//         <Grid item xs={6}>
//         <RoomInfoFields
//             mainProps={{
//               name: "description",
//               label: "Description",
//               multiline: true, rows: 4,
//               value:roomDetails.description
//             }}
//             minLength={15}
//           />
//         </Grid>
//         <Grid item xs={6}>
//         <RoomInfoFields
//             mainProps={{
//               name: "maxPeople",
//               label: "Max People",
//               min: 1,
//               value:roomDetails.maxPeople
//             }}
//             optionalProps={{ type: "number" }}
//             minLength={1}
//           />
//         </Grid>
       
//       </Grid>
//     </Stack>
//  );
// };

// export default AddDetails;