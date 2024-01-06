import React, { useEffect } from "react";
import AddImages from "../hotels/addImages/AddImages";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface BannersProps {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>;
  link: string;
}

const Banners: React.FC<BannersProps> = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  const navigate = useNavigate();
  
  return (
    <Container>
      <Box display="flex" alignItems="center" padding={2} flexDirection="row">
      <IconButton onClick={() => navigate(-1)}>
          <ArrowBack/>
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Manage Banners
        </Typography>
      </Box>
    <AddImages/>
    </Container>
  )
};

export default Banners;
