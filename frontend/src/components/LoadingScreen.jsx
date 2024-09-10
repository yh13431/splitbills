import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1300,
      }}
    >
      <Box textAlign="center">
        <CircularProgress color="inherit" />
        <Typography variant="h6" color="white" sx={{ mt: 2 }}>
          Processing...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
