import React, { useEffect, useMemo, useRef, useState } from "react";
import { createTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SideList from "./SideList";
import { ThemeProvider } from "@emotion/react";
import { Tooltip } from "@mui/material";
import { Brightness4Sharp, Brightness7, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/types";
import useCheckToken from "../../../components/hooks/useCheckToken";
import { getHotels } from "../../../actions/hotel";
import { getRooms } from "../../../actions/room";
import { updateHotels } from "../../../store/slices/adminSlices/adminHotelSlice";
import { updateRooms } from "../../../store/slices/adminSlices/adminRoomSlice";
import { getCoupons } from "../../../actions/coupon";
import { updateCoupons } from "../../../store/slices/adminSlices/adminCouponSlice";
import { Socket, io } from "socket.io-client";
import { getUsers } from "../../../actions/admin";

const drawerWidth = 240;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Dashboard: React.FC = () => {
  const checkToken = useCheckToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [title, setTitle] = useState("Dashboard");

  const socket = useRef<Socket | any>();
  useEffect(() => {
    if (!socket.current && currentAdmin) {
        console.log("Socket from Dashboard", socket.current);
        socket.current = io(import.meta.env.VITE_SERVER_URL);
        socket.current.emit("addUser", currentAdmin?._id);
        socket.current.on("welcome", (message: any) => {
        console.log("SocketIOmessage", message);
      });
    }
  }, [socket, currentAdmin]);

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
        },
      }),
    [dark]
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  checkToken;
  useEffect(() => {
    if (!currentAdmin) {
      navigate("/admin/login");
    }
  }, [navigate, currentAdmin]);

  useEffect(() => {
    const hotels = dispatch(getHotels() as any);
    dispatch(updateHotels({ hotels }));
    const rooms = dispatch(getRooms() as any);
    dispatch(updateRooms({ rooms }));
    const coupons = dispatch(getCoupons() as any);
    dispatch(updateCoupons({ coupons }));
    dispatch(getUsers() as any);
  }, [dispatch]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Box
          sx={{
            display: "flex",
            backgroundColor: !dark ? "#ffffff" : "#000000",
          }}
        >
          <CssBaseline />
          <AppBar
            position="fixed"
            open={open}
            sx={{ backgroundColor: !dark ? "#9f9f9f" : "#000000", padding: 1 }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              {/* <Tooltip title='Home'>
            <IconButton sx={{mr:1}} onClick={()=>navigate('/admin/dashboard')}>    
              <Home/>
            </IconButton>
          </Tooltip> */}
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                {title}
              </Typography>
              <Tooltip title={dark ? "Light Mode" : "Dark Mode"}>
                <IconButton onClick={() => setDark(!dark)}>
                  {dark ? <Brightness7 /> : <Brightness4Sharp />}
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <SideList
            socket={socket.current}
            open={open}
            setOpen={setOpen}
            updateTitle={setTitle}
          />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Dashboard;
