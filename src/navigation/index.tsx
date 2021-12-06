import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import OnBoarding from '../screens/OnBoarding';
import WalletSetup from '../screens/WalletSetup';
import ConfirmSeedPhrase from '../screens/ConfirmSeedPhrase';
import CreatePassword from '../screens/CreatePassword';
import SeedRestore from '../screens/SeedRestore';
import Settings from '../screens/Settings';
import ChangePassword from '../screens/ChangePassword';
import ShowSeedPhrase from '../screens/ShowSeedPhrase';
import RecoverSeedPhrase from '../screens/RecoverSeedPhrase';
import { RootStackParamList } from './types';
import WalletUnlock from '../screens/WalletUnlock';
import ManageAccounts from '../screens/ManageAccounts';
import { useStxPrice } from '../hooks/useStxPrice/useStxPrice';
import { useAuthenticationListener } from '../hooks/useAuthenticationListener/useAuthenticationListener';
import AuthenticationBottomSheet from '../components/AuthenticationBottomSheet';

const Stack = createStackNavigator<RootStackParamList>();

export const Routes: React.FC = () => {
  useStxPrice();
  useAuthenticationListener();
  return (
    <>
      <AuthenticationBottomSheet />
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Splash"
          component={Splash}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="OnBoarding"
          component={OnBoarding}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="WalletSetup"
          component={WalletSetup}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ConfirmSeedPhrase"
          component={ConfirmSeedPhrase}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="CreatePassword"
          component={CreatePassword}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SeedRestore"
          component={SeedRestore}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="WalletUnlock"
          component={WalletUnlock}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ChangePassword"
          component={ChangePassword}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ShowSeedPhrase"
          component={ShowSeedPhrase}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="RecoverSeedPhrase"
          component={RecoverSeedPhrase}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Settings"
          component={Settings}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ManageAccounts"
          component={ManageAccounts}
        />
      </Stack.Navigator>
    </>
  );
};

export default Routes;
