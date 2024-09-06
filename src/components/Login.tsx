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
  const [password, setPassword] = useState<string>("password");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateUsername = (username: string) => {
    const regex = /^user\d+$/; // Регулярное выражение для проверки формата user{N}
    return regex.test(username);
  };

  const handleLogin = async () => {
    if (!validateUsername(username)) {
      setError("Логин должен быть в формате user{N}, например user1");
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
            error={!!error}
            helperText={error && "Логин должен быть в формате user{N}"}
          />
          <TextField
            label='Password'
            variant='outlined'
            value={password}
            type='password'
            fullWidth
            margin='normal'
            disabled
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
            {loading ? <CircularProgress size={24} /> : "Войти"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
