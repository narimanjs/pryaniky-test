import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import Login from "./components/Login";
import DataTable from "./components/DataTable";
import UserInfo from "./components/UserInfo";
import ActionButtons from "./components/ActionButtons";
import AddRecordDialog from "./components/AddRecordDialog";
import EditRecordDialog from "./components/EditRecordDialog";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import CustomSnackbar from "./components/CustomSnackbar";
import { HOST } from "./config";

const App = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
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
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
      setSelectedRecord(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleLogin = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLogoutDialogOpen(false);
  };

  const handleOpenLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleAddRecord = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditRecord = () => {
    if (selectedRecord) {
      setIsEditDialogOpen(true);
    }
  };

  const handleDeleteRecord = () => {
    if (selectedRecord) {
      setIsConfirmDeleteDialogOpen(true);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecord) return;

    setLoading(true);
    try {
      await axios.post(
        `${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${selectedRecord.id}`,
        {},
        {
          headers: { "x-auth": token },
        }
      );
      setSnackbarMessage("Запись удалена успешно");
      fetchData();
    } catch (error) {
      setSnackbarMessage("Ошибка при удалении записи");
    } finally {
      setIsConfirmDeleteDialogOpen(false);
      setSelectedRecord(null);
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleRecordAdded = () => {
    setSnackbarMessage("Запись добавлена успешно");
    setSnackbarOpen(true);
    fetchData();
    setIsAddDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleRecordUpdated = () => {
    setSnackbarMessage("Запись обновлена успешно");
    setSnackbarOpen(true);
    fetchData();
    setIsEditDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!token || !username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Container maxWidth='xl'>
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 8 }}
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='flex-end'
          sx={{ mb: 3 }}
        >
          <Box
            display='flex'
            justifyContent='flex-end'
          >
            <ActionButtons
              onAdd={handleAddRecord}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
              onRefresh={handleRefresh}
              isRecordSelected={!!selectedRecord}
            />
          </Box>
          <Box
            display='flex'
            justifyContent='flex-end'
          >
            <UserInfo
              username={username}
              onLogout={handleOpenLogoutDialog}
            />
          </Box>
        </Box>

        <DataTable
          token={token}
          data={data}
          setData={setData}
          selectedRecord={selectedRecord}
          setSelectedRecord={setSelectedRecord}
          loading={loading}
          setLoading={setLoading}
          error={error}
        />

        <AddRecordDialog
          open={isAddDialogOpen}
          handleClose={() => setIsAddDialogOpen(false)}
          token={token}
          onRecordAdded={handleRecordAdded}
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

        <Dialog
          open={logoutDialogOpen}
          onClose={handleCloseLogoutDialog}
          aria-labelledby='logout-dialog-title'
          aria-describedby='logout-dialog-description'
        >
          <DialogTitle id='logout-dialog-title'>
            Подтверждение выхода
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='logout-dialog-description'>
              Вы уверены, что хотите выйти из системы?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseLogoutDialog}
              color='primary'
            >
              Отмена
            </Button>
            <Button
              onClick={handleLogout}
              color='error'
              autoFocus
            >
              Выйти
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default App;
