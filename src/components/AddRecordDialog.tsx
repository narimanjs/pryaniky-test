import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRecord = async () => {
    try {
      await axios.post(
        "https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/create",
        formData,
        { headers: { "x-auth": token } }
      );
      onRecordAdded();
      handleClose(); // Закрыть модальное окно после успешного добавления
    } catch (error) {
      console.error("Ошибка при добавлении записи:", error);
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
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          color='primary'
        >
          Отмена
        </Button>
        <Button
          onClick={handleAddRecord}
          color='primary'
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecordDialog;
