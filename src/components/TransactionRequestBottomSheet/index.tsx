import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
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
import GeneralButton from '../shared/GeneralButton';
import WarningIcon from '../shared/WarningIcon';
import { titleCase } from '../../shared/helpers';

const TransactionRequestBottomSheet: React.FC = () => {
  const snapPoints = React.useMemo(() => ['90%'], []);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const transactionRequest = useAtomValue(transactionRequestTokenPayloadState);
  const transferPayload = transactionRequest as STXTransferPayload;
  const setTransactionRequest = useTransactionRequest();

  const {
    selectedAccountState: account,
    estimateTransactionFees,
    sendTransaction,
  } = useAccounts();
  const { selectedAccountAssets: assets } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<AccountToken | undefined>(
    undefined,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fees, setFees] = useState<Number>(NaN);
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
        backdropComponent={CustomBackdrop}
        enablePanDownToClose
        index={-1}>
        <View style={styles.container}>
          <Header
            title="Transaction Signing"
            leftComponent={
              <HeaderBack
                textColor={colors.secondary100}
                text="Cancel"
                onPress={dismissBottomSheet}
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
              <Image
                style={styles.appIcon}
                source={{ uri: transactionRequest?.appDetails?.icon }}
              />
              <Typography type={'commonText'} style={styles.warning}>
                {`Allow ${transactionRequest?.appDetails?.name} to proceed with the decentralized authentication process.`}
              </Typography>
            </View>
            {transferPayload && selectedAsset && account && (
              <PreviewTransfer
                sender={account.address}
                recipient={transferPayload.recipient}
                amount={Number(transferPayload.amount) / 1000000}
                fees={Number(fees)}
                selectedAsset={selectedAsset}
                style={styles.previewPanel}
              />
            )}
          </Suspense>
          <View style={[styles.horizontalFill, styles.centerItems]}>
            <WarningIcon fill={colors.primary60} />
            <Typography
              type="commonText"
              style={[
                styles.warningText,
                {
                  color: colors.primary60,
                },
              ]}>
              If you confirm this transaction it is not reversible. Make sure
              all arguments are correct.
            </Typography>
            <GeneralButton
              type="Primary"
              disabled={isNaN(Number(fees)) || isLoading}
              onPress={handSendPress}>
              {isLoading ? 'Sending...' : 'Send'}
            </GeneralButton>
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
