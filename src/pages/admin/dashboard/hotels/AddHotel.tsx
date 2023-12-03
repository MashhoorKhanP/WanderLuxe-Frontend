
import React, { useState, useEffect } from 'react';
import { Container, Stepper,Step, StepButton, Stack, Button, Box } from '@mui/material';
import AddLocation from './addLocation/AddLocation';
import AddDetails from './addDetails/AddDetails';
import AddImages from './addImages/AddImages';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/types';
import { Add } from '@mui/icons-material';
import { addHotel, getHotels } from '../../../../actions/hotel';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { resetAddHotel, updateHotels } from '../../../../store/slices/adminSlice';
import { AppDispatch } from '../../../../store/store';

const AddHotel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const hotelImages = useSelector((state: RootState) => state.admin.hotelImages);
  const hotelDetails = useSelector((state: RootState) => state.admin.hotelDetails);
  const hotelLocation = useSelector((state: RootState) => state.admin.hotelLocation);
  
  const [activeStep,setActiveStep] = useState(0);
  const [steps,setSteps] = useState([
    {label:'Location',completed:false},
    {label:'Details',completed:false},
    {label:'Images',completed:false}

  ]);
  const [showSubmit,setShowSubmit] = useState(false);

  const handleNext = () => {
    if(activeStep < steps.length -1){
      setActiveStep(activeStep => activeStep + 1)
    }else{
      const stepIndex = findUnfinished()
      setActiveStep(stepIndex);
    }
  }

  const checkDisabled = () => {
    if(activeStep < steps.length -1) return false;
    const index = findUnfinished();
    if(index !== -1) return false;
    return true;
  }

  const findUnfinished = () => {
    return steps.findIndex(step => !step.completed)
  }

  useEffect(() => {
    if(hotelLocation.longitude || hotelLocation.latitude){
      if(!steps[0].completed) setComplete(0,true)
    }else{
      if(steps[0].completed) setComplete(0,false)
    }
  },[hotelLocation]);
  

  useEffect(() => {
    if(hotelDetails.hotelName.length>4 && hotelDetails.location.length > 4  && hotelDetails.distanceFromCityCenter 
      && hotelDetails.mobile.length > 9 && hotelDetails.email.length > 9 && hotelDetails.minimumRent && hotelDetails.description.length > 14  ){
      if(!steps[1].completed) setComplete(1,true)
    }else{
      if(steps[1].completed) setComplete(1,false)
    }
  },[hotelDetails]);

  useEffect(() => {
      if(hotelImages.length){
        if(!steps[2].completed) setComplete(2,true)
      }else{
        if(steps[2].completed) setComplete(2,false)
      }
    },[hotelImages]);

  const setComplete = (index:number,status:boolean) => {
    setSteps(steps => {
      steps[index].completed = status;
      return [...steps];
    })
  }

  useEffect(() => {
    if(findUnfinished() === -1){
      if(!showSubmit) setShowSubmit(true);
    }else{
      if(showSubmit) setShowSubmit(false);
    }
  },[steps])

  const validateForm = (): boolean => {
    // Validation logic for each field
    if (hotelDetails.hotelName.length < 5) {
      toast.error('Hotel is required, and must be at least 5 characters long')
      return false;
    }

    if (hotelDetails.location.length < 5) {
      toast.error('Location is required, and must be at least 5 characters long')
      return false;
    }
    
    const minimumRentRegex = /^(1500|1[5-9]\d{2}|[23]\d{3}|3500)$/;
    if (!minimumRentRegex.test(hotelDetails.minimumRent.toString())) {
      toast.error('Minimum rent must be a amount between 1500 and 3500');
      return false;
    }

    const distanceRegex =  /^(?:[0-9]|10|\d{1,2}(?:\.\d{1,2})?)$/;
    if (!distanceRegex.test(hotelDetails.distanceFromCityCenter.toString())) {
      toast.error('Distance from city center must be a value between 0 and 10');
      return false;
    }

    if (hotelDetails.parkingPrice) {
      const parkingRegex = /^(?:2[5-9]|5[0-5]|\d{1,2}(?:\.\d{1,2})?)$/;
      if (!parkingRegex.test(hotelDetails?.parkingPrice.toString())) {
        toast.error('Parking price should be between 25 and 55');
        return false;
      }
    }
    
    
    

    if (!hotelDetails.distanceFromCityCenter) {
      toast.error('Distance from city is required')
      return false;
    }

    if(!hotelDetails.email.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)){
        toast.error('Enter a valid email address')
        return false;
      }

    if (!hotelDetails.mobile.match(/^[6-9]\d{9}$/)) {
      toast.error('Enter a valid mobile number')
      return false;
    }
    // Add similar validations for other fields...
    return true; // Form is valid
  };

  const handleSubmit = (async() => {
    if(validateForm()){
    const result = await addHotel({
      longitude:hotelLocation.longitude,
      latitude:hotelLocation.latitude,
      hotelName:hotelDetails.hotelName,
      location:hotelDetails.location,
      distanceFromCityCenter:hotelDetails.distanceFromCityCenter,
      email:hotelDetails.email,
      mobile:hotelDetails.mobile,
      minimumRent:hotelDetails.minimumRent,
      description:hotelDetails.description,
      parkingPrice:hotelDetails.parkingPrice,
      images:hotelImages
    })
  
    if(result.success){
      navigate('/admin/dashboard/hotels');
      dispatch(resetAddHotel({hotelLocation,hotelDetails,hotelImages}))
      const hotels = dispatch(getHotels());
      dispatch(updateHotels({hotels}))
      toast.success('Hotel Added Successfully');
    }else{
      toast.error('Something went wrong!')
    }
  }
  })
      
     
  
  return (
   <Container sx={{my:4}}>
    <Stepper
    alternativeLabel
    nonLinear
    activeStep={activeStep}
    sx={{mb:3}}
    >
      {steps.map((step,index) => (
        <Step key = {step.label} completed={step.completed}>
          <StepButton onClick={() => setActiveStep(index)}>
            {step.label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
    <Box sx={{pb:7}} >
      {{
        0:<AddLocation/>,
        1:<AddDetails/>,
        2:<AddImages/>
      }[activeStep]}
    
     <Stack
     direction='row'
     sx={{pt:2, pb:7, justifyContent:'space-around'}}
     >
      <Button color='inherit' disabled={!activeStep}
      onClick={() => setActiveStep(activeStep => activeStep -1)}
      >
        Back
      </Button>
      <Button
      disabled={checkDisabled()}
      onClick={handleNext}
      >
        Next
      </Button>
     </Stack>
     {showSubmit && (
      <Stack sx={{alignItems:'center'}}>
        <Button variant='contained'
        endIcon={<Add/>}
        onClick={handleSubmit}
        >ADD HOTEL</Button>
      </Stack>
     )}
     </Box>
   </Container>
  );
};

export default AddHotel;