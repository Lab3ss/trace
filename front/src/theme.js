import { createTheme } from '@mui/material/styles';
import { green, purple, deepOrange, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      ligth: '#ffdfc8',
      main: '#ff9800',
      dark: '#e65100',
    },
    secondary: {
      dark: '#282c34',
      main: '#84868A',
      ligth: '#e0e0e0',
    },
    info: {
        main: grey[300],
    },
    text: {
        main: grey[300],
        dark: grey[700],
    }
  },
  typography: {
    h1: {
        fontSize: '3rem',
        fontFamily: 'IBM Plex Sans, sans-serif',
    },
    h6: {
        fontSize: '1.2rem',
        fontFamily: 'IBM Plex Sans, sans-serif',
    },
    caption: {
        fontFamily: 'IBM Plex Sans, sans-serif',
    }
  }
});

export default theme
