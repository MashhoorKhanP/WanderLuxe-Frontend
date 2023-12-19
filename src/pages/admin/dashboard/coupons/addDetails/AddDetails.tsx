import { FormControl, Grid, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CouponInfoFields from "./CouponInfoFields";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SelectInputProps } from "@mui/material/Select/SelectInput";
import InfoFields from "../../hotels/addDetails/InfoFields";
import { RootState } from "../../../../../store/types";
import { CouponDetails, updateCouponDetails } from "../../../../../store/slices/adminSlices/adminCouponSlice";
import dayjs from "dayjs";
import 'dayjs/locale/en';

const AddDetails: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedDiscountType, setSelectedDiscountType] = useState<string>('');  // Change here
  // const [expiryDate, setExpiryDate] = useState<Date>();
  const couponDetails = useSelector((state:RootState) => state.adminCoupon.couponDetails);
  const handleDiscountTypeChange = (event: ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;  // Change here
    const updatedCouponDetails: Partial<CouponDetails> = {
      discountType: selectedValue,
    };

    if (selectedValue === 'fixedAmount') {
      updatedCouponDetails.maxDiscount = 0; // or set it to another default value
    }

    dispatch(updateCouponDetails(updatedCouponDetails));
    setSelectedDiscountType(selectedValue);
  };

  const handleExpiryDateChange = (date: Date | null) => {
    if (date) {
      const updatedCouponDetails: Partial<CouponDetails> = {
        expiryDate: dayjs(date), // Convert to string if needed
      };

      dispatch(updateCouponDetails(updatedCouponDetails));
    }
  };
  
  console.log('updateCouponDetails',couponDetails);
  return (
    <Stack
      sx={{
        alignItems: "center",
        "& .MuiTextField-root": { width: "100%", maxWidth: 500, m: 1 },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <CouponInfoFields
            mainProps={{
              name: "couponCode",
              label: "Coupon Code",
              value: couponDetails.couponCode,
              type:'text'
            }}
            minLength={5}
          />
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="discountType" style={{ marginLeft: '9px', marginTop: '8px' }}>
        Discount Type
      </InputLabel>
      <Select
        name="discountType"
        label="Discount Type"
        variant="outlined"
        sx={{ width: '92%', marginLeft: '8px', marginTop: '8px' }}
        value={couponDetails.discountType}
        onChange={handleDiscountTypeChange as SelectInputProps<string>['onChange']}
        inputProps={{
          id: 'discountType',
        }}
      >
        <MenuItem value="percentage">Percentage Discount</MenuItem>
        <MenuItem value="fixedAmount">Fixed Amount Discount</MenuItem>
      </Select>
    </FormControl>
        </Grid>
        {/* <Grid item xs={6}>
          <CouponInfoFields
            mainProps={{
              name: "location",
              label: "Location",
              // value: hotelDetails.location,
            }}
            minLength={5}
          />
        </Grid> */}
        <Grid item xs={6}>
          <CouponInfoFields
            mainProps={{
              name: "discount",
              label:couponDetails.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount',
              value: couponDetails.discount,
              min: 0,
            }}
            optionalProps={{ type: "number" }}
            minLength={1}
          />
        </Grid>
        {couponDetails.discountType === 'percentage' && (
          <Grid item xs={6}>
          <CouponInfoFields
            mainProps={{
              name: "maxDiscount",
              label: "Max Discount",
              value: couponDetails.maxDiscount,
              type: "number",
            }}
            minLength={2}
          />
        </Grid>
        )}
            
    <Grid item xs={6}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Coupon Expiry Date"
          value={dayjs(couponDetails.expiryDate)}
          onChange={handleExpiryDateChange}
          disablePast
        />
      </LocalizationProvider>
    </Grid>
        <Grid item xs={6}>
          <CouponInfoFields
            mainProps={{
              name: "couponCount",
              label: "Coupon Count",
              value: couponDetails.couponCount,
              type:'number',
            }}
            minLength={1}
          />
        </Grid>
        <Grid item xs={6}>
          <CouponInfoFields
            mainProps={{
              name: "description",
              label: "Description",
              value: couponDetails.description,
              multiline: true,
              rows: 4,
            }}
            minLength={10}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AddDetails;
