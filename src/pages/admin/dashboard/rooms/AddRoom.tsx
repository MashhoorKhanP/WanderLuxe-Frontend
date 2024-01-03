import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import AddDetails from './addDetails/AddDetails';
import AddDetails from "./addDetails/AddDetails";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import { Add, ArrowBack, Cancel, Sync } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/types";
import AddImages from "../hotels/addImages/AddImages";
import { toast } from "react-toastify";
import { addRoom, getRooms, updateRoom } from "../../../../actions/room";
import { AppDispatch } from "../../../../store/store";
import {
  resetAddRoom,
  updateRooms,
} from "../../../../store/slices/adminSlices/adminRoomSlice";

const AddRoom: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const roomImages = useSelector(
    (state: RootState) => state.adminRoom.roomImages
  );
  const roomDetails = useSelector(
    (state: RootState) => state.adminRoom.roomDetails
  );
  const updatedRoom: any = useSelector(
    (state: RootState) => state.adminRoom.updatedRoom
  );
  const hotelDetails: any = useSelector(
    (state: RootState) => state.adminHotel.allHotels
  );
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([
    { label: "Details", completed: false },
    { label: "Images", completed: false },
  ]);
  const [showSubmit, setShowSubmit] = useState(false);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((activeStep) => activeStep + 1);
    } else {
      const stepIndex = findUnfinished();
      setActiveStep(stepIndex);
    }
  };

  const checkDisabled = () => {
    if (activeStep < steps.length - 1) return false;
    const index = findUnfinished();
    if (index !== -1) return false;
    return true;
  };

  const findUnfinished = () => {
    return steps.findIndex((step) => !step?.completed);
  };

  useEffect(() => {
    if (
      roomDetails.roomType.length > 4 &&
      roomDetails.price &&
      roomDetails.discountPrice &&
      roomDetails.roomsCount &&
      roomDetails.description.length > 14
    ) {
      if (!steps[0]?.completed) setComplete(0, true);
    } else {
      if (steps[0]?.completed) setComplete(0, false);
    }
  }, [roomDetails]);

  useEffect(() => {
    if (roomImages.length) {
      if (!steps[1]?.completed) setComplete(1, true);
    } else {
      if (steps[1]?.completed) setComplete(1, false);
    }
  }, [roomImages]);

  const setComplete = (index: number, status: boolean) => {
    setSteps((steps: any) => {
      steps[index].completed = status;
      return [...steps];
    });
  };

  useEffect(() => {
    if (findUnfinished() === -1) {
      if (!showSubmit) setShowSubmit(true);
    } else {
      if (showSubmit) setShowSubmit(false);
    }
  }, [steps]);

  const hotel = hotelDetails.find(
    (hotel: any) => hotel.hotelName === roomDetails.hotelName
  );

  const validateForm = (): boolean => {
    // Validation logic for each field
    if (roomDetails.roomType.length < 5) {
      toast.error(
        "Room Type is required, and must be at least 5 characters long"
      );
      return false;
    }

    // if (!roomDetails.hotelName) {
    //   toast.error('Select hotel is required')
    //   return false;
    // }
    
    
    if (
      roomDetails.price > 3500 ||
      roomDetails.price < 1500 ||
      roomDetails.price < hotel.minimumRent
    ) {
      toast.error(
        "Rent must be a amount between 1500 and 3500 & Also should be equal/greater than Hotel's minimum rent"
      );
      return false;
    }
    // if (!roomDetails.amenities.length) {
    //   toast.error('At least one amenity is required');
    //   return false;
    if (roomDetails.discountPrice > 500 || roomDetails.discountPrice < 100) {
      toast.error("Discount price must be a amount between 100 and 500");
      return false;
    }

    const roomsCountRegex = /^(?!0\d)\d{1,2}$/;
    if (!roomsCountRegex.test(roomDetails.roomsCount.toString())) {
      toast.error("Rooms count must be a value between 1 and 50");
      return false;
    }

    if (!roomDetails.maxPeople || roomDetails.maxPeople > 4) {
      toast.error("Max people count must be below 5");
      return false;
    }
    // Add similar validations for other fields...
    return true; // Form is valid
  };

  const handleSubmit = async () => {
    console.log("handleSubmit", roomDetails);
    if (validateForm()) {
      const result = await addRoom({
        roomType: roomDetails.roomType,
        hotelId: roomDetails.hotelId,
        hotelName: roomDetails.hotelName,
        amenities: roomDetails.amenities,
        parkingPrice: hotel.parkingPrice,
        price: roomDetails.price,
        discountPrice: roomDetails.discountPrice,
        roomsCount: roomDetails.roomsCount,
        maxPeople: roomDetails.maxPeople,
        description: roomDetails.description,
        images: roomImages,
        status:'Available'
      });

      if (result.success) {
        navigate("/admin/dashboard/rooms");
        dispatch(resetAddRoom({ roomDetails }));
        // const hotels = dispatch(getHotels());
        // dispatch(updateHotels({hotels}))
        toast.success("Room Added Successfully");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleupdateSubmit = async () => {
    if (validateForm()) {
      const result = await updateRoom({
        updatedRoom: {
          _id: updatedRoom._id,
          roomType: roomDetails.roomType,
          hotelId: roomDetails.hotelId,
          hotelName: roomDetails.hotelName,
          amenities: roomDetails.amenities,
          parkingPrice: hotel.parkingPrice,
          price: roomDetails.price,
          discountPrice: roomDetails.discountPrice,
          roomsCount: roomDetails.roomsCount,
          maxPeople: roomDetails.maxPeople,
          description: roomDetails.description,
          images: roomImages,
        },
      });

      if (result.success) {
        navigate("/admin/dashboard/rooms");
        dispatch(resetAddRoom({ roomDetails, roomImages }));
        const rooms = dispatch(getRooms());
        dispatch(updateRooms({ rooms }));
        toast.success("Room Updated Successfully");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/dashboard/rooms");
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" padding={2} flexDirection="row">
      <IconButton onClick={() => navigate(-1)}>
          <ArrowBack/>
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {location.pathname === "/admin/dashboard/rooms/add-room"
            ? "Add Room"
            : "Edit Room"}
        </Typography>
      </Box>
      <Stepper
        alternativeLabel
        nonLinear
        activeStep={activeStep}
        sx={{ mb: 3 }}
      >
        {steps.map((step, index) => (
          <Step key={step?.label} completed={step?.completed}>
            <StepButton onClick={() => setActiveStep(index)}>
              {step?.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ pb: 7 }}>
        {
          {
            0: <AddDetails />,
            1: <AddImages />,
          }[activeStep]
        }
        <Stack
          sx={{ alignItems: "center", justifyContent: "center", pt: 5, gap: 2 }}
          direction="row"
        >
          {showSubmit &&
            (location.pathname === "/admin/dashboard/rooms/add-room" ? (
              <Button
                variant="contained"
                endIcon={<Add />}
                onClick={handleSubmit}
              >
                ADD ROOM
              </Button>
            ) : location.pathname === "/admin/dashboard/rooms/edit-room" ? (
              <Button
                variant="contained"
                endIcon={<Sync />}
                onClick={handleupdateSubmit}
              >
                UPDATE ROOM
              </Button>
            ) : null)}
          <Button
            variant="outlined"
            style={{ borderColor: "red", color: "red" }}
            endIcon={<Cancel />}
            onClick={handleCancel}
          >
            CANCEL
          </Button>
        </Stack>
        <Stack
          direction="row"
          sx={{ pt: 2, pb: 7, justifyContent: "space-around" }}
        >
          <Button
            color="inherit"
            disabled={!activeStep}
            onClick={() => setActiveStep((activeStep) => activeStep - 1)}
          >
            Back
          </Button>
          <Button disabled={checkDisabled()} onClick={handleNext}>
            Next
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddRoom;
