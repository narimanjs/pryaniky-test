import React, { useState, useEffect } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import { HOST } from "../config";
import AddRecordDialog from "./AddRecordDialog";
import EditRecordDialog from "./EditRecordDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import CustomSnackbar from "./CustomSnackbar";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [columnDefs] = useState<ColDef[]>([
    {
      field: "companySigDate",
      headerName: "Company Signature Date",
      width: 200,
      filter: "agDateColumnFilter",
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "companySignatureName",
      headerName: "Company Signature Name",
      width: 200,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "documentName",
      headerName: "Document Name",
      width: 150,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "documentStatus",
      headerName: "Document Status",
      width: 150,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "documentType",
      headerName: "Document Type",
      width: 200,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "employeeNumber",
      headerName: "Employee Number",
      width: 130,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "employeeSigDate",
      headerName: "Employee Signature Date",
      width: 200,
      filter: "agDateColumnFilter",
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "employeeSignatureName",
      headerName: "Employee Signature Name",
      width: 150,
      filter: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ]);

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

  const handleRowClick = (params: any) => {
    setSelectedRecord(params.data);
  };

  const handleOpenDeleteDialog = () => {
    if (selectedRecord) {
      setIsConfirmDeleteDialogOpen(true);
    }
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
      setIsConfirmDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  const handleRecordUpdated = () => {
    setSnackbarMessage("Запись обновлена успешно");
    setSnackbarOpen(true);
    fetchData();
    setSelectedRecord(null); // Сброс выбранной строки после обновления
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div
      className='ag-theme-alpine'
      style={{ height: 500, width: "100%" }}
    >
      {loading && (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          height='100%'
        >
          <CircularProgress
            size={60}
            thickness={4.5}
          />
        </Box>
      )}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <Box sx={{ mb: 2 }}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setIsAddDialogOpen(true)}
              sx={{ mr: 1 }}
              startIcon={<Add />}
            >
              Добавить запись
            </Button>
            <Button
              variant='contained'
              color='info'
              onClick={() => setIsEditDialogOpen(true)}
              disabled={!selectedRecord} // Кнопка неактивна, если не выбрана запись
              sx={{ mr: 1 }}
              startIcon={<Edit />}
            >
              Редактировать
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={handleOpenDeleteDialog}
              disabled={!selectedRecord} // Кнопка неактивна, если не выбрана запись
              startIcon={<Delete />}
            >
              Удалить
            </Button>
          </Box>

          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            onRowClicked={handleRowClick}
            rowSelection='single'
            domLayout='autoHeight'
          />

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
            record={selectedRecord}
            onRecordUpdated={handleRecordUpdated}
          />

          <ConfirmDeleteDialog
            open={isConfirmDeleteDialogOpen}
            handleClose={() => setIsConfirmDeleteDialogOpen(false)}
            handleConfirm={handleConfirmDelete}
          />

          <CustomSnackbar
            snackbarOpen={snackbarOpen}
            snackbarMessage={snackbarMessage}
            handleCloseSnackbar={handleCloseSnackbar}
          />
        </>
      )}
    </div>
  );
};

export default DataTable;
