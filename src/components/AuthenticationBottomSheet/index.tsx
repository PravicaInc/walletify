import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Image, ListRenderItem, View } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import ContentLoader from 'react-content-loader/native';
import { AccountWithAddress } from '../../models/account';
import AccountListItem from '../Accounts/AccountListItem';
import { Typography } from '../shared/Typography';
import styles from './styles';
import { useAtomValue } from 'jotai/utils';
import { authRequestState } from '../../hooks/auth/authStore';
import { withSuspense } from '../shared/WithSuspense';
import { useAuthRequest, finishSignIn } from '../../hooks/auth/useAuthRequest';
import { useProgressState } from '../../hooks/useProgressState';
import { useWallet } from '../../hooks/useWallet/useWallet';
import { CustomBackdrop } from '../shared/customBackdrop';
import { selectedNetwork } from '../../hooks/useNetwork/networkStore';
import { Portal } from '@gorhom/portal';
import GeneralButton from '../shared/GeneralButton';
import { isIosApp } from '../../shared/helpers';
import WarningIcon from '../shared/WarningIcon';
import { AuthenticationRoutes } from '../../navigation';
import {
  NavigationContainer,
  NavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';

const AuthenticationBottomSheet: React.FC = () => {
  const snapPoints = React.useMemo(() => ['95%'], []);
  const navigationRef = useRef<NavigationContainerRef>(null);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState<
    number | undefined
  >();
  const authRequest = useAtomValue(authRequestState);
  const setAuthRequest = useAuthRequest();
  const bottomSheetRef = useRef<BottomSheet>(null);
  useEffect(() => {
    if (authRequest.authRequest) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [authRequest]);
  const dismissBottomSheet = useCallback(() => {
    setAuthRequest({
      authRequest: undefined,
      decodedAuthRequest: undefined,
      appName: undefined,
      appIcon: undefined,
      appURL: undefined,
    });
    bottomSheetRef.current?.close();
    setSelectedAccountIndex(undefined);
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        dismissBottomSheet();
        navigationRef.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Authenticate' }],
          }),
        );
      }
    },
    [dismissBottomSheet],
  );

  return (
    <Portal>
      <BottomSheet
        onChange={handleSheetChanges}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
        backdropComponent={CustomBackdrop}
        handleComponent={null}
        enablePanDownToClose
        index={-1}>
        <NavigationContainer ref={navigationRef} independent={true}>
          <AuthenticationRoutes
            dismissBottomSheet={dismissBottomSheet}
            setSelectedAccountIndex={setSelectedAccountIndex}
            selectedAccountIndex={selectedAccountIndex}
          />
        </NavigationContainer>
      </BottomSheet>
    </Portal>
  );
};

export default AuthenticationBottomSheet;

interface BottomSheetInnerProps {
  selectedAccountIndex?: number;
  setSelectedAccountIndex: (index: number) => void;
  dismissBottomSheet: () => void;
}

const AuthenticationBottomSheetInner: React.FC<BottomSheetInnerProps> = ({
  selectedAccountIndex,
  setSelectedAccountIndex,
  dismissBottomSheet,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const authRequest = useAtomValue(authRequestState);
  const network = useAtomValue(selectedNetwork);
  const { walletAccounts, switchAccount } = useAccounts();
  const { walletState } = useWallet();
  const { loading, setSuccess, setLoading, setFailure } = useProgressState();
  const bnsRequired = authRequest.decodedAuthRequest?.bnsRequired;
  const handleSelectAccount = (index: number) => {
    if (!loading && walletAccounts?.length) {
      setSelectedAccountIndex(index);
    }
  };
  const handleConfirmAuth = async () => {
    if (
      !loading &&
      selectedAccountIndex !== undefined &&
      walletAccounts?.length
    ) {
      setLoading();
      switchAccount(selectedAccountIndex);
      await finishSignIn(
        authRequest,
        walletState as any,
        walletAccounts,
        selectedAccountIndex,
        network,
        dismissBottomSheet,
      ).catch(setFailure);
      setSuccess();
    }
  };
  const renderAccountsListHeader = useCallback(() => {
    return (
      <>
        <View
          style={[
            styles.headerContainer,
            {
              backgroundColor: colors.card,
            },
          ]}>
          <Image
            style={styles.appIcon}
            source={{ uri: authRequest?.appIcon }}
          />
          <Typography type={'commonText'} style={styles.warning}>
            {`Allow ${authRequest?.appName} to proceed with the decentralized authentication process.`}
          </Typography>
          {bnsRequired && (
            <View style={[styles.required, { backgroundColor: colors.white }]}>
              <WarningIcon width={24} height={24} fill={colors.primary60} />
              <Typography
                type="commonText"
                searchWords={['identity']}
                style={[styles.warning, { color: colors.primary60 }]}
                highlightStyle={{ fontWeight: 'bold' }}>
                This app require an account with identity to make a successful
                authentication
              </Typography>
            </View>
          )}
        </View>
        <Typography
          type={'commonText'}
          style={[styles.title, styles.titleSpace]}>
          Select Account
        </Typography>
      </>
    );
  }, [
    loading,
    colors,
    bnsRequired,
    authRequest?.appName,
    authRequest?.appIcon,
  ]);

  const renderAccount: ListRenderItem<AccountWithAddress> = ({ item }) => {
    return (
      <AccountListItem
        account={item}
        disabled={bnsRequired && !item.username}
        onPressAccount={() => handleSelectAccount(item.index)}
        isSelected={item.index === selectedAccountIndex}
        key={item.address}
      />
    );
  };
  const ctaButton = (
    <GeneralButton
      loading={loading}
      canGoNext={!(loading || selectedAccountIndex === undefined)}
      onClick={handleConfirmAuth}
      text={'Confirm'}
    />
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        title="Authentication"
        leftComponent={
          <HeaderBack
            textColor={colors.secondary100}
            text="Cancel"
            onPress={dismissBottomSheet}
          />
        }
        rightComponent={isIosApp && ctaButton}
      />
      <Suspense fallback={<ContentLoader />}>
        <BottomSheetFlatList
          data={walletAccounts}
          keyExtractor={account => account.address}
          renderItem={renderAccount}
          ListHeaderComponent={renderAccountsListHeader}
          contentContainerStyle={styles.accountsList}
        />
      </Suspense>
      {!isIosApp && ctaButton}
    </View>
  );
};

export const WrappedAuthenticationBottomSheetInner = withSuspense(
  AuthenticationBottomSheetInner,
  <ContentLoader />,
);
