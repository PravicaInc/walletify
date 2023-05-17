import { Fonts } from '../assets/fonts';
import { Theme } from '../contexts/Theme/theme';

export const DefaultTheme: Theme = {
  id: 'light',
  fonts: {
    medium: Fonts.medium,
    regular: Fonts.regular,
    bold: Fonts.bold,
  },
  colors: {
    primary100: 'rgba(254, 191, 50, 1)',
    primary60: '#989898',
    primary40: '#989898',
    primary20: '#2A2D3C',
    primary10: 'rgba(254, 191, 50, 0.1)',
    primary5: 'rgba(254, 191, 50, 0.05)',
    primaryButtonClick: '#fac042',
    secondary100: '#FEBF32',
    gradient1: '#8CDCFF',
    gradient2: '#5EEF77',
    gradient3: '#FFB76A',
    secondary60: 'rgba(152, 152, 152, 0.6)',
    secondary40: 'rgba(152, 152, 152, 0.4)',
    secondary20: 'rgba(152, 152, 152, 0.2)',
    secondary10: 'rgba(152, 152, 152, 0.1)',
    secondary5: 'rgba(152, 152, 152, 0.05)',
    card: '#2A2D3C',
    confirm100: 'rgba(6, 180, 0, 1)',
    confirm10: 'rgba(6, 180, 0, 0.1)',
    failed100: 'rgba(255, 1, 1, 1)',
    failed10: 'rgba(255, 1, 1, 0.1)',
    warning100: 'rgba(255, 136, 0, 1)',
    warning10: 'rgba(255, 136, 0, 0.1)',
    darkgray: '#2A2D3C',
    switchBG: 'rgba(120, 120, 128, 0.16)',
    text: 'white',
    white: '#17161B',
  },
};

export default DefaultTheme;
