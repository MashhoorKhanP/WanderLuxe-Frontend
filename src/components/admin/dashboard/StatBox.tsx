import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import ProgressCircle from "./ProgressCircle";

interface StatBoxProps {
  title: number;
  subtitle: any;
  icon: any;
  progress: any;
  increase: any;
}

const StatBox: React.FC<StatBoxProps> = ({
  title,
  subtitle,
  icon,
  progress,
  increase,
}) => {
  const theme = useTheme();
  return (
    <Box width={"100%"} m={"0 30px"}>
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography variant="h5" fontWeight="500" sx={{ color: "#f5f5f5" }}>
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle progress={progress} />
          <Typography
            variant="h6"
            sx={{
              color: "#46c7a5",
              fontSize: "12px",
              fontWeight: "400",
              mt: "5px",
              ml: "5px",
            }}
          >
            {increase}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" sx={{ color: "#43a047" }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
