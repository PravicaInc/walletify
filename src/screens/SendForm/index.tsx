import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomSheetModal, useBottomSheet } from '@gorhom/bottom-sheet';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AccountAsset from '../../components/Home/AccountAsset';
import SimpleTextInput from '../../components/SendBottomSheet/SimpleTextInput';
import ScanQrIcon from '../../assets/images/scanQr.svg';
import ScanQrBottomSheet from '../../components/ScanQrBottomSheet';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import { useAtomValue } from 'jotai/utils';
import { currentAccountAvailableStxBalanceState } from '../../hooks/useAccounts/accountsStore';
import { AccountToken } from '../../models/account';
import StxTokenIcon from '../../assets/images/stx.svg';
import { valueFromBalance } from '../../shared/balanceUtils';
import BigNumber from 'bignumber.js';
import { useStxPriceValue } from '../../hooks/useStxPrice/useStxPrice';
import { StackActions, useNavigation } from '@react-navigation/native';

const SendForm: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { close } = useBottomSheet();

  const qrScanRef = useRef<BottomSheetModal>(null);

  const { selectedAccountState: account } = useAccounts();
  const price = useStxPriceValue();
  const stxBalance = useAtomValue(currentAccountAvailableStxBalanceState);
  const [selectedAsset] = useState<AccountToken>({
    name: 'STX',
    defaultStyles: {
      backgroundColor: 'black',
    },
    icon: StxTokenIcon,
    amount: valueFromBalance(stxBalance as BigNumber, 'stx'),
  });
  const { dispatch } = useNavigation();
  const balance = useAtomValue(currentAccountAvailableStxBalanceState);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    amount: '',
    recipient: '',
  });

  const fullBalance = useMemo(() => {
    if (balance) {
      return valueFromBalance(balance.multipliedBy(price), 'stx', {
        fixedDecimals: false,
      });
    }
    return NaN;
  }, [balance, price]);
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
  const dismissBottomSheet = useCallback(() => {
    setAmount('');
    setRecipient('');
    setMemo('');
    setErrorMessages({ amount: '', recipient: '' });
    close();
  }, []);

  const handlePresentQrScan = useCallback(() => {
    qrScanRef.current?.snapToIndex(0);
  }, []);
  const handleGoToPreview = useCallback(() => {
    dispatch(
      StackActions.push('previewTransaction', {
        amount,
        recipient,
        memo,
        dismissBottomSheet,
        selectedAsset,
      }),
    );
  }, [amount, recipient, memo, dismissBottomSheet, selectedAsset]);
  const isReadyForPreview =
    amount && recipient && !errorMessages.amount && !errorMessages.recipient;
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        title="Send"
        leftComponent={
          <HeaderBack
            textColor={colors.secondary100}
            text="Cancel"
            onPress={dismissBottomSheet}
          />
        }
        rightComponent={
          <TouchableOpacity
            disabled={!isReadyForPreview}
            onPress={handleGoToPreview}>
            <Typography
              type="buttonText"
              style={{
                color: !isReadyForPreview
                  ? colors.primary40
                  : colors.secondary100,
              }}>
              Preview
            </Typography>
          </TouchableOpacity>
        }
      />
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.inputsContainer}
        scrollEnabled={false}
        extraHeight={132}
        extraScrollHeight={132}>
        {selectedAsset && (
          <AccountAsset
            item={selectedAsset}
            showFullBalance
            fullBalance={`~ $${fullBalance}`}
          />
        )}
        <SimpleTextInput
          onChangeText={setAmount}
          value={amount}
          label="Amount To Send"
          placeholder="0.00000000"
          keyboardType="decimal-pad"
          icon={
            <Typography type="smallTitleR" style={{ color: colors.primary40 }}>
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
          label="Memo (For exchanges)"
          placeholder="Enter a memo"
        />
        <Typography
          type="commonText"
          style={[styles.note, { color: colors.primary40 }]}>
          If you are sending to an exchange, be sure to include the memo the
          exchange provided so the STX is credited to your account
        </Typography>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SendForm;
