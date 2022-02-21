import React, {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { ThemeContext } from '../../contexts/Theme/theme';
import { Typography } from '../shared/Typography';
import SimpleTextInput from './SimpleTextInput';
import ScanQrIcon from '../../assets/images/scanQr.svg';
import ScanQrBottomSheet from '../ScanQrBottomSheet';
import WarningIcon from '../shared/WarningIcon';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import { AccountToken } from '../../models/account';
import AccountAsset from '../Home/AccountAsset';
import { useAssets } from '../../hooks/useAssets/useAssets';
import PreviewTransfer from '../PreviewTransfer';
import { useTransactions } from '../../hooks/useTransactions/useTransactions';
import { SubmittedTransaction } from '../../models/transactions';
import GeneralButton from '../shared/GeneralButton';

type Props = {
  fullBalance: any;
  price: any;
  onCancel?: () => void;
};

const Send: React.FC<Props> = ({ fullBalance, price, onCancel }, ref) => {
  const qrScanRef = useRef<BottomSheetModal>(null);

  const {
    selectedAccountState: account,
    estimateTransactionFees,
    sendTransaction,
  } = useAccounts();
  const { selectedAccountAssets: assets } = useAssets();
  const {
    submittedTransactions,
    setSubmittedTransactions,
    refreshTransactionsList,
  } = useTransactions();
  const [selectedAsset, setSelectedAsset] = useState<AccountToken | undefined>(
    undefined,
  );

  const handlePresentQrScan = useCallback(() => {
    qrScanRef.current?.snapToIndex(0);
  }, []);

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [preview, setPreview] = useState(false);
  const [fees, setFees] = useState<Number>(NaN);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorMessages, setErrorMessages] = useState({
    amount: '',
    recipient: '',
  });

  const handleSendPress = () => {
    function handleTransaction() {
      setIsLoading(true);

      const internal_id = `${Math.random()}`;
      setSubmittedTransactions([
        ...submittedTransactions,
        {
          internal_id,
          tx_id: internal_id,
          tx_status: 'submitted',
          tx_type: 'token_transfer',
          sender_address: account?.address ?? '',
          token_transfer: {
            amount: `${Number(amount) * 1000000}`,
            recipient_address: recipient,
            memo,
          },
        },
      ]);

      sendTransaction(recipient, Number(amount), Number(fees), memo).then(
        result => {
          const tx = submittedTransactions.find(
            t => t.internal_id === internal_id,
          ) as SubmittedTransaction;

          if (result?.error) {
            tx.tx_status = 'failed';
          } else {
            setSubmittedTransactions(
              submittedTransactions.filter(t => t.internal_id !== internal_id),
            );
            refreshTransactionsList();
          }
        },
      );

      dismissBottomSheet();
    }
    if (preview) {
      handleTransaction();
    }
  };

  useEffect(() => {
    if (assets !== undefined && assets.length > 0) {
      setSelectedAsset(assets.find(a => a.name === 'STX'));
    }
  }, [assets]);

  useEffect(() => {
    if (String(+amount) !== amount || +amount <= -1) {
      setErrorMessages({
        ...errorMessages,
        amount: 'Please enter a valid amount',
      });
    } else if (+amount * price > Number(fullBalance)) {
      setErrorMessages({
        ...errorMessages,
        amount: 'Insufficient balance',
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        amount: '',
      });
    }
  }, [amount]);

  useEffect(() => {
    if (!recipient) {
      setErrorMessages({
        ...errorMessages,
        recipient: 'Please add a recipient address',
      });
    } else if (!recipient.match('^[A-Z0-9]{40,}$')) {
      setErrorMessages({
        ...errorMessages,
        recipient: 'Please add a valid recipient address',
      });
    } else if (recipient === account?.address) {
      setErrorMessages({
        ...errorMessages,
        recipient: "You can't send to your address.",
      });
    } else {
      setErrorMessages({
        ...errorMessages,
        recipient: '',
      });
    }
  }, [recipient]);

  useEffect(() => {
    const fetchFees = async () => {
      setIsLoading(true);
      const transactionFees = await estimateTransactionFees(
        recipient,
        Number(amount),
        memo,
      );
      setFees(transactionFees);
      setIsLoading(false);
    };
    if (amount && recipient) {
      fetchFees();
    }
  }, [amount, recipient, memo]);

  const dismissBottomSheet = useCallback(() => {
    setAmount('');
    setRecipient('');
    setMemo('');
    setPreview(false);
    setFees(NaN);
    setErrorMessages({ amount: '', recipient: '' });
    if (Platform.OS === 'ios') {
      (ref as RefObject<BottomSheetModal>)?.current?.close();
    } else {
      onCancel();
    }
  }, []);

  const isReadyForPreview =
    amount &&
    recipient &&
    fees &&
    !errorMessages.amount &&
    !errorMessages.recipient;

  function RenderCreateTransaction() {
    return (
      <>
        <Header
          title="Send"
          leftComponent={
            <HeaderBack
              textColor={colors.secondary100}
              isBack={Platform.OS === 'android'}
              isCancel={Platform.OS === 'ios'}
              onPress={dismissBottomSheet}
            />
          }
          rightComponent={
            Platform.OS === 'ios' && (
              <TouchableOpacity
                disabled={isLoading || !isReadyForPreview}
                onPress={() => setPreview(true)}>
                {isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Typography
                    type="buttonText"
                    style={{
                      color:
                        isLoading || !isReadyForPreview
                          ? colors.primary40
                          : colors.secondary100,
                    }}>
                    Preview
                  </Typography>
                )}
              </TouchableOpacity>
            )
          }
        />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.inputsContainer}
          scrollEnabled={false}
          extraHeight={132}
          extraScrollHeight={132}>
          <View style={styles.horizontalFill}>
            <View style={styles.horizontalFill}>
              {selectedAsset && (
                <AccountAsset
                  item={selectedAsset}
                  showFullBalance
                  fullBalance={`~ $${fullBalance}`}
                />
              )}
            </View>
            <View style={styles.horizontalFill}>
              <SimpleTextInput
                onChangeText={setAmount}
                value={amount}
                labelStyle={styles.textInputLabel}
                label="Amount To Send"
                placeholder="0.00000000"
                keyboardType="decimal-pad"
                icon={
                  <Typography
                    type="smallTitleR"
                    style={{ color: colors.primary40 }}>
                    STX
                  </Typography>
                }
                subtext={
                  <Typography
                    type="commonText"
                    style={[
                      {
                        color: colors.primary40,
                      },
                      styles.alignRight,
                    ]}>
                    {`~ $${(+amount * price).toFixed(2)}`}
                  </Typography>
                }
                errorMessage={errorMessages.amount}
              />
              <SimpleTextInput
                onChangeText={setRecipient}
                labelStyle={styles.textInputLabel}
                value={recipient}
                label="Recipient Address"
                placeholder="Enter an address"
                maxLength={50}
                icon={
                  <TouchableOpacity onPress={handlePresentQrScan}>
                    <ScanQrIcon />
                  </TouchableOpacity>
                }
                errorMessage={errorMessages.recipient}
              />
              <ScanQrBottomSheet ref={qrScanRef} setRecipient={setRecipient} />
              <SimpleTextInput
                onChangeText={setMemo}
                value={memo}
                labelStyle={styles.textInputLabel}
                label="Memo (For exchanges)"
                placeholder="Enter a memo"
                subtext={
                  <Typography
                    type="commonText"
                    style={{ color: colors.primary40 }}>
                    If you are sending to an exchange, be sure to include the
                    memo the exchange provided so the STX is credited to your
                    account
                  </Typography>
                }
              />
            </View>
          </View>
          {Platform.OS === 'android' && (
            <GeneralButton
              type="Primary"
              disabled={isLoading || !isReadyForPreview}
              onPress={() => setPreview(true)}>
              {isLoading ? 'Calculating Fees...' : 'Preview'}
            </GeneralButton>
          )}
        </KeyboardAwareScrollView>
      </>
    );
  }

  function RenderPreviewTransaction() {
    return (
      <>
        <Header
          title="Send"
          leftComponent={
            <HeaderBack
              textColor={colors.secondary100}
              isBack
              hasChevron
              chevronColor={colors.secondary100}
              onPress={() => setPreview(false)}
            />
          }
          rightComponent={
            <TouchableOpacity disabled={isLoading} onPress={handleSendPress}>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Typography
                  type="buttonText"
                  style={{
                    color:
                      isLoading || !isReadyForPreview
                        ? colors.primary40
                        : colors.secondary100,
                  }}>
                  Send
                </Typography>
              )}
            </TouchableOpacity>
          }
        />
        <View style={styles.inputsContainer}>
          {account && selectedAsset && (
            <PreviewTransfer
              sender={account?.address}
              recipient={recipient}
              memo={memo}
              amount={Number(amount)}
              fees={Number(fees)}
              selectedAsset={selectedAsset}
            />
          )}
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
          </View>
        </View>
      </>
    );
  }
  return (
    <View style={styles.container}>
      {preview ? RenderPreviewTransaction() : RenderCreateTransaction()}
    </View>
  );
};

export default Send;
