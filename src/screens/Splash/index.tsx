import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { observer } from 'mobx-react-lite';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useLocalization } from '../../hooks/useLocalization';
import { LANGUAGES } from '../../shared/constants';
import { useStores } from '../../hooks/useStores';

const Splash: React.FC = observer(() => {
  const { uiStore, walletStore } = useStores();
  const { hasSeenOnBoarding } = uiStore;
  const { encryptedSeedPhrase } = walletStore;
  const { dispatch } = useNavigation();
  const { changeLanguage } = useLocalization();
  const initLocalization = async () => {
    await changeLanguage(LANGUAGES[0]);
  };
  useEffect(() => {
    initLocalization();
    if (uiStore.isHydrated && walletStore.isHydrated) {
      if (encryptedSeedPhrase.length > 0) {
        dispatch(StackActions.replace('Home'));
      } else if (hasSeenOnBoarding) {
        dispatch(StackActions.replace('WalletSetup'));
      } else {
        dispatch(StackActions.replace('Onboarding'));
      }
      SplashScreen.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return null;
});

export default Splash;
