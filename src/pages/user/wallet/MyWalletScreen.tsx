import {
  AddCardOutlined,
  ArrowBack,
  HistoryOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserBookings } from "../../../actions/booking";
import { postAddMoneyToWalletRequest } from "../../../actions/user";
import useCheckToken from "../../../components/hooks/useCheckToken";
import {
  openWalletHistory,
  setBookings,
} from "../../../store/slices/userSlices/userSlice";
import { AppDispatch } from "../../../store/store";
import { RootState } from "../../../store/types";

const MyWalletScreen: React.FC = () => {
  const checkToken = useCheckToken();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [stripe, setStripe] = useState<any>();

  const bookings: any = useSelector((state: RootState) => state.user.bookings);
  const [currentPage, setCurrentPage] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isAddMoneyModalOpen, setAddMoneyModalOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState<number>(1);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  useEffect(() => {
    if (!bookings.length) {
      const fetchBookings = async () => {
        const userId =
          currentUser?.message?._id !== undefined
            ? currentUser?.message?._id
            : currentUser?._id;
        const userDetails = {
          userId: userId as string,
        };
        const response = await dispatch(getUserBookings({ userDetails }));
        dispatch(setBookings(response.payload.message)); // assuming getHotels returns { payload: hotels }
      };

      fetchBookings();
    }
  }, [dispatch, currentUser]);

  checkToken;
  const handleViewWalletHistory = () => {
    dispatch(openWalletHistory());
    // dispatch(setBookingId(bookingId));
    // dispatch(setRoomId(roomId));
  };

  const handleAddMoneyToWallet = () => {
    setAddMoneyModalOpen(true);
  };

  const handleModalClose = () => {
    setAddMoneyModalOpen(false);
  };

  const handleAddMoney = async (event: React.FormEvent) => {
    // You can add your logic to handle the amount here
    // For simplicity, let's just log the amount for now.
    event?.preventDefault();
    const addMoneyToWalletDetails = {
      userId: currentUser?._id as string,
      amount: amountToAdd,
    };

    if (!stripe) {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    }
    dispatch(postAddMoneyToWalletRequest({ addMoneyToWalletDetails }));
    handleModalClose();
    // dispatch(getUpdatedUser(currentUser?._id as string));
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredAmount = parseFloat(event.target.value);
    setAmountToAdd(enteredAmount);
  };

  return (
    <Container>
      <Box
        display="flex"
        alignItems="center"
        paddingTop={4}
        flexDirection="row"
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" marginLeft={1}>
          My Wallet
        </Typography>
      </Box>
      {currentUser && (
        <ImageList
          gap={12}
          sx={{
            paddingTop: 2,
            mb: 8,
            gridTemplateColumns:
              "repeat(auto-fill,minmax(280px, 1fr)) !important",
          }}
        >
          <Card sx={{ width: "100%", height: "270px" }}>
            <ImageListItem sx={{ height: "100% !important" }}>
              <ImageListItemBar
                sx={{
                  background: "1",
                  fontWeight: "500",
                }}
                title="Wallet Details"
                subtitle={`${currentUser.firstName} ${currentUser.lastName}`}
                position="top"
                actionIcon={
                  <>
                    <Avatar
                      src={import.meta.env.VITE_WANDERLUXE_LOGO}
                      sx={{ m: "10px" }}
                    />

                    {/* <Tooltip title="View Rooms">
                      <IconButton
                        onClick={() => handleViewRoom(hotel._id)} // Add your wishlist logic here
                        sx={{
                          position: "absolute",
                          top: "85px",
                          right: "10px",
                          color: "white",
                          transition: "color 0.3s ease",
                          "&:hover": { color: "red" },
                        }}
                      >
                        <BedOutlined
                          sx={{
                            color: "white",
                            transition: "color 0.3s ease",
                            "&:hover": { color: "red" },
                          }}
                          onClick={() => handleViewRoom(hotel._id)}
                        />
                      </IconButton>
                    </Tooltip> */}
                  </>
                }
              />
              <img
                src={import.meta.env.VITE_WALLETBACKGROUND_IMAGE}
                alt="Wallet Image"
                loading="lazy"
              />
              <ImageListItemBar
                sx={{
                  height: "211px",
                }}
                title={
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        color: "#ececec",
                      }}
                    >
                      Current Balance:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "25px",
                        color: "#ececec",
                      }}
                    >
                      {`₹${currentUser.wallet}`}
                    </Typography>
                  </>
                }
                actionIcon={
                  <>
                    <Tooltip title={"Add money to wallet"}>
                      <IconButton
                        onClick={handleAddMoneyToWallet} // Add your wishlist logic here
                        sx={{
                          position: "absolute",
                          top: "0px",
                          right: "11px",
                          color: "white",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.2)",
                          },
                        }}
                      >
                        <AddCardOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Wallet History">
                      <HistoryOutlined
                        sx={{
                          color: "rgba(255,255,255, 0.8)",
                          mr: "20px",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.2)",
                          },
                        }}
                        onClick={handleViewWalletHistory}
                      />
                    </Tooltip>
                  </>
                }
              />
            </ImageListItem>
          </Card>
        </ImageList>
      )}
      <Modal
        open={isAddMoneyModalOpen}
        onClose={handleModalClose}
        aria-labelledby="add-money-modal"
        aria-describedby="add-money-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "4px",
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography
            variant="body1"
            fontWeight={"bold"}
            pb={2}
            id="modal-title"
          >
            Add Money to Wallet
          </Typography>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            value={amountToAdd}
            onChange={handleAmountChange}
          />
          {amountToAdd > 20000 && (
            <Typography variant="caption" color="error">
              Maximum amount limit reached (₹20,000).
            </Typography>
          )}
          {amountToAdd < 100 && (
            <Typography variant="caption" color="error">
              Minimum amount is ₹100.
            </Typography>
          )}
          <Stack
            direction="row"
            width={"100%"}
            spacing={0.5}
            paddingBottom={2}
            paddingTop={2}
          >
            <Button
              variant="outlined"
              sx={{
                width: "100%",
                p: 1,
                borderRadius: 0,
                bgcolor: "",
                color: "#DC3545",
                border: "1px solid #DC3545",
                transition: "background-color 0.5s, color 0.5s",
                "&:hover": {
                  bgcolor: "#DC3545",
                  color: "white",
                  border: "none",
                },
              }}
              onClick={handleModalClose}
            >
              <span>Cancel</span>
            </Button>
            <Button
              className="book_room_btn"
              sx={{ width: "100%", p: 1, borderRadius: 0 }}
              color="inherit"
              variant="outlined"
              onClick={handleAddMoney}
              disabled={
                amountToAdd <= 0 ||
                amountToAdd > 20000 ||
                amountToAdd < 100 ||
                isNaN(amountToAdd)
              }
            >
              <span>Add Money</span>
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
};

export default MyWalletScreen;
