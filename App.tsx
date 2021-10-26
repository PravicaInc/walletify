import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Routes } from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { Theme, ThemeContext } from './src/contexts/theme';
import DefaultTheme from './src/themes/defaultTheme';
import { StoresProvider } from './src/components/providers/storeProvider';
import SecureKeychain from './src/core/SecureKeychain';

export default function App() {
  const [theme, setTheme] = useState<Theme>(DefaultTheme);
  SecureKeychain.init('WiseApp.id');
  return (
    <SafeAreaProvider>
      <StoresProvider>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </ThemeContext.Provider>
      </StoresProvider>
    </SafeAreaProvider>
  );
}
