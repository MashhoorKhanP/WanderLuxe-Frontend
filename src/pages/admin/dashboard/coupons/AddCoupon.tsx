import { Add, ArrowBack, Cancel, Sync } from "@mui/icons-material";
import { Box, Button, Container, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddDetails from "./addDetails/AddDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store/store";
import { RootState } from "../../../../store/types";
import { toast } from "react-toastify";
import {
  resetAddCoupon,
  updateCoupons,
} from "../../../../store/slices/adminSlices/adminCouponSlice";
import {
  addCoupon,
  getCoupons,
  updateCoupon,
} from "../../../../actions/coupon";
import { Coupon } from "../../../user/coupons/CouponsOverviewScreen";

const AddCoupon: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const couponDetails = useSelector(
    (state: RootState) => state.adminCoupon.couponDetails
  );
  const coupons = useSelector((state: RootState) => state.adminCoupon.coupons);
  const updatedCoupon: any = useSelector(
    (state: RootState) => state.adminCoupon.updatedCoupon
  );
  const [showSubmit, setShowSubmit] = useState(false);
  let isMaxDiscountValid: any;
  const [isEditCoupon, setIsEditCoupon]= useState(false);

  useEffect(() => {
    if(location.pathname ==='/admin/dashboard/coupons/edit-coupon'){
      setIsEditCoupon(true);
    }
    const isPercentageDiscount = couponDetails.discountType === "percentage";
    isMaxDiscountValid = isPercentageDiscount
      ? (couponDetails.maxDiscount as number) > 0
      : true;

    if (
      couponDetails.couponCode.length > 4 &&
      couponDetails.discountType &&
      couponDetails.discount &&
      couponDetails.couponCount &&
      couponDetails.description.length > 9 &&
      couponDetails.expiryDate &&
      isMaxDiscountValid
    ) {
      setShowSubmit(true);
    } else {
      setShowSubmit(false);
    }
  }, [couponDetails]);

  const validateCouponForm = (): boolean => {
    // Validation logic for each field
    if (couponDetails.couponCode.length < 5) {
      toast.error(
        "Coupon code is required, and must be at least 5 characters long"
      );
      return false;
    }

    if(isEditCoupon===false){
      const isDuplicateCouponCode = coupons.some(
        (coupon: Coupon) => coupon.couponCode === couponDetails.couponCode
      );
      if (isDuplicateCouponCode) {
        toast.error("Coupon code must be unique");
        return false;
      }
      
    }

    // if (!roomDetails.amenities.length) {
    //   toast.error('At least one amenity is required');
    //   return false;
    if (!couponDetails.discountType) {
      toast.error("Discount type must be specified!");
      return false;
    }

    if (couponDetails.discountType === "percentage") {
      if (couponDetails.discount < 5) {
        toast.error("Minimum discount percentage should be 5%!");
        return false;
      }

      if (couponDetails.discount > 50) {
        toast.error("Maximum discount percentage should be 50%!");
        return false;
      }

      // Check maxDiscount only if discountType is 'percentage'
      if (couponDetails.maxDiscount && couponDetails.maxDiscount < 50) {
        toast.error("Max Discount Amount should be 50 or above!");
        return false;
      }
    } else if (couponDetails.discountType === "fixedAmount") {
      if (couponDetails.discount < 50) {
        toast.error("Minimum discount amount should be 50");
        return false;
      }
    }

    if (couponDetails.expiryDate == null) {
      toast.error("Expiry date is required!");
      return false;
    }

    if (couponDetails.couponCount <= 0) {
      toast.error("Count is required, Must be greater than zero!");
      return false;
    }

    // if (couponDetails.description.length<11) {
    //   toast.error("Coupon description is required, Must be atleast 10 characters!");
    //   return false;
    // }

    return true; // Form is valid
  };

  const handleSubmit = async () => {
    if (validateCouponForm()) {
      const result = await addCoupon({
        couponCode: couponDetails.couponCode,
        discountType: couponDetails.discountType,
        discount: couponDetails.discount,
        maxDiscount: couponDetails.maxDiscount,
        expiryDate: couponDetails.expiryDate,
        couponCount: couponDetails.couponCount,
        description: couponDetails.description,
        isCancelled: couponDetails.isCancelled,
      });
      if (result.success) {
        navigate("/admin/dashboard/coupons");
        dispatch(resetAddCoupon({ couponDetails }));
        // const hotels = dispatch(getHotels());
        // dispatch(updateHotels({hotels}))
        toast.success("Coupon Added Successfully");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleUpdateSubmit = async () => {
    if (validateCouponForm()) {
      const result = await updateCoupon({
        updatedCoupon: {
          _id: updatedCoupon._id,
          couponCode: couponDetails.couponCode,
          discountType: couponDetails.discountType,
          discount: couponDetails.discount,
          maxDiscount: couponDetails.maxDiscount,
          expiryDate: couponDetails.expiryDate,
          couponCount: couponDetails.couponCount,
          description: couponDetails.description,
          isCancelled: couponDetails.isCancelled,
        },
      });

      if (result.success) {
        navigate("/admin/dashboard/coupons");
        dispatch(resetAddCoupon({ couponDetails }));
        const coupons = dispatch(getCoupons());
        dispatch(updateCoupons({ coupons }));
        toast.success("Coupon Updated Successfully");
        setIsEditCoupon(false);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/dashboard/coupons");
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" padding={2} flexDirection="row">
      <IconButton onClick={() => navigate(-1)}>
          <ArrowBack/>
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          {location.pathname === "/admin/dashboard/coupons/add-coupon"
            ? "Add Coupon"
            : "Edit Coupon"}
        </Typography>
      </Box>
      <Box sx={{ pb: 7 }}>
        <AddDetails />
        <Stack
          sx={{ alignItems: "center", justifyContent: "center", pt: 5, gap: 2 }}
          direction="row"
        >
          {showSubmit &&
            (location.pathname === "/admin/dashboard/coupons/add-coupon" ? (
              <Button
                variant="contained"
                endIcon={<Add />}
                onClick={handleSubmit}
              >
                ADD COUPON
              </Button>
            ) : location.pathname === "/admin/dashboard/coupons/edit-coupon" ? (
              <Button
                variant="contained"
                endIcon={<Sync />}
                onClick={handleUpdateSubmit}
              >
                UPDATE COUPON
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
      </Box>
    </Container>
  );
};

export default AddCoupon;
