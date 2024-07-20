import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#98FF98', 
    },
    secondary: {
      main: '#A0DAA9',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.1rem',
    },
    body2: {
      fontSize: '0.9rem',
    },
  },
});

export default theme;
