import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64d2ff'
    },
    secondary: {
      main: '#f6c177'
    },
    background: {
      default: '#101418',
      paper: '#171d23'
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '1.35rem',
      fontWeight: 700
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained'
      }
    }
  }
});
