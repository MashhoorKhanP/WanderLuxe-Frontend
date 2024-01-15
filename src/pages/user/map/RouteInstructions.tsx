import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Modal,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface RouteInstructionProps {
  routeInstructions: string[];
}

const RouteInstructions: React.FC<RouteInstructionProps> = ({
  routeInstructions,
}) => {
  const [smallOpen, setSmallOpen] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSmallOpen(true);
  }, [routeInstructions]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSmallClose = () => {
    setSmallOpen(false);
  };

  return (
    <>
      {routeInstructions.length && smallOpen ? (
        <Box
          style={{
            position: "absolute",
            top: 200,
            left: 10,
            zIndex: 1,
            width: "400px  !important",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              marginLeft: "80%", // Adjust the percentage as needed
              mt: "10px",
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleSmallClose}
          >
            <Close />
          </IconButton>
          <Paper
            elevation={5}
            style={{
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              width: "400px",
              overflow: "hidden",
              maxHeight: "160px", // Set the maximum height for the container
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Set the maximum height for the container
            }}
          >
            <Typography variant="h6" gutterBottom>
              Route Instructions
            </Typography>
            <ol
              style={{
                margin: 0,
                paddingInlineStart: "20px",
                fontSize: "14px",
                overflowY: "hidden",
              }}
            >
              {routeInstructions.map((instruction, index) => (
                <li key={index}>{`${index + 1}. ${instruction}`}</li>
              ))}
            </ol>
            <Button
              onClick={handleOpen}
              variant="outlined"
              size="small"
              style={{ marginTop: "10px" }}
            >
              View Full Instructions
            </Button>
          </Paper>
        </Box>
      ) : (
        ""
      )}

      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Full Route Instructions
          </Typography>
          <ol
            style={{ margin: 0, paddingInlineStart: "20px", fontSize: "14px" }}
          >
            {routeInstructions.map((instruction, index) => (
              <li key={index}>{`${index + 1}. ${instruction}`}</li>
            ))}
          </ol>
        </Box>
      </Modal>
    </>
  );
};

export default RouteInstructions;
