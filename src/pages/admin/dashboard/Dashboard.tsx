import React, { useEffect, useMemo, useState } from "react";
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
import { Brightness4Sharp, Brightness7 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/types";
import useCheckToken from "../../../components/hooks/useCheckToken";

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
  const { currentAdmin } = useSelector((state: RootState) => state.admin);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [title, setTitle] = useState("Admin Panel");
 
  console.log(currentAdmin)
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
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
            <IconButton sx={{mr:1}} onClick={()=>navigate('/dashboard')}>    
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
        <SideList open={open} setOpen={setOpen} updateTitle={setTitle} />
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
