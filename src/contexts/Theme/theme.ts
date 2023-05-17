import React from 'react';
import DefaultTheme from '../../themes/defaultTheme';

export const LIGHT = 'light';
export type light = typeof LIGHT;

export interface IThemeColors {
  primary100: string;
  primary60: string;
  primary40: string;
  primary20: string;
  primary10: string;
  primary5: string;
  primaryButtonClick: string;
  secondary100: string;
  secondary60: string;
  secondary40: string;
  secondary20: string;
  secondary10: string;
  secondary5: string;
  card: string;
  confirm100: string;
  confirm10: string;
  failed100: string;
  failed10: string;
  warning100: string;
  warning10: string;
  switchBG: string;
  text: string;
  gradient1: string;
  gradient2: string;
  gradient3: string;
  darkgray: string;
  white: string;
}

export interface Theme {
  id: light;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  colors: IThemeColors;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: DefaultTheme,
  setTheme: () => null,
});
