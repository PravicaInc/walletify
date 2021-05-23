import React from 'react';
import AppNavigator from './routes';
import {StatusBar} from 'react-native';
import {store} from './src/store';
import {Provider, useSelector} from 'react-redux';
import AuthModal from './src/screens/AuthModal';
import {selectCurrentWallet} from './src/store/wallet/selectors';
import {selectDecodedAuthRequest} from './src/store/onboarding/selectors';
import {useAuthenticatorListeners} from './src/hooks/useAuthenticatorListeners';
import {sortIdentities} from './src/hooks/useCardsIdentity';

const AppContainer = () => {
  const wallet = useSelector(selectCurrentWallet);
  const authRequest = useSelector(selectDecodedAuthRequest);
  useAuthenticatorListeners();
  return (
    <AuthModal
      identities={sortIdentities(wallet?.identities || [])}
      modalVisible={!!authRequest?.domain_name}
    />
  );
};
export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      {/* <SafeAreaView style={{flex: 1}}> */}
      <Provider store={store}>
        <AppNavigator />
        <AppContainer />
      </Provider>
      {/* </SafeAreaView> */}
    </>
  );
}
