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
import CreateSeedPhrase from '../screens/CreateSeedPhrase';
import RecoverSeedPhrase from '../screens/RecoverSeedPhrase';
import { RootStackParamList } from './types';
import ManageAccounts from '../screens/ManageAccounts';
import { useStxPrice } from '../hooks/useStxPrice/useStxPrice';
import { useAuthenticationListener } from '../hooks/useLinkingListener/useAuthenticationListener';
import AuthenticationBottomSheet from '../components/AuthenticationBottomSheet';
import { useTransactionRequestListener } from '../hooks/useLinkingListener/useTransactionRequestsListener';
import TransactionRequestBottomSheet from '../components/TransactionRequestBottomSheet';
import { useInternetConnection } from '../hooks/useInternetConnnection';
import EnterPassword from '../screens/EnterPassword';
import SendScreen from '../screens/Send';

const Stack = createStackNavigator<RootStackParamList>();

export const Routes: React.FC = () => {
  useStxPrice();
  useInternetConnection();
  useAuthenticationListener();
  useTransactionRequestListener();
  return (
    <>
      <AuthenticationBottomSheet />
      <TransactionRequestBottomSheet />
      <Stack.Navigator initialRouteName="Splash" headerMode="none">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="EnterPassword" component={EnterPassword} />
        <Stack.Screen name="SendScreen" component={SendScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="WalletSetup" component={WalletSetup} />
        <Stack.Screen name="ConfirmSeedPhrase" component={ConfirmSeedPhrase} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
        <Stack.Screen name="SeedRestore" component={SeedRestore} />
        <Stack.Screen name="CreateSeedPhrase" component={CreateSeedPhrase} />
        <Stack.Screen name="RecoverSeedPhrase" component={RecoverSeedPhrase} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="ManageAccounts" component={ManageAccounts} />
      </Stack.Navigator>
    </>
  );
};

export default Routes;
