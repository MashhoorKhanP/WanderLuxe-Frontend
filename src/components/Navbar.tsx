import { Lock } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setOpenLogin } from "../store/slices/userSlices/userSlice";
import { AppDispatch } from "../store/store";
import { RootState } from "../store/types";
import UserIcons from "./user/UserIcons";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const handleOpenLogin = () => {
    dispatch(setOpenLogin(true));
    navigate("/login-register");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* <Box>
          <IconButton size='large' sx={{display:{color:'#000000'}}}>
            <Menu/>
          </IconButton>
        </Box> */}
            <Box>
              <img
                src={import.meta.env.VITE_WANDERLUXE_LOGO}
                style={{ width: "35px" }}
              />
            </Box>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              onClick={() => navigate("/home")}
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex", color: "#000000" },
                cursor: "pointer",
              }}
            >
              WanderLuxe
            </Typography>
            <Typography
              variant="h6"
              component="h1"
              noWrap
              onClick={() => navigate("/home")}
              sx={{
                flexGrow: 1,
                display: {
                  xs: "flex",
                  md: "none",
                  color: "#000000",
                  cursor: "pointer",
                },
              }}
            >
              WanderLuxe
            </Typography>
            {!currentUser ? (
              <Button
                color="inherit"
                sx={{ display: { color: "#000000" } }}
                startIcon={<Lock />}
                onClick={handleOpenLogin}
              >
                Login
              </Button>
            ) : (
              <UserIcons />
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
