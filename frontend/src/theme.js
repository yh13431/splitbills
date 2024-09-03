import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', 
    primary: {
      main: '#4caf50', 
    },
    secondary: {
      main: '#ff5722', 
    },
    background: {
      default: '#f5f5f5', 
      paper: '#ffffff',  
    },
    text: {
      primary: '#333333', 
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#4caf50',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#388e3c',
          },
        },
        containedSecondary: {
          backgroundColor: '#ff5722',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#e64a19'
          },
        },
        outlinedPrimary: {
          borderColor: '#4caf50',
          color: '#4caf50',
          '&:hover': {
            borderColor: '#388e3c',
            color: '#388e3c',
          },
        },
        outlinedSecondary: {
          borderColor: '#ff5722',
          color: '#ff5722',
          '&:hover': {
            borderColor: '#e64a19',
            color: '#e64a19',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

export default theme;
