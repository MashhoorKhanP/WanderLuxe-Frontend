import {
  CorporateFareOutlined,
  HandshakeOutlined,
  PersonAddOutlined,
  PointOfSaleOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  ListItemAvatar,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../../../actions/admin";
import { getBookings } from "../../../../actions/booking";
import { getHotels } from "../../../../actions/hotel";
import { getRooms } from "../../../../actions/room";
import LineChart from "../../../../components/admin/dashboard/LineChart";
import PieChart from "../../../../components/admin/dashboard/PieChart";
import RadialBarChart from "../../../../components/admin/dashboard/RadialChart";
import StatBox from "../../../../components/admin/dashboard/StatBox";
import { updateHotels } from "../../../../store/slices/adminSlices/adminHotelSlice";
import { updateRooms } from "../../../../store/slices/adminSlices/adminRoomSlice";
import { openChatScreen } from "../../../../store/slices/userSlices/userSlice";
import { RootState } from "../../../../store/types";

interface MainProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const DashboardHome: React.FC<MainProps> = ({ setSelectedLink, link }) => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.admin.users);
  const hotels = useSelector((state: RootState) => state.adminHotel.allHotels);
  const rooms = useSelector((state: RootState) => state.adminRoom.rooms);
  const bookings = useSelector((state: RootState) => state.admin.bookings);

  const checkedOutBookings = bookings.filter(
    (booking) => booking.status === "Checked-Out"
  );
  const totalRevenueCheckedOut = checkedOutBookings.reduce(
    (total, booking) => total + booking.totalAmount,
    0
  );

  const currentDate = moment();
  const currentMonth = currentDate.format("MMMM YYYY");
  const totalIncomeCurrentMonth = checkedOutBookings
    .filter(
      (booking) =>
        moment(booking.createdAt).format("MMMM YYYY") === currentMonth
    )
    .reduce((total, booking) => total + booking.totalAmount, 0);

  const cancelledBookings = bookings.filter(
    (booking: any) =>
      booking.status === "Cancelled" || booking.status === "Cancelled by Admin"
  );

  const newMessage = useSelector((state: RootState) => state.admin.newMessages);
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  useEffect(() => {
    if (hotels.length === 0) {
      const hotels = dispatch(getHotels() as any);
      dispatch(updateHotels({ hotels }));
    }
    if (rooms.length === 0) {
      const rooms = dispatch(getRooms() as any);
      dispatch(updateRooms({ rooms }));
    }
    if (users.length === 0) {
      dispatch(getUsers() as any);
    }
    if (bookings.length === 0) {
      dispatch(getBookings() as any);
    }
  }, [dispatch]);

  const handleMessageIcon = () => {
    dispatch(openChatScreen());
  };
  return (
    <Box pb={10}>
      {/* <Box display='flex' justifyContent='end' alignItems='flex-end' pb='10px'>
    <Button sx={{
      backgroundColor:'#565ceb',
      color:'#f5f5f5',
      borderRadius:'0',
      fontSize:'12px',
      fontWeight:'bold',
      padding:'6px'
    }}>
      <DownloadOutlined sx={{mr:'2px'}}/>
      Download Reports
    </Button>
    </Box> */}
      {/* Grid and Charts */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12,1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Row 1 */}
        <Box
          gridColumn="span 3"
          sx={{
            backgroundColor: "#1b2537",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title={totalRevenueCheckedOut}
            subtitle={"Total Sales"}
            progress={"0.65"}
            increase={"+21%"}
            icon={
              <PointOfSaleOutlined
                sx={{ color: "#43a047", fontSize: "36px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          sx={{
            backgroundColor: "#1b2537",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title={users?.length}
            subtitle={"Total Users"}
            progress={"0.5"}
            increase={"+24%"}
            icon={
              <PersonAddOutlined sx={{ color: "#43a047", fontSize: "36px" }} />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          sx={{
            backgroundColor: "#1b2537",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title={hotels?.length}
            subtitle={"Total Hotels"}
            progress={"0.30"}
            increase={"+4%"}
            icon={
              <CorporateFareOutlined
                sx={{ color: "#43a047", fontSize: "36px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          sx={{
            backgroundColor: "#1b2537",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StatBox
            title={checkedOutBookings?.length}
            subtitle={"Total Bookings"}
            progress={"0.40"}
            increase={"+51%"}
            icon={
              <HandshakeOutlined sx={{ color: "#43a047", fontSize: "36px" }} />
            }
          />
        </Box>
        {/* Row 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{ backgroundColor: "#1b2537" }}
        >
          <Box
            mt="15px"
            p="20px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography color="#f5f5f5" variant="h6" fontWeight="400">
                Income Stats -{" "}
                <Typography
                  variant="h6"
                  component="span"
                  fontSize="14px"
                  color="#565ceb"
                >
                  {currentMonth}
                </Typography>
                <Typography variant="h5" fontWeight="500" color="#43a047">
                  ₹{totalIncomeCurrentMonth}
                </Typography>
              </Typography>
            </Box>
            {/* <Box>
            <IconButton>
              <DownloadOutlined
              sx={{fontSize:'26px',color:'#43a047'}}
              />
            </IconButton>
          </Box> */}
          </Box>
          <Box height={"300px"} mt="-5px">
            <LineChart bookings={checkedOutBookings} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          height={"455px"}
          gridRow="span 3"
          sx={{ backgroundColor: "#1b2537" }}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p="30px 15px 0px 15px"
          >
            <Typography color="#f5f5f5" variant="h6" fontWeight="400">
              Recent Transactions
            </Typography>
          </Box>
          {bookings.slice(0, 8).map((booking: any, index: number) => (
            <Box
              key={`${booking?._id}-${index}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid rgb(65,76,103)"
              p="15px"
            >
              <Box display="flex" alignItems="center">
                <Tooltip title={booking?.paymentMethod}>
                  {booking?.paymentMethod === "Online Payment" ? (
                    <i
                      className="bi bi-stripe"
                      style={{ color: "#565ceb" }}
                    ></i>
                  ) : (
                    <i
                      className="bi bi-wallet2"
                      style={{ color: "#565ceb" }}
                    ></i>
                  )}
                </Tooltip>
                <Box paddingLeft={2}>
                  <Typography
                    color="#43a047"
                    variant="h6"
                    fontWeight="400"
                    fontSize="14px"
                  >
                    {`${booking.firstName} ${booking.lastName}`}
                  </Typography>
                  <Typography
                    color="#f5f5f5"
                    variant="h6"
                    fontWeight="200"
                    fontSize="11px"
                  >
                    {`Date: ${moment(booking.createdAt).format(
                      "DD-MM-YYYY H:MM:ss"
                    )}`}
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        booking.status === "Cancelled" ||
                        booking.status === "Cancelled by Admin"
                          ? "#DC3545"
                          : "#43a047",
                    }}
                    variant="h6"
                    fontWeight="200"
                    fontSize="11px"
                  >
                    <Typography
                      color="#f5f5f5"
                      variant="h6"
                      fontWeight="200"
                      fontSize="11px"
                      component="span"
                    >
                      Status:{" "}
                    </Typography>
                    {`${booking.status}`}
                  </Typography>
                  <Typography
                    color="#f5f5f5"
                    variant="h6"
                    fontWeight="200"
                    fontSize="11px"
                  >
                    {`Tnx Id: ${booking.transactionId}`}
                  </Typography>
                </Box>
              </Box>

              <Box
                bgcolor="#43a047"
                p="5px 10px"
                borderRadius="0px"
                color="#f5f5f5"
              >
                ₹{booking.totalAmount}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Row 3 */}
        <Box
          gridColumn="span 6"
          height="250px"
          gridRow="span 2"
          bgcolor="#1b2537"
          alignItems="center"
        >
          <Box mt="15px" p="20px">
            <Typography variant="h6" fontWeight="400" color="#f5f5f5">
              Payment Method
            </Typography>
          </Box>
          <Box height={"280px"} flexDirection="column">
            <PieChart
              cancelledBookings={cancelledBookings.length}
              bookings={checkedOutBookings}
            />
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          height="250px"
          gridRow="span 2"
          bgcolor="#1b2537"
        >
          <Box mt="15px" p="20px">
            <Typography variant="h6" fontWeight="400" color="#f5f5f5">
              Booking Stats
            </Typography>
          </Box>
          <Box height={"280px"} flexDirection="column" alignItems="center">
            <RadialBarChart bookings={checkedOutBookings} />
          </Box>
        </Box>
        {/* Row 4 */}

        <Box
          minHeight={"300px"}
          gridColumn="span 8"
          height="250px"
          gridRow="span 2"
          bgcolor="#1b2537"
          mt="60px"
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p="30px 15px 0px 15px"
          >
            <Typography color="#f5f5f5" variant="h6" fontWeight="400">
              Recently Added Hotels
            </Typography>
          </Box>
          {hotels.slice(0, 5).map((hotel: any, index: number) => (
            <Box
              key={`${hotel?._id}-${index}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid rgb(65,76,103)"
              p="15px"
            >
              <Box display="flex" alignItems="center">
                <ListItemAvatar>
                  <Avatar alt={hotel?.hotelName} src={hotel?.images[0]} />
                </ListItemAvatar>
                <Box pr={2}>
                  <Typography
                    color="#43a047"
                    variant="h6"
                    fontWeight="400"
                    fontSize="14px"
                  >
                    {`${hotel?.hotelName}`}
                  </Typography>
                  <Typography
                    color="#f5f5f5"
                    variant="h6"
                    fontWeight="200"
                    fontSize="11px"
                    display="flex"
                    alignItems="center"
                  >
                    {`Email: ${hotel.email}`}
                  </Typography>
                  <Typography
                    color="#f5f5f5"
                    variant="h6"
                    fontWeight="200"
                    fontSize="11px"
                  >
                    {`Location: ${hotel?.location}`}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  color="#f5f5f5"
                  variant="h6"
                  fontWeight="200"
                  fontSize="11px"
                  display="flex"
                  alignItems="center"
                >
                  {`Added on: ${moment(hotel?.createdAt).format(
                    "DD-MM-YYYY H:MM:ss"
                  )}`}
                </Typography>
              </Box>
              <Box>
                <Typography
                  color="#f5f5f5"
                  variant="h6"
                  fontWeight="200"
                  fontSize="11px"
                  display="flex"
                  alignItems="center"
                >
                  {`₹${hotel.minimumRent}`}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          minHeight={"300px"}
          gridColumn="span 4"
          height="250px"
          gridRow="span 2"
          bgcolor="#1b2537"
          mt="60px"
          overflow="auto"
        >
          <Box mt="15px" p="20px">
            <Typography variant="h6" fontWeight="400" color="#f5f5f5">
              Recent Users
            </Typography>
          </Box>
          {users.slice(0, 5).map((user: any, index: number) => (
            <Box
              key={`${user?._id}-${index}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid rgb(65,76,103)"
              p="15px"
            >
              <Box display="flex" alignItems="center">
                <ListItemAvatar>
                  <Avatar alt={user?.firstName} src={user?.profileImage} />
                </ListItemAvatar>
                <Box>
                  {" "}
                  {/* Add margin to separate the Avatar and Typography */}
                  <Typography
                    color="#43a047"
                    variant="h6"
                    fontWeight="200"
                    fontSize="14px"
                  >
                    {`${user?.firstName} ${user?.lastName}`}
                  </Typography>
                  <Typography
                    color="#f5f5f5"
                    variant="h6"
                    fontWeight="200"
                    fontSize="11px"
                  >
                    {`Joined: ${moment(user?.createdAt).format(
                      "DD-MM-YYYY H:MM:ss"
                    )}`}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardHome;
