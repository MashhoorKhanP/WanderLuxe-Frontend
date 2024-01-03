import { MarkChatUnreadOutlined } from "@mui/icons-material";
import { Badge, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MainProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const DashboardHome: React.FC<MainProps> = ({ setSelectedLink, link }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  return (
    <div
          className="container"
          style={{ display: "flex", flexDirection: "column" }}
        >
    <Box sx={{ height: "100vh", width: "100%", display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "flex-start" }}>
    <Typography variant="h4" component="h4" sx={{ textAlign: "center", mt: 3, mb: 3 }}>
      Dashboard
    </Typography>
    <Box sx={{ position: "absolute", top: 100, right: 100, padding: 2 }}>
      <IconButton color="info" onClick={() => navigate('/admin/dashboard/chat-screen')}>
        <Badge badgeContent={4} color="error">
          <MarkChatUnreadOutlined />
        </Badge>
      </IconButton>
    </Box>
  </Box>
  </div>
  );
};

export default DashboardHome;
