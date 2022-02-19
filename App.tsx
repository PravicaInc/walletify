import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Routes } from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { Theme, ThemeContext } from './src/contexts/Theme/theme';
import DefaultTheme from './src/themes/defaultTheme';
import UserPreference from './src/contexts/UserPreference/userPreference';
import { PortalProvider } from '@gorhom/portal';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/Toast/ToastConfig';

export default function App() {
  const [theme, setTheme] = useState<Theme>(DefaultTheme);

  useEffect(() => {
    Sentry.init({
      dsn: Config.SENTRY_DSN_URL,
      tracesSampleRate: 1.0,
    });
  }, []);

  return (
    <UserPreference>
      <SafeAreaProvider>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <PortalProvider>
            <NavigationContainer>
              <BottomSheetModalProvider>
                <Routes />
              </BottomSheetModalProvider>
              <Toast
                config={toastConfig(theme.colors)}
                ref={ref => Toast.setRef(ref)}
              />
            </NavigationContainer>
          </PortalProvider>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </UserPreference>
  );
}
