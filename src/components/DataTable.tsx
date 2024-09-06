import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { HOST } from "../config";
import AddRecordDialog from "./AddRecordDialog";
import EditRecordDialog from "./EditRecordDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import CustomSnackbar from "./CustomSnackbar";

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

const DataTable = ({ token }: { token: string }) => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<TableData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Добавляем индекс выбранной строки
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${HOST}/ru/data/v3/testmethods/docs/userdocs/get`,
        {
          headers: { "x-auth": token },
        }
      );
      setData(response.data.data);
    } catch (err) {
      setError("Ошибка при получении данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleRowClick = (
    event: React.MouseEvent,
    record: TableData,
    index: number
  ) => {
    event.stopPropagation();
    setSelectedRecord(record);
    setSelectedIndex(index);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (data.length === 0) return;

    if (event.key === "ArrowDown") {
      setSelectedIndex(prevIndex => {
        const newIndex =
          prevIndex !== null ? Math.min(prevIndex + 1, data.length - 1) : 0;
        setSelectedRecord(data[newIndex]);
        return newIndex;
      });
    } else if (event.key === "ArrowUp") {
      setSelectedIndex(prevIndex => {
        const newIndex = prevIndex !== null ? Math.max(prevIndex - 1, 0) : 0;
        setSelectedRecord(data[newIndex]);
        return newIndex;
      });
    } else if (event.key === "Enter" && selectedIndex !== null) {
      setIsEditDialogOpen(true);
    } else if (event.key === "Escape") {
      setSelectedRecord(null);
      setSelectedIndex(null);
    }
  };

  const handleOpenDeleteDialog = () => {
    if (selectedRecord) {
      setIsConfirmDeleteDialogOpen(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsConfirmDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecord) return;

    try {
      await axios.post(
        `${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${selectedRecord.id}`,
        {},
        {
          headers: { "x-auth": token },
        }
      );
      setSnackbarMessage("Запись удалена успешно");
      setSnackbarOpen(true);
      fetchData();
    } catch (error) {
      setSnackbarMessage("Ошибка при удалении записи");
      setSnackbarOpen(true);
    } finally {
      handleCloseDeleteDialog();
      setSelectedRecord(null);
    }
  };

  const handleRecordUpdated = () => {
    setSnackbarMessage("Запись обновлена успешно");
    setSnackbarOpen(true);
    fetchData();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div
      onKeyDown={handleKeyDown} // Добавляем обработку клавиш
      tabIndex={0} // Чтобы элемент мог фокусироваться
      style={{ outline: "none" }}
    >
      {loading && <CircularProgress />}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <Box
            sx={{ mb: 2 }}
            onClick={e => e.stopPropagation()}
          >
            <Button
              variant='contained'
              color='primary'
              onClick={() => setIsAddDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Добавить запись
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => setIsEditDialogOpen(true)}
              disabled={!selectedRecord}
              sx={{ mr: 1 }}
            >
              Редактировать
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={handleOpenDeleteDialog}
              disabled={!selectedRecord}
            >
              Удалить
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Signature Date</TableCell>
                  <TableCell>Company Signature Name</TableCell>
                  <TableCell>Document Name</TableCell>
                  <TableCell>Document Status</TableCell>
                  <TableCell>Document Type</TableCell>
                  <TableCell>Employee Number</TableCell>
                  <TableCell>Employee Signature Date</TableCell>
                  <TableCell>Employee Signature Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={row.id}
                    onClick={event => handleRowClick(event, row, index)}
                    selected={selectedRecord?.id === row.id}
                    hover
                  >
                    <TableCell>{row.companySigDate}</TableCell>
                    <TableCell>{row.companySignatureName}</TableCell>
                    <TableCell>{row.documentName}</TableCell>
                    <TableCell>{row.documentStatus}</TableCell>
                    <TableCell>{row.documentType}</TableCell>
                    <TableCell>{row.employeeNumber}</TableCell>
                    <TableCell>{row.employeeSigDate}</TableCell>
                    <TableCell>{row.employeeSignatureName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <AddRecordDialog
        open={isAddDialogOpen}
        handleClose={() => setIsAddDialogOpen(false)}
        token={token}
        onRecordAdded={handleRecordUpdated}
      />

      <EditRecordDialog
        open={isEditDialogOpen}
        handleClose={() => setIsEditDialogOpen(false)}
        token={token}
        record={selectedRecord} // Передаем выбранную запись в диалог
        onRecordUpdated={handleRecordUpdated}
      />

      <ConfirmDeleteDialog
        open={isConfirmDeleteDialogOpen}
        handleClose={handleCloseDeleteDialog}
        handleConfirm={handleConfirmDelete}
      />

      <CustomSnackbar
        snackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
        handleCloseSnackbar={handleCloseSnackbar}
      />
    </div>
  );
};

export default DataTable;
