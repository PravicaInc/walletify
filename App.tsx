import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Routes } from './src/screens/routes';
import { NavigationContainer } from '@react-navigation/native';
import { Theme, ThemeContext } from './src/contexts/theme';
import DefaultTheme from './src/themes/defaultTheme';

export default function App() {
  const [theme, setTheme] = useState<Theme>(DefaultTheme);
  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}
