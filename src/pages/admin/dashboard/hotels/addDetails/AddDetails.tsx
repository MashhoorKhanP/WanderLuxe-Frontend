import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { RootState } from "../../../../../store/types";
import { updateHotelDetails } from "../../../../../store/slices/adminSlice";
import InfoFields from "./InfoFields";

const AddDetails: React.FC = () => {
  const dispatch = useDispatch();

  const hotelDetails = useSelector(
    (state: RootState) => state.admin.hotelDetails
  );
  const [parkingType, setparkingType] = useState(
    hotelDetails.parkingPrice ? 1 : 0
  );

  const handleParkingTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parkingType = Number(e.target.value);
    setparkingType(parkingType);
    if (parkingType === 0) {
      dispatch(updateHotelDetails({ parkingPrice: 0 }));
    } else {
      dispatch(updateHotelDetails({ parkingPrice: 25 }));
    }
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateHotelDetails({ parkingPrice: Number(e.target.value) }));
  };

  return (
    <Stack
      sx={{
        alignItems: "center",
        "& .MuiTextField-root": { width: "100%", maxWidth: 500, m: 1 },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <InfoFields
            mainProps={{
              name: "hotelName",
              label: "Hotel Name",
              value: hotelDetails.hotelName,
            }}
            minLength={5}
          />
        </Grid>
        <Grid item xs={6}>
          <InfoFields
            mainProps={{
              name: "location",
              label: "Location",
              value: hotelDetails.location,
            }}
            minLength={5}
          />
        </Grid>
        <Grid item xs={6}>
          <InfoFields
            mainProps={{
              name: "distanceFromCityCenter",
              label: "Distance from City Center",
              value: hotelDetails.distanceFromCityCenter,
              min: 0,
            }}
            optionalProps={{ type: "number" }}
            minLength={1}
          />
        </Grid>
        <Grid item xs={6}>
          <InfoFields
            mainProps={{
              name: "mobile",
              label: "Contact No",
              value: hotelDetails.mobile,
            }}
            minLength={10}
          />
        </Grid>
        <Grid item xs={6}>
          <InfoFields
            mainProps={{
              name: "email",
              label: "Email Address",
              value: hotelDetails.email,
            }}
            optionalProps={{ type: "email" }}
            minLength={0}
          />
        </Grid>
        <Grid item xs={6}>
          <InfoFields
            mainProps={{
              name: "minimumRent",
              label: "Minimum Rent",
              value: hotelDetails.minimumRent,
              min: 0,
              max: 2000,
            }}
            optionalProps={{ type: "number" }}
            minLength={4}
          />
        </Grid>
        <Grid item xs={6}>
          <InfoFields
            mainProps={{
              name: "description",
              label: "Description",
              value: hotelDetails.description,
              multiline: true, 
              rows: 4
            }}
            minLength={15}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <RadioGroup
              name="parkingType"
              value={parkingType}
              row
              onChange={handleParkingTypeChange}
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="Free Parking"
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Parking Fee"
              />
              {Boolean(parkingType) && (
                <TextField
                  sx={{ width: "7ch !important" }}
                  variant="standard"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  inputProps={{ type: "number", min: 15, max: 55 }}
                  value={hotelDetails.parkingPrice}
                  onChange={handlePriceChange}
                  name="price"
                />
              )}
            </RadioGroup>
            {Boolean(parkingType) && Number(hotelDetails.parkingPrice) > 55 && (
              <Typography
                sx={{ textAlign: "end" }}
                variant="caption"
                color="error"
              >
                Maximum parking price is 55!
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AddDetails;
