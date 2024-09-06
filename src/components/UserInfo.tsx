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
      alignItems='flex-end'
      justifyContent='flex-end'
      sx={{ mb: 3 }}
    >
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        sx={{ mb: 2 }}
      >
        <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 30, height: 30 }}>
          <AccountCircleIcon fontSize='small' />
        </Avatar>

        <Typography
          variant='h5'
          fontWeight='bold'
        >
          {username}
        </Typography>
      </Box>

      <Button
        variant='outlined'
        color='error'
        onClick={onLogout}
        startIcon={<LogoutIcon />}
        sx={{ fontSize: "1rem", width: "132px" }}
      >
        Выйти
      </Button>
    </Box>
  );
};

export default UserInfo;
