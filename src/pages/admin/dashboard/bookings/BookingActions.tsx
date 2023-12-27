import React, { useEffect, useState } from "react";
import { Check, Delete, Edit, InfoOutlined, Preview, Save, TocOutlined } from "@mui/icons-material";
import { Box, CircularProgress, Fab, IconButton, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../store/store";
import {
  updateCouponDetails,
  updateUpdatedCoupon,
} from "../../../../store/slices/adminSlices/adminCouponSlice";
import { deleteCoupon, updateCoupon } from "../../../../actions/coupon";
import { green } from "@mui/material/colors";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { updateBooking } from "../../../../actions/booking";

interface BookingActionsProps {
  params: any;
  setData: any;
  selectedRowId: string;
  setRowId: React.Dispatch<React.SetStateAction<string>>;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string>>;
}

const BookingActions: React.FC<BookingActionsProps> = ({
  params,
  setData,
  selectedRowId,
  setRowId,
  setSelectedRowId,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    _id,
  status,
  } = params.row;
  console.log('params',params);
  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(async () => {
      const { status } = params.row;
      try {
        // Assuming updateUser is an asynchronous action (thunk)
        const result = await updateBooking({
          updatedBooking: {
            _id: _id,
            status:status,
          },
        });
        if (result) {
          setData((prevData: any) => !prevData);
          setSuccess(true);
          setRowId("");
          setSelectedRowId("");
        }
      } catch (error) {
        // Handle error if needed
        console.error("Error updating user:", error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (selectedRowId === params.row._id && success) setSuccess(false);
  }, [selectedRowId]);

  const handleViewMoreDetails = () => {
    navigate(`/admin/dashboard/bookings/view-more?bookingId=${_id}`);
  };

  // const handleEdit = () => {
  //   dispatch(
  //     updateCouponDetails({
  //       couponCode,
  //       discountType,
  //       discount,
  //       maxDiscount,
  //       expiryDate,
  //       couponCount,
  //       description,
  //       isCancelled,
  //     })
  //   );
  //   dispatch(
  //     updateUpdatedCoupon({
  //       _id,
  //       couponCode,
  //       discountType,
  //       discount,
  //       maxDiscount,
  //       expiryDate,
  //       couponCount,
  //       description,
  //       isCancelled,
  //     })
  //   );

  //   navigate("/admin/dashboard/coupons/edit-coupon");
  // };

  // const handleDelete = async (row: any) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: `Do you want to delete ${row.couponCode} coupon!`,
  //     icon: "error",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Delete",
  //     cancelButtonText: "No, cancel!",
  //     customClass: {
  //       container: "custom-swal-container",
  //     },
  //     width: 400, // Set your desired width
  //     background: "#f0f0f0",
  //     iconHtml: '<i class="bi bi-trash" style="font-size:30px"></i>',
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       dispatch(deleteCoupon({ couponData: row }));
  //       toast.success("Coupon deleted successfully");
  //       setData((prevData: any) => !prevData);
  //     }
  //   });
  // };

  return (
    <>
      <Tooltip title="Save Cancelled Action">
        <Box
          sx={{
            m: 1,
            position: "relative",
          }}
        >
          {success ? (
            <Fab
              color="primary"
              sx={{
                width: 40,
                height: 40,
                bgcolor: green[500],
                "&:hover": { bgcolor: green[700] },
              }}
            >
              <Check />
            </Fab>
          ) : (
            <Fab
              color="primary"
              sx={{
                width: 40,
                height: 40,
              }}
              disabled={params.row._id !== selectedRowId || loading}
              onClick={handleSubmit}
            >
              <Save />
            </Fab>
          )}
          {loading && (
            <CircularProgress
              size={52}
              sx={{
                color: green[500],
                position: "absolute",
                top: -6,
                left: -6,
                zIndex: 1,
              }}
            />
          )}
        </Box>
      </Tooltip>
      <Box>
        <Tooltip title="View more details">
          <IconButton onClick={() => handleViewMoreDetails()}>
            <TocOutlined sx={{fontSize:'35px'}}/>
          </IconButton>
        </Tooltip>
        {/* <Tooltip title='Delete this coupon'>
          <IconButton onClick={() => handleDelete(params.row)}>
            <Delete/>
          </IconButton>
      </Tooltip> */}
      </Box>
    </>
  );
};

export default BookingActions;
