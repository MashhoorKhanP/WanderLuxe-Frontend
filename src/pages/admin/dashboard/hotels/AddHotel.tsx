
import React, { useState, useEffect } from 'react';
import { Container, Stepper,Step, StepButton, Stack, Button, Box } from '@mui/material';
import AddLocation from './addLocation/AddLocation';
import AddDetails from './addDetails/AddDetails';
import AddImages from './addImages/AddImages';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/types';

const AddHotel: React.FC = () => {
  const hotelImages = useSelector((state: RootState) => state.admin.hotelImages);

  const [activeStep,setActiveStep] = useState(0);
  const [steps,setSteps] = useState([
    {label:'Location',completed:false},
    {label:'Details',completed:false},
    {label:'Images',completed:false}

  ]);

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
    if(hotelImages.length){
      if(!steps[2].completed) setComplete(2,true)
    }else{
      if(steps[2].completed) setComplete(2,false)
    }
  },[hotelImages])

  const setComplete = (index:number,status:boolean) => {
    setSteps(steps => {
      steps[index].completed = status;
      return [...steps];
    })
  }

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
    <Box>
      {{
        0:<AddLocation/>,
        1:<AddDetails/>,
        2:<AddImages/>
      }[activeStep]}
    </Box>
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
   </Container>
  );
};

export default AddHotel;