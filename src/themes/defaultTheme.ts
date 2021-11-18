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
    primary100: 'rgba(0, 0, 0, 1)',
    primary60: 'rgba(0, 0, 0, 0.6)',
    primary40: 'rgba(0, 0, 0, 0.4)',
    primary20: 'rgba(0, 0, 0, 0.2)',
    primary10: 'rgba(0, 0, 0, 0.1)',
    primary5: 'rgba(0, 0, 0, 0.05)',
    secondary100: 'rgba(85, 70, 255, 1)',
    secondary60: 'rgba(85, 70, 255, 0.6)',
    secondary40: 'rgba(85, 70, 255, 0.4)',
    secondary20: 'rgba(85, 70, 255, 0.2)',
    secondary10: 'rgba(85, 70, 255, 0.1)',
    secondary5: 'rgba(85, 70, 255, 0.05)',
    card: 'rgba(238, 238, 238, 0.6)',
    confirm100: 'rgba(6, 180, 0, 1)',
    confirm10: 'rgba(6, 180, 0, 0.1)',
    failed100: 'rgba(255, 1, 1, 1)',
    failed10: 'rgba(255, 1, 1, 0.1)',
    warning100: 'rgba(255, 136, 0, 1)',
    warning10: 'rgba(255, 136, 0, 0.1)',
    white: 'rgba(255, 255, 255, 1)',
  },
};

export default DefaultTheme;
