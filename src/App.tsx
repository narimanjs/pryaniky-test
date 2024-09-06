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
} from "@mui/material";
import Login from "./components/Login";
import DataTable from "./components/DataTable";
import UserInfo from "./components/UserInfo"; // Импортируем компонент

const App = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  ); // Инициализируем токен из localStorage
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  ); // Инициализируем username из localStorage
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // Состояние для диалога

  // Обработчик успешного логина
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

  if (!token || !username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Container maxWidth='lg'>
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 8 }}
      >
        <UserInfo
          username={username}
          onLogout={handleOpenLogoutDialog}
        />

        <DataTable token={token} />

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
              color='secondary'
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
