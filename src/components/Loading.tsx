import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/types";

const Loading: React.FC = () => {
  const loading = useSelector(
    (state: RootState) =>
      state.user.loading === true ||
      state.admin.adminLoading === true ||
      state.room.loading === true
  );

  return (
    <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
