import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../contexts/Theme/theme';
import Header from '../../components/shared/Header';
import HomeTabs from './HomeTabs';
import AccountBalanceCard from './AccountBalanceCard';
import Wise from '../../assets/wise.svg';
import Settings from '../../assets/images/settings/settings.svg';
import { styles } from './styles';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import SwitchAccountBottomSheet from '../../components/Accounts/SwitchAccountBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import SwitchAccountButton from '../../components/SwitchAccountButton';
import { withSuspense } from '../../components/shared/WithSuspense';

const Home = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { dispatch } = useNavigation();
  const { switchAccount, walletAccounts, selectedAccountState } = useAccounts();
  const bottomSheetModalRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (!selectedAccountState) {
      switchAccount(0);
    }
  }, [selectedAccountState]);

  const goToSettings = () => dispatch(StackActions.push('Settings'));

  const handlePressSwitchAccount = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex(
      (walletAccounts?.length || 0) > 5 ? 1 : 0,
    );
  }, [walletAccounts]);

  const handleCancelSwitchAccount = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSwitchAccount = useCallback((accountIndex: number) => {
    switchAccount(accountIndex);
    handleCancelSwitchAccount();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.contentContainer}>
        <Header
          containerStyles={styles.header}
          leftComponent={<Wise width={92} height={36} />}
          rightComponent={
            <TouchableOpacity
              onPress={goToSettings}
              activeOpacity={0.5}
              style={styles.settingsButton}>
              <Settings />
            </TouchableOpacity>
          }
        />
        <SwitchAccountButton
          mode="large"
          handlePressSwitchAccount={handlePressSwitchAccount}
        />
        <AccountBalanceCard />
        <View style={styles.walletOperationsTabs}>
          <HomeTabs />
        </View>
      </View>
      <SwitchAccountBottomSheet
        bottomSheetRef={bottomSheetModalRef}
        onSwitch={handleSwitchAccount}
        onCancel={handleCancelSwitchAccount}
      />
    </View>
  );
};

export default withSuspense(Home);
