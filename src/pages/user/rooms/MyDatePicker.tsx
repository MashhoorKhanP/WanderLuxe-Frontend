import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  TextField,
  Box,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import "./datePicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/types";
import { setCheckInCheckOutRange } from "../../../store/slices/userSlices/roomSlice";

const MyDatePicker: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({
  isOpen,
  onToggle,
}) => {
  const dispatch = useDispatch();
  const checkInCheckoutRange: any = useSelector(
    (state: RootState) => state.room.checkInCheckOutRange
  );
  const [checkInTime, setCheckInTime] = useState(
    dayjs().set("hour", 14).set("minute", 0)
  );
  const [checkOutTime, setCheckOutTime] = useState(
    dayjs().set("hour", 9).set("minute", 0)
  );
  const getTodayOrTomorrowDate = () => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    // If the current hour is before 6 PM, return the current date
    // Otherwise, return the date of tomorrow
    return currentHour < 18
      ? currentDate
      : new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  };

  const today = getTodayOrTomorrowDate();

  const [dateRange, setDateRange] = useState([
    {
      startDate: checkInCheckoutRange.startDate
        ? checkInCheckoutRange.startDate
        : today,
      endDate: checkInCheckoutRange.endDate
        ? checkInCheckoutRange.endDate
        : today,
      startTime: checkInCheckoutRange.startTime
        ? checkInCheckoutRange.startTime
        : checkInTime.format("LT"),
      endTime: checkInCheckoutRange.endTime
        ? checkInCheckoutRange.endTime
        : checkOutTime.format("LT"),
      numberOfNights: checkInCheckoutRange.numberOfNights
        ? checkInCheckoutRange.numberOfNights
        : 1,
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    let numberOfNights = dayjs(endDate).diff(dayjs(startDate), "day");
    numberOfNights === 0
      ? (numberOfNights = 1)
      : (numberOfNights = numberOfNights);
    setDateRange([
      {
        ...ranges.selection,
        startTime: checkInCheckoutRange.startTime
          ? checkInCheckoutRange.startTime
          : checkInTime.format("LT"),
        endTime: checkInCheckoutRange.endTime
          ? checkInCheckoutRange.endTime
          : checkOutTime.format("LT"),
        numberOfNights,
        key: "selection",
      },
    ]);

    dispatch(
      setCheckInCheckOutRange({
        startDate,
        endDate,
        startTime: checkInCheckoutRange.startTime
          ? checkInCheckoutRange.startTime
          : checkInTime.format("LT"),
        endTime: checkInCheckoutRange.endTime
          ? checkInCheckoutRange.endTime
          : checkOutTime.format("LT"),
        numberOfNights,
      })
    );
  };

  const handleCheckInTimeChange = (time: dayjs.Dayjs | null) => {
    if (time) {
      setCheckInTime(time);
      setDateRange([
        {
          ...dateRange[0],
          startTime: time.format("LT"),
        },
      ]);

      dispatch(
        setCheckInCheckOutRange({
          ...dateRange[0],
          startTime: time.format("LT"),
        })
      );
    }
  };

  const handleCheckOutTimeChange = (time: dayjs.Dayjs | null) => {
    if (time) {
      setCheckOutTime(time);
      setDateRange([
        {
          ...dateRange[0],
          endTime: time.format("LT"),
        },
      ]);

      dispatch(
        setCheckInCheckOutRange({
          ...dateRange[0],
          endTime: time.format("LT"),
        })
      );
    }
  };

  const formattedStartDate = checkInCheckoutRange.startDate
    ? checkInCheckoutRange.startDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      })
    : dateRange[0].startDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      });

  const formattedEndDate = checkInCheckoutRange.endDate
    ? checkInCheckoutRange.endDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      })
    : dateRange[0].endDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "numeric",
        year: "2-digit",
      });

  const handleClickAway = () => {
    if (isOpen) {
      onToggle(); // Close the popover when clicked away
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        ml: 25,
        "@media (max-width: 976px)": {
          marginTop: "0px",
          marginLeft: "0px",
          mr: "0%",
        },
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        sx={{ width: 200, mt: 2, position: "relative" }}
        label="Check-In ────── Check-Out"
        onClick={onToggle}
        contentEditable={false}
        value={`${formattedStartDate} ⟶ ${" " + formattedEndDate}`}
      />

      <Popper
        open={isOpen}
        anchorEl={null}
        placement="bottom-start"
        style={{ zIndex: 1000, top: "15%", left: "10%"}}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper>
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  label="Check-In time"
                  sx={{ width: 166 }}
                  minutesStep={10}
                  minTime={dayjs().set("hour", 14).set("minute", 0)}
                  maxTime={dayjs().set("hour", 23).set("minute", 0)}
                  value={dayjs(checkInTime)}
                  onChange={handleCheckInTimeChange}
                />
                <MobileTimePicker
                  label="Check-Out time"
                  sx={{ width: 166 }}
                  minutesStep={10}
                  minTime={dayjs().set("hour", 9).set("minute", 0)}
                  maxTime={dayjs().set("hour", 14).set("minute", 0)}
                  value={dayjs(checkOutTime)}
                  onChange={handleCheckOutTimeChange}
                />
              </LocalizationProvider>
            </Box>
            <DateRangePicker
              ranges={dateRange}
              minDate={today}
              onChange={handleSelect}
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default MyDatePicker;
