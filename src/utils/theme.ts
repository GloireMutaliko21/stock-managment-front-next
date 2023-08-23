import { red } from '@mui/material/colors';
import { frFR as coreFrFR } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';
import { frFR as dataGridFrFR } from '@mui/x-data-grid';
import { frFR } from '@mui/x-date-pickers/locales';

export const theme = (mode: 'light' | 'dark') =>
  createTheme(
    {
      palette: {
        mode,
        primary: {
          main: '#646FD4',
        },
        secondary: {
          main: red[400],
        },
        accent: {
          main: '#5B759F',
        },
        white: {
          main: '#fff',
        },
      },
      typography: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        h3: {
          fontWeight: 700,
        },
      },
    },
    frFR,
    dataGridFrFR,
    coreFrFR, 
    
  );

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    white: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    accent: true;
    white: true;
  }
}
