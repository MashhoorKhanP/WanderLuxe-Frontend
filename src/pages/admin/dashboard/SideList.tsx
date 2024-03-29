import {
  Apartment,
  ChevronLeft,
  Dashboard,
  Hotel,
  Logout,
  MarkChatUnreadOutlined,
  PeopleAlt,
  Redeem,
  Style,
  ViewCarousel,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { CSSObject, Theme, styled } from "@mui/material/styles";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { logoutAdmin } from "../../../store/slices/adminSlices/adminSlice";
import { RootState } from "../../../store/types";
import Banners from "./banners/Banners";
import Bookings from "./bookings/Bookings";
import Coupons from "./coupons/Coupons";
import ChatScreen from "./dashboardHome/ChatScreen";
import DashboardHome from "./dashboardHome/Dashboard";
import Hotels from "./hotels/Hotels";
import Rooms from "./rooms/Rooms";
import Users from "./users/Users";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  marginTop: 2,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface SideListProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateTitle: React.Dispatch<React.SetStateAction<string>>;
  socket?: Socket | null;
}

const SideList: React.FC<SideListProps> = ({
  socket,
  open,
  setOpen,
  updateTitle,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentAdmin } = useSelector((state: RootState) => state.admin); //change currentAdmin make slice
  const [selectedLink, setSelectedLink] = useState("");

  console.log("Socket from Sidelist", socket);
  const handleItemClick = (link: string, title: string) => {
    setOpen(false);
    setSelectedLink(link);
    updateTitle(title);
    navigate(link.startsWith("/") ? link : `/admin/dashboard/${link}`);
  };

  const list = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: <Dashboard />,
        link: "home",
        component: <DashboardHome {...{ setSelectedLink, link: "home" }} />,
      },
      {
        title: "Users",
        icon: <PeopleAlt />,
        link: "users",
        component: <Users {...{ setSelectedLink, link: "users" }} />,
      },
      {
        title: "Messages",
        icon: <MarkChatUnreadOutlined />,
        link: "chat-screen",
        component: socket ? (
          <ChatScreen
            socket={socket}
            {...{ setSelectedLink, link: "chat-screen" }}
          />
        ) : (
          <div>Loading...</div> // Or any other fallback UI
        ),
      },
      {
        title: "Hotels",
        icon: <Apartment />,
        link: "hotels",
        component: <Hotels {...{ setSelectedLink, link: "hotels" }} />,
      },
      {
        title: "Rooms",
        icon: <Hotel />,
        link: "rooms",
        component: <Rooms {...{ setSelectedLink, link: "rooms" }} />,
      },
      {
        title: "Bookings",
        icon: <Style />,
        link: "bookings",
        component: <Bookings {...{ setSelectedLink, link: "bookings" }} />,
      },
      {
        title: "Coupons",
        icon: <Redeem />,
        link: "coupons",
        component: <Coupons {...{ setSelectedLink, link: "coupons" }} />,
      },
      // {
      //   title: "Offers",
      //   icon: <Discount />,
      //   link: "offers",
      //   component: <Offers {...{ setSelectedLink, link: "offers" }} />,
      // },
      {
        title: "Banners",
        icon: <ViewCarousel />,
        link: "banners",
        component: <Banners {...{ setSelectedLink, link: "banners" }} />,
      },
    ],
    [socket]
  );

  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  return (
    <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {list.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => handleItemClick(item.link, item.title)}
                selected={selectedLink === item.link}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ mx: "auto", mt: 3, mb: 1 }}>
          {/* currentUser?.message?.firstName || currentUser?.firstName
            currentUser?.message?.profileImage || currentUser?.profileImage */}
          <Tooltip title={currentAdmin?.firstName}>
            <Avatar
              src={currentAdmin?.profileImage}
              {...(open && { sx: { width: 50, height: 50 } })}
            >
              {currentAdmin?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          {open && <Typography>{currentAdmin?.firstName}</Typography>}
          <Typography variant="body2">ADMIN</Typography>
          {/* {open && <Typography variant='body2'>{currentUser?.message?.email || currentUser?.email}</Typography>} */}
          <Tooltip title="Logout" sx={{ mt: 1 }}>
            <IconButton onClick={handleLogout}>
              <Logout sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, padding: "30px 30px 30px 30px" }}
      >
        <DrawerHeader />
        <Routes>
          {list.map((item) => (
            <Route
              key={item.title}
              path={`${item.link}/*`}
              element={item.component}
            />
          ))}
        </Routes>
      </Box>
    </>
  );
};

export default SideList;
