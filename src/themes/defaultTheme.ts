import { Fonts } from '../assets/fonts';
import { Theme } from '../contexts/theme';

export const DefaultTheme: Theme = {
  id: 'light',
  fonts: {
    medium: Fonts.medium,
    regular: Fonts.regular,
    bold: Fonts.bold,
  },
  colors: {
    primary: '#000',
    secondary: '#5546FF',
    lines: 'rgba(0, 0, 0, 0.1)',
    inactive: 'rgba(0, 0, 0, 0.4)',
    cardsBackground: 'rgba(238, 238, 238, 0.6)',
    success: '#06B400',
    successLight: 'rgba(6, 180, 0, 0.1)',
    failure: '#FF0101',
    failureLight: 'rgba(255, 1, 1, 0.1)',
    pending: '#FF8800',
    pendingLight: 'rgba(255, 136, 0, 0.1)',
    text: '#000000',
    contrast: '#fff',
  },
};

export default DefaultTheme;
