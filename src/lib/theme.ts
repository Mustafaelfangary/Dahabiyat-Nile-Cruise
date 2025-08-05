'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(200, 100%, 50%)', // Ocean Blue
      dark: 'hsl(200, 100%, 40%)',
      light: 'hsl(200, 100%, 60%)',
      contrastText: 'hsl(0, 0%, 100%)',
    },
    secondary: {
      main: 'hsl(240, 100%, 50%)', // Blue
      dark: 'hsl(240, 100%, 40%)',
      light: 'hsl(240, 100%, 60%)',
      contrastText: 'hsl(0, 0%, 100%)',
    },
    background: {
      default: 'hsl(0, 0%, 100%)', // White
      paper: 'hsl(0, 0%, 100%)',
    },
    text: {
      primary: 'hsl(0, 0%, 0%)', // Black
      secondary: 'hsl(220, 20%, 45%)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    h3: {
      fontFamily: '"Playfair Display", "Times New Roman", serif',
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.75rem',
          fontWeight: 600,
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, hsl(200, 100%, 50%) 0%, hsl(220, 100%, 60%) 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, hsl(200, 100%, 40%) 0%, hsl(220, 100%, 50%) 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'hsl(200, 100%, 50%, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 16px rgba(210, 85%, 25%, 0.2)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
}); 