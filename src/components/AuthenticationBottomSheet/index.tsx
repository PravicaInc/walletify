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

const AuthenticationBottomSheet: React.FC = () => {
  const snapPoints = React.useMemo(() => ['95%'], []);
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
        backdropComponent={CustomBackdrop}
        handleComponent={null}
        enablePanDownToClose
        index={-1}>
        <WrappedAuthenticationBottomSheetInner
          selectedAccountIndex={selectedAccountIndex}
          setSelectedAccountIndex={setSelectedAccountIndex}
          dismissBottomSheet={dismissBottomSheet}
        />
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
        </View>
        <Typography
          type={'commonText'}
          style={[styles.title, styles.titleSpace]}>
          Select Account
        </Typography>
      </>
    );
  }, [loading, colors, authRequest?.appName, authRequest?.appIcon]);

  const renderAccount: ListRenderItem<AccountWithAddress> = ({ item }) => {
    return (
      <AccountListItem
        account={item}
        onPressAccount={() => handleSelectAccount(item.index)}
        isSelected={item.index === selectedAccountIndex}
        key={item.address}
      />
    );
  };
  return (
    <View style={styles.container}>
      <Header
        title="Authentication"
        leftComponent={
          <HeaderBack
            textColor={colors.secondary100}
            text="Cancel"
            onPress={dismissBottomSheet}
          />
        }
        isRightLoading={loading}
        rightComponent={
          <HeaderBack
            disabled={loading || selectedAccountIndex === undefined}
            textColor={
              loading || selectedAccountIndex === undefined
                ? colors.primary40
                : colors.secondary100
            }
            text="Confirm"
            onPress={handleConfirmAuth}
          />
        }
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
    </View>
  );
};

const WrappedAuthenticationBottomSheetInner = withSuspense(
  AuthenticationBottomSheetInner,
  <ContentLoader />,
);
