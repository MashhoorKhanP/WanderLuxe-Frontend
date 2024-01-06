import React, { forwardRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  IconButton,
  Slide,
  SlideProps,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/types";
import { useNavigate } from "react-router-dom";
import { Close, ContentPasteOutlined } from "@mui/icons-material";
import { getCoupons } from "../../../actions/coupon";
import { AppDispatch } from "../../../store/store";
import {
  closeCouponOverview,
  setCoupons,
} from "../../../store/slices/userSlices/couponSlice";
import { setAlert } from "../../../store/slices/userSlices/userSlice";

export interface Coupon {
  _id: string;
  couponCode: string;
  description: string;
  expiryDate: string;
  couponCount: number;
  discountType: string;
  discount: number;
  maxDiscount?: number;
  isCancelled: boolean;
}
const Transition = forwardRef<HTMLDivElement, SlideProps>((props, ref) => {
  const transitionSpeed = 500;

  return (
    <Slide
      direction="down"
      {...props}
      ref={ref}
      timeout={{ enter: transitionSpeed, exit: transitionSpeed }}
    />
  );
});

const CouponsOverviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isOpen = useSelector(
    (state: RootState) => state.coupon.isCouponOverviewOpen
  );
  // const roomId = useSelector((state: RootState) => state.room.selectedRoomId);

  const coupons = useSelector((state: RootState) => state.coupon.coupons);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    if (!coupons.length) {
      const fetchCoupons = async () => {
        const response = await dispatch(getCoupons());
        dispatch(setCoupons(response.payload.message)); // assuming getHotels returns { payload: hotels }
      };
      fetchCoupons();
    }
  }, [dispatch]);

  useEffect(() => {
    // Filter available coupons based on your conditions
    const filteredCoupons = coupons.filter(
      (coupon: Coupon) =>
        new Date(coupon.expiryDate) > new Date() &&
        coupon.couponCount > 0 &&
        !coupon.isCancelled
    );
    setAvailableCoupons(filteredCoupons);
  }, [coupons]);

  const handleClose = () => {
    dispatch(closeCouponOverview());
  };

  const handleCopyCouponCode = (couponCode: string) => {
    dispatch(closeCouponOverview());
    navigator.clipboard.writeText(couponCode);
    dispatch(setAlert({open:true, severity:'success', message:`Coupon Code: ${couponCode} copied`}))
  };

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          handleClose();
        }
      }}
      TransitionComponent={Transition}
    >
      <Container>
        <Toolbar sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography variant="h6">Explore Coupons</Typography>
            <Typography variant="subtitle2">Select coupons</Typography>
          </div>
          <IconButton color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </Toolbar>
        <Divider
          sx={{
            width: "100%",
            height: "1px",
            bgcolor: "#777",
          }}
        />
        <br />
          {availableCoupons.length ?(
        <Box>
          {/* Display available coupons */}

            
          {availableCoupons.map((coupon) => (
            <Box
              key={coupon.couponCode}
              sx={{
                marginBottom: 2,
                p: 2,
                border: "1.5px solid black",
                borderRadius: 1.5,
              }}
            >
              <Typography variant="subtitle1">{coupon.couponCode}</Typography>
              <Typography variant="h6">{coupon.description}</Typography>
              <Typography variant="subtitle2">{`A discount of ${
                coupon.discountType === "percentage"
                  ? `${coupon.discount}%`
                  : `₹${coupon.discount}`
              } on all room booking. ${
                coupon.discountType === "percentage"
                  ? `up to ₹${coupon.maxDiscount}`
                  : ""
              }`}</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Tooltip title={coupon.couponCode}>
                  <Button
                    sx={{
                      bgcolor: "black",
                      transition: "color border bgColor 0.3s ease",
                      "&:hover": {
                        bgcolor: "#ffffff",
                        color: "#000000",
                        border: "1px solid black",
                      },
                    }}
                    variant="contained"
                    endIcon={<ContentPasteOutlined />}
                    onClick={() => handleCopyCouponCode(coupon.couponCode)}
                  >
                    Copy Code
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
          ):(
            <Box
          sx={{
            width: '100%',
            display:'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
              <Typography variant="h5" fontWeight='bold' display="flex" padding={2}>
                No coupons available!
              </Typography>
              <img src={import.meta.env.VITE_NOCOUPONFOUND_GIF}  style={{ borderRadius: '15px', width: '100%', maxWidth: '400px' }}  alt="Empty wishlist..." />
          
            </Box>
          )}
      </Container>
    </Dialog>
  );
};

export default CouponsOverviewScreen;
