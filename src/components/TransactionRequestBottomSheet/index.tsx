import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Alert, Image, Linking, Text, View } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { Typography } from '../shared/Typography';
import styles from './styles';
import { useAtomValue } from 'jotai/utils';
import { withSuspense } from '../shared/WithSuspense';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop } from '../shared/customBackdrop';
import { transactionRequestTokenPayloadState } from '../../hooks/transactions/requests';
import { useTransactionRequest } from '../../hooks/transactions/useTransactionRequest';
import { STXTransferPayload, TransactionTypes } from '@stacks/connect';
import { isValidUrl } from '../../hooks/auth/useAuthRequest';
import PreviewTransfer from '../PreviewTransfer';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import { useAssets } from '../../hooks/useAssets/useAssets';
import { AccountToken } from '../../models/account';
import WarningIcon from '../shared/WarningIcon';
import { titleCase } from '../../shared/helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { valueFromBalance } from '../../shared/balanceUtils';
import { currentAccountAvailableStxBalanceState } from '../../hooks/useAccounts/accountsStore';

const TransactionRequestBottomSheet: React.FC = () => {
  const snapPoints = React.useMemo(() => ['95%'], []);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { bottom } = useSafeAreaInsets();
  const transactionRequest = useAtomValue(transactionRequestTokenPayloadState);
  const transferPayload = transactionRequest as STXTransferPayload;
  const setTransactionRequest = useTransactionRequest();
  const balance = useAtomValue(currentAccountAvailableStxBalanceState);
  const amount = useMemo(() => {
    if (balance) {
      return valueFromBalance(balance, 'stx');
    }
    return 0;
  }, [balance]);
  const [fees, setFees] = useState<Number>(NaN);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEnoughBalance =
    Number(transferPayload?.amount || 0) / 1000000 + Number(fees) <= amount;
  const {
    selectedAccountState: account,
    estimateTransactionFees,
    sendTransaction,
  } = useAccounts();
  const { selectedAccountAssets: assets } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<AccountToken | undefined>(
    undefined,
  );

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (
      transactionRequest &&
      transactionRequest.txType === TransactionTypes.STXTransfer
    ) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [transactionRequest]);

  const dismissBottomSheet = useCallback(() => {
    setTransactionRequest(undefined);
    setFees(NaN);
    bottomSheetRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        dismissBottomSheet();
      }
    },
    [dismissBottomSheet],
  );

  useEffect(() => {
    if (assets !== undefined && assets.length > 0) {
      setSelectedAsset(assets.find(a => a.name === 'STX'));
    }
  }, [assets]);

  useEffect(() => {
    const fetchFees = async () => {
      const transactionFees = await estimateTransactionFees(
        transferPayload?.recipient,
        Number(transferPayload?.amount) / 1000000,
        transferPayload.memo,
      );
      setFees(transactionFees);
    };
    if (transactionRequest) {
      fetchFees();
    }
  }, [transactionRequest]);

  const handSendPress = useCallback(() => {
    async function handleTransfer() {
      if (!transactionRequest || !transferPayload) {
        return;
      }

      const dangerousUri = transactionRequest.redirect_uri;
      if (!isValidUrl(dangerousUri) || dangerousUri.includes('javascript')) {
        Alert.alert('Cannot proceed auth with malformed url');
      }

      setIsLoading(true);

      const response = await sendTransaction(
        transferPayload.recipient,
        Number(transferPayload.amount) / 1000000,
        Number(fees),
        transferPayload.memo,
      );

      setIsLoading(false);

      if (response?.error !== undefined) {
        Alert.alert(
          titleCase(response.error),
          `Failure reason: ${response.reason}`,
        );
      } else if (response && response?.error === undefined) {
        const requestResult = {
          ...(transactionRequest.metadata || {}),
          txid: `0x${response?.txid}`,
        };
        const redirect = `${dangerousUri}?txResult=${JSON.stringify(
          requestResult,
        )}`;
        Linking.openURL(redirect);
        dismissBottomSheet();
      }
    }

    if (transactionRequest) {
      handleTransfer();
    }
  }, [transactionRequest, fees]);
  return (
    <Portal>
      <BottomSheet
        onChange={handleSheetChanges}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={null}
        backdropComponent={CustomBackdrop}
        enablePanDownToClose
        index={-1}>
        <View style={[styles.container, { paddingBottom: bottom + 10 }]}>
          <Header
            containerStyles={styles.header}
            title="Transaction Signing"
            leftComponent={
              <HeaderBack
                textColor={colors.secondary100}
                text="Cancel"
                onPress={dismissBottomSheet}
              />
            }
            isRightLoading={isLoading}
            rightComponent={
              <HeaderBack
                disabled={Number(fees) === null || !isEnoughBalance}
                textColor={
                  Number(fees) === null || !isEnoughBalance
                    ? colors.primary40
                    : colors.secondary100
                }
                text="Confirm"
                onPress={handSendPress}
              />
            }
          />
          <Suspense fallback={<Text>Loading</Text>}>
            <View
              style={[
                styles.headerContainer,
                {
                  backgroundColor: colors.card,
                },
              ]}>
              <View
                style={[
                  styles.appIconWrapper,
                  { backgroundColor: colors.white },
                ]}>
                <Image
                  style={styles.appIcon}
                  source={{ uri: transactionRequest?.appDetails?.icon }}
                />
              </View>
              <Typography type={'commonText'} style={styles.warning}>
                {`${transactionRequest?.appDetails?.name} asks for your signature to proceed with this transaction, Please make sure transaction parameters are correct.`}
              </Typography>
            </View>
            {!isEnoughBalance && (
              <View
                style={[
                  styles.noBalanceCard,
                  { backgroundColor: colors.failed10 },
                ]}>
                <WarningIcon width={24} height={24} fill={colors.failed100} />
                <Typography
                  type="smallTitle"
                  style={[
                    styles.noBalanceTitle,
                    {
                      color: colors.failed100,
                    },
                  ]}>
                  No Enough Balance
                </Typography>
                <Typography
                  type="commonText"
                  style={[
                    styles.noBalanceDesc,
                    {
                      color: colors.failed100,
                    },
                  ]}>
                  {`You have not enough balance to proceed this transaction, Available Balance: ${amount} STX`}{' '}
                </Typography>
              </View>
            )}
            {transferPayload && selectedAsset && account && (
              <PreviewTransfer
                sender={account.address}
                memo={transferPayload.memo}
                recipient={transferPayload.recipient}
                amount={Number(transferPayload.amount) / 1000000}
                fees={Number(fees)}
                selectedAsset={selectedAsset}
                style={styles.previewPanel}
              />
            )}
          </Suspense>
          <View style={[styles.horizontalFill, styles.centerItems]}>
            <WarningIcon width={24} height={24} fill={colors.primary60} />
            <Typography
              type="commonText"
              style={[
                styles.warningText,
                {
                  color: colors.primary60,
                },
              ]}>
              If you confirm this transaction it is not reversible. Make sure
              all inputs are correct.
            </Typography>
          </View>
        </View>
      </BottomSheet>
    </Portal>
  );
};

export default withSuspense(
  TransactionRequestBottomSheet,
  <Text>Loading</Text>,
);
