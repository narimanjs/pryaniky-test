import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarProps {
  snackbarOpen: boolean; // Открытое ли уведомление
  snackbarMessage: string; // Сообщение для показа
  handleCloseSnackbar: () => void; // Функция для закрытия уведомления
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
