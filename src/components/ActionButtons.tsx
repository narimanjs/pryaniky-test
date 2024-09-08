import React from "react";
import { Button, Box } from "@mui/material";
import { Add, Delete, Edit, Refresh } from "@mui/icons-material";

interface ActionButtonsProps {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
  isRecordSelected: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  isRecordSelected,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant='contained'
        color='primary'
        onClick={onAdd}
        sx={{ mr: 1 }}
        startIcon={<Add />}
      >
        Добавить запись
      </Button>
      <Button
        variant='contained'
        color='info'
        onClick={onEdit}
        disabled={!isRecordSelected}
        sx={{ mr: 1 }}
        startIcon={<Edit />}
      >
        Редактировать
      </Button>
      <Button
        variant='contained'
        color='primary'
        onClick={onRefresh}
        sx={{ mr: 1 }}
        startIcon={<Refresh />}
      >
        Обновить
      </Button>
      <Button
        variant='contained'
        color='error'
        onClick={onDelete}
        disabled={!isRecordSelected}
        startIcon={<Delete />}
      >
        Удалить
      </Button>
    </Box>
  );
};

export default ActionButtons;
