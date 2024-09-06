import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import { HOST } from "../config";

interface AddRecordDialogProps {
  open: boolean;
  handleClose: () => void;
  token: string;
  onRecordAdded: () => void;
}

const AddRecordDialog: React.FC<AddRecordDialogProps> = ({
  open,
  handleClose,
  token,
  onRecordAdded,
}) => {
  const [formData, setFormData] = useState({
    companySigDate: "",
    companySignatureName: "",
    documentName: "",
    documentStatus: "",
    documentType: "",
    employeeNumber: "",
    employeeSigDate: "",
    employeeSignatureName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRecord = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${HOST}/ru/data/v3/testmethods/docs/userdocs/create`,
        formData,
        { headers: { "x-auth": token } }
      );
      onRecordAdded();
      handleClose(); // Закрыть модальное окно после успешного добавления
    } catch (err) {
      setError("Ошибка при добавлении записи. Попробуйте еще раз.");
      console.error("Ошибка при добавлении записи:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Добавить новую запись</DialogTitle>
      <DialogContent>
        <TextField
          label='Company Signature Date'
          type='date'
          name='companySigDate'
          value={formData.companySigDate}
          onChange={handleChange}
          fullWidth
          margin='dense'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label='Company Signature Name'
          name='companySignatureName'
          value={formData.companySignatureName}
          onChange={handleChange}
          fullWidth
          margin='dense'
        />
        <TextField
          label='Document Name'
          name='documentName'
          value={formData.documentName}
          onChange={handleChange}
          fullWidth
          margin='dense'
        />
        <TextField
          label='Document Status'
          name='documentStatus'
          value={formData.documentStatus}
          onChange={handleChange}
          fullWidth
          margin='dense'
        />
        <TextField
          label='Document Type'
          name='documentType'
          value={formData.documentType}
          onChange={handleChange}
          fullWidth
          margin='dense'
        />
        <TextField
          label='Employee Number'
          name='employeeNumber'
          value={formData.employeeNumber}
          onChange={handleChange}
          fullWidth
          margin='dense'
        />
        <TextField
          label='Employee Signature Date'
          type='date'
          name='employeeSigDate'
          value={formData.employeeSigDate}
          onChange={handleChange}
          fullWidth
          margin='dense'
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label='Employee Signature Name'
          name='employeeSignatureName'
          value={formData.employeeSignatureName}
          onChange={handleChange}
          fullWidth
          margin='dense'
        />
        {error && (
          <Typography
            color='error'
            variant='body2'
            sx={{ mt: 2 }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color='primary'
          disabled={loading}
        >
          Отмена
        </Button>
        <Button
          onClick={handleAddRecord}
          color='primary'
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Добавить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecordDialog;
