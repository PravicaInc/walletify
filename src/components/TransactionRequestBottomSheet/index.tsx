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
import { Alert, Image, Linking, View } from 'react-native';
import ContentLoader from 'react-content-loader/native';
import { ThemeContext } from '../../contexts/Theme/theme';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { Typography } from '../shared/Typography';
import styles from './styles';
import { useAtomValue } from 'jotai/utils';
import { withSuspense } from '../shared/WithSuspense';
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
import { microStxToStx, valueFromBalance } from '../../shared/balanceUtils';
import { currentAccountAvailableStxBalanceState } from '../../hooks/useAccounts/accountsStore';
import { Portal } from '@gorhom/portal';
import { FeesCalculations } from '../FeesCalculations';
import { SelectedFee } from '../../shared/types';

const TransactionRequestBottomSheet: React.FC = () => {
  const snapPoints = React.useMemo(() => ['95%'], []);
  const transactionRequest = useAtomValue(transactionRequestTokenPayloadState);
  const setTransactionRequest = useTransactionRequest();

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
        <WrappedTransactionRequestBottomSheetInner
          dismissBottomSheet={dismissBottomSheet}
        />
      </BottomSheet>
    </Portal>
  );
};

export default TransactionRequestBottomSheet;

interface TransactionRequestInnerProps {
  dismissBottomSheet: () => void;
}

const TransactionRequestBottomSheetInner: React.FC<
  TransactionRequestInnerProps
> = ({ dismissBottomSheet }) => {
  const { selectedAccountAssets: assets } = useAssets();
  const [selectedFee, setSelectedFee] = useState<SelectedFee>();
  const [selectedAsset, setSelectedAsset] = useState<AccountToken | undefined>(
    undefined,
  );
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { bottom } = useSafeAreaInsets();
  const balance = useAtomValue(currentAccountAvailableStxBalanceState);
  const transactionRequest = useAtomValue(transactionRequestTokenPayloadState);
  const transferPayload = transactionRequest as STXTransferPayload;
  const amount = useMemo(() => {
    if (balance) {
      return valueFromBalance(balance, 'stx');
    }
    return 0;
  }, [balance]);
  const { selectedAccountState: account, sendTransaction } = useAccounts();
  const [isSending, toggleSending] = useState<boolean>(false);
  useEffect(() => {
    if (assets !== undefined && assets.length > 0) {
      setSelectedAsset(assets.find(a => a.name === 'STX'));
    }
  }, [assets]);

  const isEnoughBalance = microStxToStx(transferPayload?.amount || '0')
    .plus(selectedFee?.fee || '0')
    .lte(amount);
  const handSendPress = useCallback(() => {
    async function handleTransfer() {
      if (!transactionRequest || !transferPayload) {
        return;
      }

      const dangerousUri = transactionRequest.redirect_uri;
      if (!isValidUrl(dangerousUri) || dangerousUri.includes('javascript')) {
        Alert.alert('Cannot proceed auth with malformed url');
      }

      toggleSending(true);

      const response = await sendTransaction(
        transferPayload.recipient,
        microStxToStx(transferPayload.amount).toNumber(),
        selectedFee as number,
        transferPayload.memo,
      );

      toggleSending(false);

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
  }, [transactionRequest, selectedFee]);
  return (
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
        isRightLoading={isSending}
        rightComponent={
          <HeaderBack
            disabled={
              Number(selectedFee?.fee) === null ||
              !(isEnoughBalance && selectedFee)
            }
            textColor={
              Number(selectedFee?.fee) === null ||
              !(isEnoughBalance && selectedFee)
                ? colors.primary40
                : colors.secondary100
            }
            text="Confirm"
            onPress={handSendPress}
          />
        }
      />
      <Suspense fallback={<ContentLoader />}>
        <View
          style={[
            styles.headerContainer,
            {
              backgroundColor: colors.card,
            },
          ]}>
          <View
            style={[styles.appIconWrapper, { backgroundColor: colors.white }]}>
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
            isSigning
            sender={account.address}
            memo={transferPayload.memo}
            recipient={transferPayload.recipient}
            amount={Number(transferPayload.amount) / 1000000}
            selectedAsset={selectedAsset}
            style={styles.previewPanel}
            selectedFee={selectedFee}
          />
        )}
        <FeesCalculations
          isSigning
          recipient={transferPayload?.recipient}
          amount={transferPayload?.amount}
          setSelectedFee={setSelectedFee}
          memo={transferPayload?.memo}
          selectedFee={selectedFee}
        />
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
          If you confirm this transaction it is not reversible. Make sure all
          inputs are correct.
        </Typography>
      </View>
    </View>
  );
};

const WrappedTransactionRequestBottomSheetInner = withSuspense(
  TransactionRequestBottomSheetInner,
  <ContentLoader />,
);
