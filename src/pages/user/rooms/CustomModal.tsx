import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirmationText: string;
  onConfirm: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  confirmationText,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <Typography>{confirmationText}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
