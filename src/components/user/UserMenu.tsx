import React from "react";
import { Logout, ManageAccounts } from "@mui/icons-material";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import {
  logoutUser,
  updateUserProfile,
} from "../../store/slices/userSlices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import useCheckToken from "../hooks/useCheckToken";
import { RootState } from "../../store/types";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  anchorUserMenu: HTMLElement | null;
  setAnchorUserMenu: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

interface ProfileOpen {
  open?: boolean;
  file?: File | null | undefined;
  profileImage?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({
  anchorUserMenu,
  setAnchorUserMenu,
}) => {
  const checkToken = useCheckToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleCloseUserMenu = () => {
    setAnchorUserMenu(null);
  };

  const handleLogout = () => {
    navigate("/user/home");
    dispatch(logoutUser());
  };

  const handleOpenProfile = () => {
    const profileUpdate: Partial<ProfileOpen> = {
      open: true,
      file: null,
      profileImage: currentUser?.profileImage,
    };
    navigate("/user/profile");
    console.log("...Current User", { ...currentUser }, "...ProfileUpdate", {
      ...profileUpdate,
    });
    dispatch(updateUserProfile({ ...currentUser?.message, ...profileUpdate }));
  };
  checkToken;
  return (
    <>
      <Menu
        anchorEl={anchorUserMenu}
        open={Boolean(anchorUserMenu)}
        onClose={handleCloseUserMenu}
        onClick={handleCloseUserMenu}
      >
        <MenuItem onClick={handleOpenProfile}>
          <ListItemIcon>
            <ManageAccounts fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Profile />
    </>
  );
};

export default UserMenu;
