// App.tsx
import React, { useState } from "react";
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
import UserInfo from "./components/UserInfo"; // Импортируем новый компонент

const App = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [username, setUsername] = useState<string | null>(null); // Логин пользователя
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // Состояние для диалога

  const handleLogin = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername); // Сохраняем логин пользователя
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", newUsername); // Сохраняем логин в localStorage (если нужно)
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLogoutDialogOpen(false); // Закрываем диалог после выхода
  };

  const handleOpenLogoutDialog = () => {
    setLogoutDialogOpen(true); // Открыть диалог
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false); // Закрыть диалог без выхода
  };

  // Проверяем наличие токена и имени пользователя
  if (!token || !username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Container maxWidth='lg'>
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 8 }}
      >
        {/* Используем компонент UserInfo */}
        <UserInfo
          username={username}
          onLogout={handleOpenLogoutDialog}
        />{" "}
        {/* Открываем диалог при клике на "Выйти" */}
        <DataTable token={token} />
        {/* Диалог подтверждения выхода */}
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
