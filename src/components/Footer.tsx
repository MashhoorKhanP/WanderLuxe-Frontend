import React from "react";
import {
  Box,
  Paper,
  Typography,
  Link,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { SupportAgentOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { openChatScreen } from "../store/slices/userSlices/userSlice";
import { RootState } from "../store/types";

const Footer: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const handleChatButton = () => {
    dispatch(openChatScreen());
  };

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          {/* WanderLuxe Logo */}
          <img
            src={import.meta.env.VITE_WANDERLUXE_LOGO}
            alt="WanderLuxe Logo"
            style={{ width: "50px", height: "50px" }}
          />

          {/* WanderLuxe Text */}
          <Typography variant="h6" color="textPrimary" sx={{ marginRight: 2 }}>
            WanderLuxe
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
        >
          <Link
            href="/about-us"
            color="inherit"
            underline="hover"
            sx={{ marginRight: 0 }}
          >
            <Typography variant="body2">About Us |</Typography>
          </Link>

          <Link
            href="/services"
            color="inherit"
            underline="hover"
            sx={{ marginLeft: 1 }}
          >
            <Typography variant="body2">Services |</Typography>
          </Link>

          <Link
            href="/privacy-policy"
            color="inherit"
            underline="hover"
            sx={{ marginLeft: 1 }}
          >
            <Typography variant="body2">Privacy Policy</Typography>
          </Link>
        </Box>

        {/* Divider */}
        <Divider sx={{ width: "100%", marginBottom: 2 }} />
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ marginBottom: 1, fontSize: "12px" }}
        >
          <Link href="/contact" color="inherit" underline="hover">
            Contact Us
          </Link>
        </Typography>

        {/* Social Media Links */}
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
        >
          <IconButton
            color="inherit"
            href="https://www.facebook.com/"
            target="_blank"
          >
            <FacebookIcon />
          </IconButton>

          <IconButton
            color="inherit"
            href="https://twitter.com/"
            target="_blank"
          >
            <TwitterIcon />
          </IconButton>

          <IconButton
            color="inherit"
            href="https://www.instagram.com/"
            target="_blank"
          >
            <InstagramIcon />
          </IconButton>
        </Box>
        {/* Additional Information */}
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ marginBottom: 1, fontSize: "12px" }}
        >
          &copy; 2023 WanderLuxe. All rights reserved.
        </Typography>
        {currentUser && (
          <Tooltip title="Chat with Admin">
            <IconButton
              onClick={handleChatButton}
              color="inherit"
              sx={{
                position: "fixed",
                bottom: "10%",
                right: "2%",
                zIndex: 1000,
                // transform: "translateY(-50%)",
                bgcolor: "black",
                color: "white",
                margin: 1,
                transition: "background-color 0.3s, color 0.3s, transform 0.3s",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                  transform: "scale(1.1)",
                },
              }}
            >
              <SupportAgentOutlined />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    </Box>
  );
};

export default Footer;
