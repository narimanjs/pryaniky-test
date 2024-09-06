import React, { useState, useEffect, useRef } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import axios from "axios";
import { HOST } from "../config";
import AddRecordDialog from "./AddRecordDialog";
import EditRecordDialog from "./EditRecordDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import CustomSnackbar from "./CustomSnackbar";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridApi } from "ag-grid-community";
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

  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null); // Храним ссылку на Grid API

  const [columnDefs] = useState<ColDef[]>([
    {
      field: "companySigDate",
      headerName: "Company Signature Date",
      width: 200,
    },
    {
      field: "companySignatureName",
      headerName: "Company Signature Name",
      width: 200,
    },
    { field: "documentName", headerName: "Document Name", width: 150 },
    { field: "documentStatus", headerName: "Document Status", width: 150 },
    { field: "documentType", headerName: "Document Type", width: 200 },
    { field: "employeeNumber", headerName: "Employee Number", width: 150 },
    {
      field: "employeeSigDate",
      headerName: "Employee Signature Date",
      width: 200,
    },
    {
      field: "employeeSignatureName",
      headerName: "Employee Signature Name",
      width: 150,
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
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!gridApi) return;

    const selectedNodes = gridApi.getSelectedNodes();
    const selectedIndex =
      selectedNodes.length > 0 ? selectedNodes[0].rowIndex : null;

    if (selectedIndex !== null) {
      // Проверка на null
      if (event.key === "ArrowDown") {
        const nextIndex = selectedIndex + 1;
        gridApi.setFocusedCell(nextIndex, "companySigDate");
        gridApi.getRowNode(`${nextIndex}`)?.setSelected(true);
      } else if (event.key === "ArrowUp") {
        const prevIndex = Math.max(0, selectedIndex - 1);
        gridApi.setFocusedCell(prevIndex, "companySigDate");
        gridApi.getRowNode(`${prevIndex}`)?.setSelected(true);
      } else if (event.key === "Escape") {
        gridApi.deselectAll();
        setSelectedRecord(null);
      }
    } else {
      if (event.key === "ArrowDown") {
        gridApi.setFocusedCell(0, "companySigDate");
        gridApi.getRowNode("0")?.setSelected(true);
      }
    }
  };

  return (
    <div
      className='ag-theme-alpine'
      style={{ height: 500, width: "100%" }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {loading && <CircularProgress />}
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
              disabled={!selectedRecord}
              sx={{ mr: 1 }}
              startIcon={<Edit />}
            >
              Редактировать
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={handleOpenDeleteDialog}
              disabled={!selectedRecord}
              startIcon={<Delete />}
            >
              Удалить
            </Button>
          </Box>

          <AgGridReact
            ref={gridRef}
            rowData={data}
            columnDefs={columnDefs}
            onRowClicked={handleRowClick}
            onGridReady={params => setGridApi(params.api)}
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
