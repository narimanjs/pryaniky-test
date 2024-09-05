import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Login from "./components/Login";
import DataTable from "./components/DataTable";

const App = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setLogoutDialogOpen(false);
  };

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Container maxWidth='lg'>
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 8 }}
      >
        <Box textAlign='center'>
          <Typography
            variant='h4'
            mb={2}
          >
            Добро пожаловать!
          </Typography>
          <Button
            variant='contained'
            color='secondary'
            onClick={handleLogoutDialogOpen}
            sx={{ my: 2, mx: 4 }}
          >
            Выйти
          </Button>
        </Box>
        <DataTable token={token} />

        <Dialog
          open={logoutDialogOpen}
          onClose={handleLogoutDialogClose}
          aria-labelledby='logout-dialog-title'
        >
          <DialogTitle id='logout-dialog-title'>
            Подтверждение выхода
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы действительно хотите выйти?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleLogoutDialogClose}
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
