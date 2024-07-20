import React from 'react';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

export default function CustomSnackbar({ open, onClose, message, severity }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}