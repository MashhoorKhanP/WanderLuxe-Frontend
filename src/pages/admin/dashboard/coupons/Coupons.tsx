import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddCoupon from "./AddCoupon";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCouponDetails,
  updateCoupons,
  updateUpdatedCoupon,
} from "../../../../store/slices/adminSlices/adminCouponSlice";
import dayjs from "dayjs";
import { DataGrid, GridColDef, gridClasses } from "@mui/x-data-grid";
import { getCoupons } from "../../../../actions/coupon";
import { RootState } from "../../../../store/types";
import moment from "moment";
import { grey } from "@mui/material/colors";
import CouponsActions from "./CouponsActions";

interface CouponsProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Coupons: React.FC<CouponsProps> = ({ setSelectedLink, link }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rowId, setRowId] = useState<string>("");
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const coupons = useSelector((state: RootState) => state.adminCoupon.coupons);

  const [data, setData] = useState<boolean>(true);
  
  useEffect(() => {
    setSelectedLink(link);
  }, [setSelectedLink, link]);

  useEffect(() => {
    const result = dispatch(getCoupons() as any);
    dispatch(updateCoupons({ result }));
  }, [data, dispatch]);

  const handleAddCoupon = () => {
    dispatch(
      updateCouponDetails({
        couponCode: "",
        discountType: "",
        discount: 0,
        maxDiscount: 0,
        expiryDate: dayjs(),
        couponCount: 0,
        description: "",
      })
    );
    dispatch(updateUpdatedCoupon({}));
    navigate("/admin/dashboard/coupons/add-coupon");
  };

  const renderCouponsCountCell = (params: any) => {
    const couponCount = params.row.couponCount;

    let textColor;
    if (couponCount < 10) {
      textColor = "red";
    } else if (couponCount < 20) {
      textColor = "orange";
    } else {
      textColor = "green";
    }

    return <span style={{ color: textColor }}>{`${couponCount}`}</span>;
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "couponCode", headerName: "Coupon Code", width: 120 },
      { field: "discountType", headerName: "Discount Type", width: 120 },
      {
        field: "discount",
        headerName: "Discount",
        width: 80,
        align: "center",
        renderCell: (params) => {
          const { discountType, discount } = params.row;

          // Format the discount based on the discountType
          const formattedDiscount =
            discountType === "percentage" ? `${discount}%` : `₹${discount}`;

          return <span>{formattedDiscount}</span>;
        },
      },
      {
        field: "expiryDate",
        headerName: "Expire At",
        width: 110,
        renderCell: (params) =>
          moment(params.row.expiryDate).format("DD-MM-YYYY"),
      },
      {
        field: "couponCount",
        headerName: "Availability",
        width: 100,
        align: "center",
        renderCell: (params) => renderCouponsCountCell(params),
      },
      {
        field: "description",
        headerName: "Description",
        width: 150,
        align: "center",
      },
      {
        field: "createdAt",
        headerName: "Created At",
        align: "center",
        width: 150,
        renderCell: (params) =>
          moment(params.row.createdAt).format("YYYY-MM-DD HH:MM:SS"),
      },

      {
        field: "isCancelled",
        headerName: "Cancelled",
        width: 110,
        type: "boolean",
        editable: true,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        type: "actions",
        renderCell: (params) => (
          <CouponsActions
            {...{
              params,
              setData,
              selectedRowId,
              setRowId,
              setSelectedRowId,
            }}
          />
        ),
      },
      {
        field: "_id",
        headerName: "Coupon ID",
        type: "string",
        width: 150,
        align: "center",
      },
    ],
    [rowId, selectedRowId]
  );

  return (
    <>
      {location.pathname === "/admin/dashboard/coupons" ? (
        <div
          className="container"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: 8,
              paddingTop: 1,
            }}
          >
            <Button onClick={handleAddCoupon}>ADD COUPON</Button>
          </Box>
          <Box sx={{ height: 400, width: "95%" }}>
            <Typography
              variant="h4"
              component="h4"
              sx={{ textAlign: "center", mt: 3, mb: 3 }}
            >
              Manage Coupons
            </Typography>
            <DataGrid
              columns={columns}
              rows={coupons}
              getRowId={(row) => row._id}
              pageSizeOptions={[10, 25, 50, 75, 100]}
              getRowSpacing={(params) => ({
                top: params.isFirstVisible ? 0 : 5,
                bottom: params.isLastVisible ? 0 : 5,
              })}
              sx={{
                [`& .${gridClasses.row}`]: {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? grey[200] : grey[900],
                },
              }}
              onCellEditStop={(params) =>
                setSelectedRowId(params.id.toString())
              } //give on onCellEditStart
              onCellEditStart={(params) => setRowId(params.id.toString())}
            />
          </Box>
        </div>
      ) : location.pathname === "/admin/dashboard/coupons/add-coupon" ? (
        <AddCoupon />
      ) : location.pathname === "/admin/dashboard/coupons/edit-coupon" ? (
        <AddCoupon />
      ) : null}
    </>
  );
};

export default Coupons;
