import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import Onboarding from '../screens/Onboarding';
import WalletSetup from '../screens/WalletSetup';
import SeedGeneration from '../screens/SeedGeneration';
import SeedConfirmation from '../screens/SeedConfirmation';
import CreatePassword from '../screens/CreatePassword';
import SeedRestore from '../screens/SeedRestore';
import OldPassword from '../screens/OldPassword';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export const Routes: React.FC = () => {
  return (
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
        name="Onboarding"
        component={Onboarding}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="WalletSetup"
        component={WalletSetup}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SeedGeneration"
        component={SeedGeneration}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SeedConfirmation"
        component={SeedConfirmation}
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
        name="OldPassword"
        component={OldPassword}
      />
    </Stack.Navigator>
  );
};

export default Routes;
