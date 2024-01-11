import { Avatar, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateRoomDetails } from "../../../../../store/slices/adminSlices/adminRoomSlice";
import pendingIcon from "../../hotels/icons/progress4.gif";

interface InfoFieldsProps {
  mainProps: {};
  optionalProps?: {
    children?: React.ReactNode;
    type?: string;
  };
  minLength: number;
}

const RoomInfoFields: React.FC<InfoFieldsProps> = ({
  mainProps,
  optionalProps = {},
  minLength,
}) => {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  let timer: number | any;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateRoomDetails({ [e.target.name]: e.target.value }));
    if (!editing) setEditing(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      setEditing(false);
      if (e.target.value.length < minLength) {
        if (!error) setError(true);
        if (success) setSuccess(false);
      } else {
        if (error) setError(false);
        if (!success) setSuccess(true);
      }
    }, 1500);
  };

  return (
    <TextField
      {...mainProps}
      {...optionalProps}
      error={error}
      helperText={
        error && minLength > 0
          ? `This field must be contain ${minLength} values.`
          : error && minLength === 0
          ? "This field is required"
          : ""
      }
      color={success ? "success" : "primary"}
      variant="outlined"
      onChange={handleChange}
      required
      onFocus={(e) =>
        e.target.addEventListener(
          "wheel",
          function (e) {
            e.preventDefault();
          },
          { passive: false }
        )
      }
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {editing && (
              <Avatar src={pendingIcon} sx={{ width: 50, height: 25 }} />
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default RoomInfoFields;
