import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface ConfirmDeleteDialogProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  handleClose,
  handleConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='confirm-delete-dialog'
    >
      <DialogTitle id='confirm-delete-dialog'>Подтвердите удаление</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Вы уверены, что хотите удалить эту запись? Это действие невозможно
          отменить.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color='primary'
        >
          Отмена
        </Button>
        <Button
          onClick={handleConfirm}
          color='secondary'
          autoFocus
        >
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
