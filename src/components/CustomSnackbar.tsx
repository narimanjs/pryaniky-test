import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarProps {
  snackbarOpen: boolean;
  snackbarMessage: string;
  handleCloseSnackbar: () => void;
}

const CustomSnackbar: React.FC<SnackbarProps> = ({
  snackbarOpen,
  snackbarMessage,
  handleCloseSnackbar,
}) => {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleCloseSnackbar}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity='success'
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
