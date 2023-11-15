import React, { useState } from "react";
import { Avatar, Badge, Box, IconButton, Tooltip } from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/types";
import UserMenu from "./UserMenu";

const UserIcons: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [anchorUserMenu, setAnchorUserMenu] = useState<HTMLElement | null>(
    null
  );
  return (
    <Box>
      <IconButton size="large" color="inherit">
        <Badge color="error" badgeContent={15}>
          <FavoriteBorder
            sx={{ display: { color: "#000000", fontSize: 26 } }}
          />
        </Badge>
      </IconButton>
      <Tooltip title="User Profile">
        <IconButton onClick={(e) => setAnchorUserMenu(e.currentTarget)}>
          <Avatar
            src={currentUser?.profileImage}
            alt={currentUser?.firstName}
            sx={{
              width: 32,
              height: 32,
            }}
          >
            {currentUser?.firstName?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <UserMenu
        anchorUserMenu={anchorUserMenu}
        setAnchorUserMenu={setAnchorUserMenu}
      />
    </Box>
  );
};

export default UserIcons;
