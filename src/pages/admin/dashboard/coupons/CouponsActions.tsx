import { Check, Delete, Edit, Save } from "@mui/icons-material";
import { Box, CircularProgress, Fab, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteCoupon, updateCoupon } from "../../../../actions/coupon";
import {
  updateCouponDetails,
  updateUpdatedCoupon,
} from "../../../../store/slices/adminSlices/adminCouponSlice";
import { AppDispatch } from "../../../../store/store";

interface CouponsActionsProps {
  params: any;
  setData: any;
  selectedRowId: string;
  setRowId: React.Dispatch<React.SetStateAction<string>>;
  setSelectedRowId: React.Dispatch<React.SetStateAction<string>>;
}

const CouponsActions: React.FC<CouponsActionsProps> = ({
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
    couponCode,
    discountType,
    discount,
    maxDiscount,
    expiryDate,
    couponCount,
    description,
    isCancelled,
  } = params.row;

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(async () => {
      const { isCancelled } = params.row;
      try {
        // Assuming updateUser is an asynchronous action (thunk)
        const result = await updateCoupon({
          updatedCoupon: {
            _id: _id,
            couponCode: couponCode,
            discountType: discountType,
            discount: discount,
            maxDiscount: maxDiscount,
            expiryDate: expiryDate,
            couponCount: couponCount,
            description: description,
            isCancelled: isCancelled,
          },
        });
        if (result) {
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

  const handleEdit = () => {
    dispatch(
      updateCouponDetails({
        couponCode,
        discountType,
        discount,
        maxDiscount,
        expiryDate,
        couponCount,
        description,
        isCancelled,
      })
    );
    dispatch(
      updateUpdatedCoupon({
        _id,
        couponCode,
        discountType,
        discount,
        maxDiscount,
        expiryDate,
        couponCount,
        description,
        isCancelled,
      })
    );
    setData((prevData: any) => !prevData);
    navigate("/admin/dashboard/coupons/edit-coupon");
  };

  const handleDelete = async (row: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${row.couponCode} coupon!`,
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, cancel!",
      customClass: {
        container: "custom-swal-container",
      },
      width: 400, // Set your desired width
      background: "#f0f0f0",
      iconHtml: '<i class="bi bi-trash" style="font-size:30px"></i>',
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(deleteCoupon({ couponData: row }));
        toast.success("Coupon deleted successfully");
        setData((prevData: any) => !prevData);
      }
    });
  };

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
        <Tooltip title="Edit this coupon">
          <IconButton onClick={() => handleEdit()}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete this coupon">
          <IconButton onClick={() => handleDelete(params.row)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default CouponsActions;
