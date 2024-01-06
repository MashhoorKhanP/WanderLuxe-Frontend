import { Box, IconButton, Slider, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/types";
import {
  filterPrice,
  filterRoomPrice,
} from "../../../store/slices/userSlices/userSlice";
import { CurrencyRupee } from "@mui/icons-material";
import { useValue } from "../../../context/ContextProvider";
import { useLocation } from "react-router-dom";

const marks = [
  { value: 1500, label: "₹1500" },
  { value: 2500, label: "₹2500" },
  { value: 3500, label: "₹3500" },
];

const PriceSlider: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { containerRef } = useValue();
  const priceFilter = useSelector((state: RootState) => state.user.priceFilter);
  const handleSliderChange = (_event: Event, price: number | number[]) => {
    // Ensure price is always a single number
    const newPrice = Array.isArray(price) ? price[0] : price;
    if (
      location.pathname === "/view-hotels" ||
      location.pathname === "/find-hotels"
    ) {
      dispatch(filterPrice(newPrice));
    } else if (location.pathname === "/view-rooms") {
      dispatch(filterRoomPrice(newPrice));
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: 200, mt: 3 }} ref={containerRef}></Box>
      <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
        <IconButton
          color="inherit"
          size="small"
          sx={{ fontSize: "bold", ml: 5, mt: 2 }}
        >
          <CurrencyRupee />
        </IconButton>
        <Slider
          min={1500}
          max={3500}
          defaultValue={3500}
          sx={{ width: "250px", mt: 4, color: "black" }}
          valueLabelDisplay="auto"
          marks={marks}
          value={priceFilter}
          onChange={handleSliderChange}
        />
      </Box>
    </Box>
  );
};

export default PriceSlider;
