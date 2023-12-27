// import { Box, Button, Typography } from "@mui/material";
// import { grey } from "@mui/material/colors";
// import { DataGrid, gridClasses } from "@mui/x-data-grid";
// import React, { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import AddOffer from "./AddOffer";
// import { useDispatch } from "react-redux";

// interface OffersProps {
//   setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
//   link: string;
// }

// const Offers: React.FC<OffersProps> = ({ setSelectedLink, link }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   useEffect(() => {
//     setSelectedLink(link);
//   }, []);

//   const handleAddCoupon = () => {
//     // dispatch(
//     //   updateCouponDetails({
//     //     couponCode: "",
//     //     discountType: "",
//     //     discount: 0,
//     //     maxDiscount: 0,
//     //     expiryDate: dayjs(),
//     //     couponCount: 0,
//     //     description: "",
//     //   })
//     // );
//     // dispatch(updateUpdatedCoupon({}));
//     navigate("/admin/dashboard/offers/add-offer");
//   };

//   return (
//     <>
//     {location.pathname === "/admin/dashboard/offers" ? (
//       <div
//         className="container"
//         style={{ display: "flex", flexDirection: "column" }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             paddingRight: 8,
//             paddingTop: 1,
//           }}
//         >
//           <Button onClick={handleAddCoupon}>ADD OFFER</Button>
//         </Box>
//         <Box sx={{ height: 400, width: "95%" }}>
//           <Typography
//             variant="h4"
//             component="h4"
//             sx={{ textAlign: "center", mt: 3, mb: 3 }}
//           >
//             Manage Offers
//           </Typography>
//           {/* <DataGrid
//             columns={columns}
//             rows={coupons}
//             getRowId={(row) => row._id}
//             pageSizeOptions={[10, 25, 50, 75, 100]}
//             getRowSpacing={(params) => ({
//               top: params.isFirstVisible ? 0 : 5,
//               bottom: params.isLastVisible ? 0 : 5,
//             })}
//             sx={{
//               [`& .${gridClasses.row}`]: {
//                 bgcolor: (theme) =>
//                   theme.palette.mode === "light" ? grey[200] : grey[900],
//               },
//             }}
//             onCellEditStop={(params) =>
//               setSelectedRowId(params.id.toString())
//             } //give on onCellEditStart
//             onCellEditStart={(params) => setRowId(params.id.toString())}
//           /> */}
//         </Box>
//       </div>
//     ) : location.pathname === "/admin/dashboard/offers/add-offer" ? (
//       <AddOffer />
//     ) : location.pathname === "/admin/dashboard/offers/edit-offer" ? (
//       <AddOffer />
//     ) : null}
//   </>

// );
// };

// export default Offers;
