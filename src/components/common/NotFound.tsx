import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px",
        }}
      >
        <Typography variant="h5" fontWeight="bold" display="flex" padding={2}>
          Page not found!
        </Typography>
        <img
          src={import.meta.env.VITE_NOTFOUND_404}
          style={{ borderRadius: "15px", width: "100%", maxWidth: "360px" }}
          alt="Empty wishlist..."
        />
        <Stack
          direction="row"
          width="100%"
          spacing={2}
          justifyContent="center"
          paddingTop={4}
          paddingBottom={2}
        >
          <Button
            variant="outlined"
            className="book_room_btn"
            sx={{ width: "20%", p: 1, borderRadius: 0 }}
            color="inherit"
            onClick={() => navigate(-1)}
          >
            <span>Go Back</span>
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default PageNotFound;
