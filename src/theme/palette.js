import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#ECE5FD',
  light: '#C0AEF3',
  main: '#8973D9',
  dark: '#4A399C',
  darker: '#201668',
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#FFF5D6',
  light: '#FFD884',
  main: '#FFAF33',
  dark: '#B76D19',
  darker: '#7A3C09',
  contrastText: '#FFFFFF',
};

const INFO = {
  lighter: '#E3F1FF',
  light: '#ACD0FF',
  main: '#75A7FF',
  dark: '#3A5EB7',
  darker: '#162B7A',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#E6FDDC',
  light: '#A0F396',
  main: '#4ED857',
  dark: '#279B43',
  darker: '#0E6734',
  contrastText: '#FFFFFF',
};

const WARNING = {
  lighter: '#FDFAD0',
  light: '#F8EC73',
  main: '#EAD219',
  dark: '#A8920C',
  darker: '#705E04',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFEFD9',
  light: '#FFC08D',
  main: '#FF7E42',
  dark: '#B73D21',
  darker: '#7A120C',
  contrastText: '#FFFFFF',
};

const COMMON = {
  common: { black: '#000000', white: '#FFFFFF' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default function palette(themeMode) {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: { paper: '#FFFFFF', default: '#FFFFFF', neutral: GREY[200] },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: GREY[500],
      disabled: GREY[600],
    },
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.16),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  };

  return themeMode === 'light' ? light : dark;
}
