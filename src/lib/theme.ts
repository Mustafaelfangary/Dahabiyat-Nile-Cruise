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
      secondary: 'hsl(0, 0%, 0%)', // Changed to black for better contrast
    },
  },
  components: {
    // Fix Material-UI TextField labels and text
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#000000 !important',
            fontWeight: 600,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#0080ff !important',
          },
          '& .MuiOutlinedInput-root': {
            '& input': {
              color: '#000000 !important',
              fontWeight: 500,
            },
            '& textarea': {
              color: '#000000 !important',
              fontWeight: 500,
            },
          },
        },
      },
    },
    // Fix Material-UI FormControl labels
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#000000 !important',
            fontWeight: 600,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#0080ff !important',
          },
        },
      },
    },
    // Fix Material-UI Select components
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 500,
        },
      },
    },
    // Fix Material-UI MenuItem text
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 500,
        },
      },
    },
    // Fix Material-UI Typography
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 500,
        },
        h1: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h2: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h3: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h4: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h5: {
          color: '#000000 !important',
          fontWeight: 700,
        },
        h6: {
          color: '#000000 !important',
          fontWeight: 700,
        },
      },
    },
    // Fix Material-UI FormControlLabel
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#000000 !important',
          fontWeight: 600,
        },
      },
    },
    // Fix Material-UI TableCell
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 500,
        },
        head: {
          color: '#000000 !important',
          fontWeight: 700,
        },
      },
    },
    // Fix Material-UI Button text
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    // Fix Material-UI Chip text
    MuiChip: {
      styleOverrides: {
        label: {
          color: '#000000 !important',
          fontWeight: 600,
        },
      },
    },
    // Fix Material-UI Dialog components
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#ffffff !important',
          fontWeight: 700,
          backgroundColor: '#0080ff !important',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff !important',
          color: '#000000 !important',
        },
      },
    },
    // Fix Material-UI Tab components
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#000000 !important',
          fontWeight: 600,
          '&.Mui-selected': {
            color: '#0080ff !important',
            fontWeight: 700,
          },
        },
      },
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff !important',
          backgroundImage: 'none !important',
          opacity: '1 !important',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          '&:hover': {
            transform: 'none',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: '#0080ff !important',
          color: '#ffffff !important',
          opacity: '1 !important',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff !important',
          opacity: '1 !important',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.9) !important',
          backdropFilter: 'blur(8px) !important',
        },
      },
    },
  },
}); 