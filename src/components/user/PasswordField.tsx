import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";

interface PasswordFieldProps {
  passwordRef: React.RefObject<HTMLInputElement>;
  id?: string;
  label?: string;
}
const PasswordField: React.FC<PasswordFieldProps> = ({
  passwordRef,
  id = "password",
  label = "Password",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClick = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  return (
    <TextField
      margin="normal"
      variant="standard"
      id={id}
      label={label}
      type={showPassword ? "text" : "password"}
      fullWidth
      inputRef={passwordRef}
      inputProps={{ minLength: 2 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClick} onMouseDown={handleMouseDown}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
