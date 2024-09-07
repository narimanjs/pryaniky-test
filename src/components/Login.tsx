import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";
import { HOST } from "../config";

interface LoginProps {
  onLogin: (token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempted, setLoginAttempted] = useState<boolean>(false);

  // Валидация логина
  const validateUsername = (username: string) => {
    const regex = /^user\d+$/;
    return regex.test(username);
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Пароль должен содержать минимум 6 символов";
    }
    if (password !== "password") {
      return "Неверный пароль. Введите 'password'.";
    }
    return null;
  };

  const handleLogin = async () => {
    setLoginAttempted(true);

    // Проверка логина
    if (!validateUsername(username)) {
      setError("Логин должен быть в формате user{N}, например user1");
      return;
    }

    // Проверка пароля
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${HOST}/ru/data/v3/testmethods/docs/login`,
        {
          username,
          password,
        }
      );
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      onLogin(token, username);
    } catch (err) {
      setError("Ошибка авторизации. Проверьте логин и пароль.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Container maxWidth='sm'>
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 8 }}
      >
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          onKeyDown={handleKeyDown}
        >
          <Typography
            variant='h4'
            mb={2}
          >
            Авторизация
          </Typography>
          <TextField
            label='Username'
            variant='outlined'
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin='normal'
            error={!!error && !validateUsername(username)}
            helperText={
              error && !validateUsername(username)
                ? "Логин должен быть в формате user{N}"
                : ""
            }
          />
          <TextField
            label='Password'
            variant='outlined'
            value={password}
            type='password'
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin='normal'
            error={loginAttempted && !!validatePassword(password)}
            helperText={loginAttempted && validatePassword(password)}
          />
          {error && <Typography color='error'>{error}</Typography>}
          <Button
            variant='contained'
            color='primary'
            onClick={handleLogin}
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "primary.main",
                }}
              />
            ) : (
              "Войти"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
