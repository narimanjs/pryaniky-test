import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { HOST } from "../config";

interface TableData {
  id: string;
  companySigDate: string;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: string;
  employeeSigDate: string;
  employeeSignatureName: string;
}

interface EditRecordDialogProps {
  open: boolean;
  handleClose: () => void;
  token: string;
  record: TableData | null;
  onRecordUpdated: () => void;
}

const EditRecordDialog: React.FC<EditRecordDialogProps> = ({
  open,
  handleClose,
  token,
  record,
  onRecordUpdated,
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

  useEffect(() => {
    if (record) {
      setFormData({
        companySigDate: record.companySigDate.split(".")[0], // Убираем миллисекунды
        companySignatureName: record.companySignatureName,
        documentName: record.documentName,
        documentStatus: record.documentStatus,
        documentType: record.documentType,
        employeeNumber: record.employeeNumber,
        employeeSigDate: record.employeeSigDate.split(".")[0], // Убираем миллисекунды
        employeeSignatureName: record.employeeSignatureName,
      });
    }
  }, [record]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Преобразование дат в формат ISO перед отправкой
  const formatToISOString = (date: string) => {
    return new Date(date).toISOString();
  };

  const handleUpdateRecord = async () => {
    if (!record?.id) {
      console.error("ID записи отсутствует:", record);
      return;
    }

    const updatedData = {
      ...formData,
      companySigDate: formatToISOString(formData.companySigDate),
      employeeSigDate: formatToISOString(formData.employeeSigDate),
    };

    try {
      const response = await axios.post(
        `${HOST}/ru/data/v3/testmethods/docs/userdocs/set/${record.id}`,
        updatedData,
        { headers: { "x-auth": token } }
      );

      if (response.data.error_code === 0) {
        onRecordUpdated();
        handleClose();
      } else {
        console.error("Ошибка на сервере:", response.data);
      }
    } catch (error) {
      console.error("Ошибка при обновлении записи:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Редактировать запись</DialogTitle>
      <DialogContent>
        <TextField
          label='Company Signature Date'
          type='datetime-local' // Изменено на datetime-local для выбора даты и времени
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
          type='datetime-local' // Изменено на datetime-local для выбора даты и времени
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
          onClick={handleUpdateRecord}
          color='primary'
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRecordDialog;
