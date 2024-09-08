import { Box, Typography, Button, Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface UserInfoProps {
  username: string;
  onLogout: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ username, onLogout }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      sx={{
        mb: 3,
        p: 2,
        border: "1px solid rgba(0, 255, 255, 0.6)",
        borderRadius: "8px",
        maxWidth: 250,
      }}
    >
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        sx={{ mb: 1 }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            mr: 1,
            width: 50,
            height: 50,
            border: "3px solid rgba(0, 255, 255, 0.8)",
            boxShadow: "0 4px 15px rgba(0, 255, 255, 0.6)",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              border: "2px solid rgba(0, 255, 255, 0.4)",
            },
          }}
        >
          <AccountCircleIcon fontSize='medium' />
        </Avatar>

        <Typography
          variant='h5'
          fontWeight='bold'
          textAlign='center'
        >
          {username}
        </Typography>
      </Box>

      <Button
        variant='outlined'
        color='error'
        onClick={onLogout}
        startIcon={<LogoutIcon />}
        sx={{
          fontSize: "1rem",
          width: "132px",
          mt: 2,
        }}
      >
        Выйти
      </Button>
    </Box>
  );
};

export default UserInfo;
