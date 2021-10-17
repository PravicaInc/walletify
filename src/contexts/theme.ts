import React from 'react';
import DefaultTheme from '../themes/defaultTheme';

export const LIGHT = 'light';
export type light = typeof LIGHT;

export interface IThemeColors {
  primary: string;
  secondary: string;
  lines: string;
  inactive: string;
  cardsBackground: string;
  success: string;
  successLight: string;
  failure: string;
  failureLight: string;
  pending: string;
  pendingLight: string;
  text: string;
  contrast: string;
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
