import { ArrowLeft, ArrowRight, RemoveRedEye } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  List,
  MenuItem,
  Popover,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateRoomDetails } from "../../../../../store/slices/adminSlices/adminRoomSlice";
import { RootState } from "../../../../../store/types";
import RoomInfoFields from "./RoomInfoFields";

type RoomFields = {
  hotelId: string;
  hotelName: string;
  amenities: string[];
};

type Hotel = {
  _id: string;
  hotelName: string;
};

const AddDetails: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [extraAmenity, setExtraAmenity] = useState<string>("");
  const [amenityError, setAmenityError] = useState<string>("");
  const [hotelPopoverAnchor, setHotelPopoverAnchor] =
    useState<HTMLElement | null>(null);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const hotels: any = useSelector(
    (state: RootState) => state.adminHotel.allHotels
  );
  const [selectedHotel, setSelectedHotel] = useState<any>(hotels[0]);
  const roomDetails: any = useSelector(
    (state: RootState) => state.adminRoom.roomDetails
  );

  const [roomFields, setRoomDetails] = useState<RoomFields>({
    hotelId: "",
    hotelName: "",
    amenities: [],
  });

  const handleHotelChange = (selectedHotel: Hotel) => {
    const updatedRoomDetails = {
      ...roomDetails,

      hotelId: selectedHotel._id,
      hotelName: selectedHotel.hotelName,
    };
    setRoomDetails(updatedRoomDetails);
    dispatch(updateRoomDetails(updatedRoomDetails)); //check here
  };

  const handleAmenitiesChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedAmenities = event.target.value as string | string[];

    const updatedRoomDetails = {
      ...roomDetails,
      amenities: Array.isArray(selectedAmenities)
        ? selectedAmenities
        : [selectedAmenities],
    };

    setRoomDetails(updatedRoomDetails);
    dispatch(updateRoomDetails(updatedRoomDetails));
  };
  // Function to handle popover open
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  // Function to handle popover close
  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const handleHotelPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setHotelPopoverAnchor(event.currentTarget);
  };

  const handleHotelPopoverClose = () => {
    setHotelPopoverAnchor(null);
  };

  const handleViewButtonClick = (
    event: React.MouseEvent<HTMLElement>,
    hotelId: string
  ) => {
    setHotelPopoverAnchor(event.currentTarget);
    setImageIndex(0);
    const hotel = hotels.find((hotel: any) => hotel._id === hotelId);
    setSelectedHotel(hotel);
  };

  const handleAddNewAmenity = () => {
    if (extraAmenity.trim() !== "") {
      if (roomFields.amenities.includes(extraAmenity.trim())) {
        toast.warning("Amenity already exists!");
        return;
      }
      if (roomDetails.amenities.includes(extraAmenity.trim())) {
        toast.warning("Amenity already exists!");
        return;
      }
      setRoomDetails({
        ...roomDetails,
        amenities: [...roomDetails.amenities, extraAmenity.trim()],
      });
      setExtraAmenity("");
      setAmenityError("");
      handlePopoverClose();
    } else {
      setAmenityError("This field is required");
    }
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
          <RoomInfoFields
            mainProps={{
              name: "roomType",
              label: "Room Type",
              value: roomDetails.roomType,
            }}
            minLength={5}
          />
        </Grid>
        <Grid item xs={6}>
          <RoomInfoFields
            mainProps={{
              name: "price",
              label: "Rent Per Day",
              value: roomDetails.price,
            }}
            optionalProps={{ type: "number" }}
            minLength={0}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="hotelName"
            label="Select Hotel"
            variant="outlined"
            fullWidth
            select
            value={roomDetails.hotelName}
            onChange={(e) => {
              const selectedHotel = hotels.find(
                (hotel: Hotel) => hotel.hotelName === e.target.value
              );
              if (selectedHotel) {
                handleHotelChange(selectedHotel);
              }
            }}
          >
            {hotels.map((hotel: any) => (
              <MenuItem key={hotel._id} value={hotel.hotelName}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <span>{hotel.hotelName}</span>
                  <Button
                    variant="outlined"
                    size="small"
                    style={{
                      position: "absolute",
                      right: "8%",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    endIcon={<RemoveRedEye />}
                    onClick={(e) => handleViewButtonClick(e, hotel._id)}
                  >
                    View
                  </Button>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Popover
          open={Boolean(hotelPopoverAnchor)}
          anchorEl={hotelPopoverAnchor}
          onClose={handleHotelPopoverClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box p={1}>
            <img
              src={selectedHotel.images[imageIndex]}
              alt={`Hotel ${imageIndex + 1}`}
              style={{ width: "300px", height: "200px", objectFit: "cover" }}
              loading="lazy"
            />

            <Box
              display="flex"
              flexDirection={"row"}
              justifyContent="center"
              alignItems="center"
            >
              <Tooltip title="Previous">
                <Button
                  startIcon={<ArrowLeft />}
                  onClick={() =>
                    setImageIndex(
                      (prevIndex) =>
                        (prevIndex - 1 + hotels[imageIndex].images.length) %
                        hotels[imageIndex].images.length
                    )
                  }
                ></Button>
              </Tooltip>
              <Tooltip title="Next">
                <Button
                  endIcon={<ArrowRight />}
                  onClick={() =>
                    setImageIndex(
                      (prevIndex) =>
                        (prevIndex + 1) % hotels[imageIndex].images.length
                    )
                  }
                ></Button>
              </Tooltip>
            </Box>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "14px", fontWeight: "normal", p: 1 }}
                >
                  <strong>Hotel Name:</strong> {selectedHotel.hotelName}
                </Typography>
              </li>
              <li>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "14px", fontWeight: "normal", p: 1 }}
                >
                  <strong>Location:</strong> {selectedHotel.location}
                </Typography>
              </li>
              <li>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "14px", fontWeight: "normal", p: 1 }}
                >
                  <strong>Minimum Rent:</strong> ₹{selectedHotel.minimumRent}
                </Typography>
              </li>
            </ul>
          </Box>
        </Popover>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="amenities" style={{ marginLeft: "9px" }}>
              Amenities
            </InputLabel>
            <Select
              name="amenities"
              label="Amenities"
              variant="outlined"
              multiple
              sx={{ width: "92%", marginLeft: "8px" }}
              value={roomDetails.amenities}
              onChange={
                handleAmenitiesChange as SelectInputProps<
                  string | string[]
                >["onChange"]
              }
              inputProps={{
                id: "amenities",
              }}
            >
              {[
                ...new Set([
                  "Wi-fi",
                  "Spa",
                  ...roomDetails.amenities,
                  ...roomFields.amenities,
                ]),
              ]
                .filter((amenity) => amenity !== "")
                .map((amenity: string) => (
                  <MenuItem key={amenity} value={amenity}>
                    {amenity}
                  </MenuItem>
                ))}
            </Select>

            <Button onClick={handlePopoverOpen} variant="text" color="primary">
              Add Amenities
            </Button>
          </FormControl>
        </Grid>
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Box p={2}>
            <TextField
              label="Enter New Amenity"
              value={extraAmenity}
              onChange={(e) => setExtraAmenity(e.target.value)}
              InputProps={{
                placeholder: amenityError,
                style: { color: amenityError ? "red" : "inherit" },
              }}
              error={!!amenityError}
            />
            <Button
              variant="text"
              color="primary"
              onClick={handleAddNewAmenity}
              sx={{ marginTop: "8px", ml: 2 }}
            >
              Add Amenity
            </Button>
            <List>
              {/* {[...new Set(['Wi-fi','Spa', ...roomDetails.amenities,...roomFields.amenities])].filter((amenity) => amenity !== "").map((amenity: string) => (
              <ListItem key={amenity}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={roomFields.amenities.includes(amenity)}
                      onChange={() => handleAmenityCheckboxChange(amenity)}
                    />
                  }
                  label={amenity}
                />
              </ListItem>
            ))} */}
            </List>
          </Box>
        </Popover>
        <Grid item xs={6}>
          <RoomInfoFields
            mainProps={{
              name: "discountPrice",
              label: "Discount Price",
              value: roomDetails.discountPrice,
            }}
            optionalProps={{ type: "number" }}
            minLength={3}
          />
        </Grid>
        {/* <Grid item xs={6}>
          <RoomInfoFields
            mainProps={{
              name: "roomsCount",
              label: "Rooms Available",
              min: 1,
              value: roomDetails.roomsCount,
            }}
            optionalProps={{ type: "number" }}
            minLength={1}
          />
        </Grid> */}
        <Grid item xs={6}>
          <RoomInfoFields
            mainProps={{
              name: "maxPeople",
              label: "Max People",
              min: 1,
              value: roomDetails.maxPeople,
            }}
            optionalProps={{ type: "number" }}
            minLength={1}
          />
        </Grid>
        <Grid item xs={6}>
          <RoomInfoFields
            mainProps={{
              name: "description",
              label: "Description",
              multiline: true,
              rows: 4,
              value: roomDetails.description,
            }}
            minLength={15}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AddDetails;
