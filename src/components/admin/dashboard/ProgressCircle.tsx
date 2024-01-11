import React from "react";
import { Box } from "@mui/material";

interface ProgressCircleProps {
  progress?: any;
  size?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress = 0.75,
  size = 40,
}) => {
  const angle = progress * 360;
  return (
    <Box
      sx={{
        background: `radial-gradient(#1b2537 55%, transparent 56%),
      conic-gradient(transparent 0deg ${angle}deg,#565ceb ${angle}deg 360deg),
      #46c7a5`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    ></Box>
  );
};

export default ProgressCircle;
