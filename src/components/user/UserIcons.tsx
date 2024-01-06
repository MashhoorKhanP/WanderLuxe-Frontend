import React, { useState } from "react";
import { Avatar, Badge, Box, IconButton, Tooltip } from "@mui/material";
import { FavoriteBorder } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/types";
import UserMenu from "./UserMenu";
import useCheckToken from "../hooks/useCheckToken";
import { useNavigate } from "react-router-dom";
import { getUpdatedUser } from "../../actions/user";
import { AppDispatch } from "../../store/store";

const UserIcons: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [anchorUserMenu, setAnchorUserMenu] = useState<HTMLElement | null>(
    null
  );

  const handleOpenWishlist = () => {
    navigate("/wishlist");
  };
  return (
    <Box>
      <Tooltip title="Wishlist">
        <IconButton size="large" color="inherit" onClick={handleOpenWishlist}>
          <Badge color="error" badgeContent={currentUser?.wishlist?.length}>
            <FavoriteBorder
              sx={{ display: { color: "#000000", fontSize: 26 } }}
            />
          </Badge>
        </IconButton>
      </Tooltip>

      <Tooltip title="User Profile">
        <IconButton onClick={(e) => {
    setAnchorUserMenu(e.currentTarget);
    dispatch(getUpdatedUser(currentUser?._id as string));
    }}>
          <Avatar
            style={{ backgroundColor: "#868686" }}
            src={
              currentUser?.message?.profileImage || currentUser?.profileImage
            }
            alt={currentUser?.message?.firstName || currentUser?.firstName}
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
