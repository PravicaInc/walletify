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
import AuthenticationBottomSheet, {
  WrappedAuthenticationBottomSheetInner,
} from '../components/AuthenticationBottomSheet';
import { useTransactionRequestListener } from '../hooks/useLinkingListener/useTransactionRequestsListener';
import TransactionRequestBottomSheet from '../components/TransactionRequestBottomSheet';
import { useInternetConnection } from '../hooks/useInternetConnnection';
import SendForm from '../screens/SendForm';
import PreviewTransaction from '../screens/PreviewTransaction';
import AssetDetails from '../screens/AssetDetails';
import { StatusBar } from 'react-native';
import { CreateIdentityBottomSheetInner } from '../components/CreateIdentityBottomSheet';
import SignatureRequestBottomSheet from '../components/SignatureRequestBottomSheet';

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
      <SignatureRequestBottomSheet />
      <StatusBar barStyle={'light-content'} backgroundColor="white" />
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
          name="AssetDetails"
          component={AssetDetails}
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
          name="CreateSeedPhrase"
          component={CreateSeedPhrase}
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
        <Stack.Screen
          name="SendForm"
          component={SendForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="previewTransaction"
          component={PreviewTransaction}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

const Stack2 = createStackNavigator();

interface IProps {
  selectedAccountIndex?: number;
  setSelectedAccountIndex: (index: number) => void;
  dismissBottomSheet: () => void;
}
export const AuthenticationRoutes: React.FC<IProps> = ({
  selectedAccountIndex,
  setSelectedAccountIndex,
  dismissBottomSheet,
}) => {
  return (
    <>
      <Stack2.Navigator initialRouteName="Authenticate">
        <Stack2.Screen options={{ headerShown: false }} name="Authenticate">
          {props => (
            <WrappedAuthenticationBottomSheetInner
              {...props}
              selectedAccountIndex={selectedAccountIndex}
              setSelectedAccountIndex={setSelectedAccountIndex}
              dismissBottomSheet={dismissBottomSheet}
            />
          )}
        </Stack2.Screen>
        <Stack2.Screen options={{ headerShown: false }} name="CreateIdentity">
          {props => (
            <CreateIdentityBottomSheetInner
              {...props}
              onCancel={dismissBottomSheet}
            />
          )}
        </Stack2.Screen>
      </Stack2.Navigator>
    </>
  );
};
