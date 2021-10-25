import { createTheme } from '@mui/material/styles';
import { green, purple, deepOrange, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
      main: deepOrange[100],
    },
    text: {
        main: grey[300],
        dark: grey[700],
    }
  },
  typography: {
    h1: {
        fontSize: '3rem'
    }
  }
});

export default theme
