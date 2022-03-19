import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AccountAsset from '../../components/Home/AccountAsset';
import SimpleTextInput from '../../components/shared/SimpleTextInput';
import ScanQrIcon from '../../assets/images/scanQr.svg';
import ScanQrBottomSheet from '../../components/ScanQrBottomSheet';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import { useAtomValue } from 'jotai/utils';
import { currentAccountAvailableStxBalanceState } from '../../hooks/useAccounts/accountsStore';
import { AccountToken } from '../../models/account';
import StxTokenIcon from '../../assets/images/stx.svg';
import {
  isTxMemoValid,
  microStxToStx,
  valueFromBalance,
} from '../../shared/balanceUtils';
import BigNumber from 'bignumber.js';
import { useStxPriceValue } from '../../hooks/useStxPrice/useStxPrice';
import { StackActions, useNavigation } from '@react-navigation/native';
import WarningIcon from '../../assets/images/note-icon.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePasswordField } from '../../hooks/common/usePasswordField';
import { FeesCalculations } from '../../components/FeesCalculations';
import { SelectedFee } from '../../shared/types';

const SendForm: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [selectedFee, setSelectedFee] = useState<SelectedFee>();
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
  const {
    handleChangeText: setMemo,
    error: memoError,
    input: memo,
  } = usePasswordField(
    async (inputValue: string) => {
      if (!isTxMemoValid(inputValue || '')) {
        throw Error('Memo must be less than 34-bytes');
      }
    },
    undefined,
    0,
  );
  const {
    handleChangeText: handleChangeRecipient,
    error: recipientError,
    input: recipient,
  } = usePasswordField(
    async (inputValue: string) => {
      if (!inputValue) {
        throw Error('Please add a recipient address');
      } else if (!inputValue.match('^[A-Z0-9]{40,}$')) {
        throw Error('Please add a valid recipient address');
      } else if (inputValue === account?.address) {
        throw Error("You can't send to your address.");
      }
    },
    undefined,
    0,
  );
  const {
    handleChangeText: handleChangeAmount,
    error: amountError,
    input: amount,
  } = usePasswordField(
    async (inputValue: string) => {
      if (String(+inputValue) !== inputValue || +inputValue <= -1) {
        throw Error('Please enter a valid amount');
      }
    },
    undefined,
    0,
  );
  const fullBalance = useMemo(() => {
    if (balance) {
      return valueFromBalance(balance.multipliedBy(price), 'stx', {
        fixedDecimals: false,
      });
    }
    return NaN;
  }, [balance, price]);
  const isEnoughBalance = microStxToStx(balance || '0').gt(
    Number(amount || '0') + Number(selectedFee?.fee || '0'),
  );
  const handleGoBack = useCallback(() => dispatch(StackActions.pop()), []);
  const handlePresentQrScan = useCallback(() => {
    qrScanRef.current?.snapToIndex(0);
  }, []);
  const handleGoToPreview = useCallback(() => {
    dispatch(
      StackActions.push('previewTransaction', {
        amount,
        recipient,
        memo,
        selectedAsset,
        selectedFee,
      }),
    );
  }, [amount, recipient, memo, selectedAsset]);
  const handleMaxClicked = useCallback(() => {
    handleChangeAmount(
      microStxToStx(balance || '0')
        ?.minus(selectedFee?.fee || '0')
        .toString(),
    );
  }, [balance, selectedFee]);
  const isReadyForPreview =
    amount && recipient && !amountError && !recipientError && !memoError;
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        containerStyles={styles.header}
        title="Send"
        leftComponent={
          <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
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
        {!isEnoughBalance && (
          <View
            style={[
              styles.noBalanceCard,
              {
                backgroundColor: colors.failed10,
                borderColor: colors.failed100,
              },
            ]}>
            <WarningIcon
              width={15}
              height={15}
              fill={colors.failed100}
              fillOpacity={0}
              stroke={colors.failed100}
            />
            <View style={styles.noBalanceRow}>
              <Typography
                type="smallTextBold"
                style={{
                  color: colors.failed100,
                }}>
                Insufficient balance
              </Typography>
              <Typography
                type="smallText"
                style={{
                  color: colors.failed100,
                }}>
                {`You have not enough balance to proceed this transaction, \nAvailable Balance: ${microStxToStx(
                  balance || '0',
                )} STX`}
              </Typography>
            </View>
          </View>
        )}
        <SimpleTextInput
          onChangeText={handleChangeAmount}
          value={amount}
          label="Amount"
          placeholder="0.00000000"
          keyboardType="decimal-pad"
          icon={
            <TouchableOpacity activeOpacity={0.6} onPress={handleMaxClicked}>
              <Typography
                type="buttonText"
                style={{ color: colors.secondary100 }}>
                MAX
              </Typography>
            </TouchableOpacity>
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
              {`~ $${(+(amount || 0) * price).toFixed(2)}`}
            </Typography>
          }
          errorMessage={amountError}
        />
        <SimpleTextInput
          onChangeText={handleChangeRecipient}
          value={recipient}
          label="Recipient Address"
          placeholder="Enter an address"
          maxLength={50}
          icon={
            <TouchableOpacity onPress={handlePresentQrScan}>
              <ScanQrIcon stroke={colors.secondary100} />
            </TouchableOpacity>
          }
          errorMessage={recipientError}
        />
        <ScanQrBottomSheet
          ref={qrScanRef}
          setRecipient={handleChangeRecipient}
        />
        <SimpleTextInput
          onChangeText={setMemo}
          value={memo}
          label="Memo"
          placeholder="Enter a message (Optional)"
          errorMessage={memoError}
        />
        <View style={[styles.noteWrapper, { backgroundColor: colors.card }]}>
          <WarningIcon
            width={15}
            height={15}
            fill={colors.secondary100}
            fillOpacity={0.1}
            stroke={colors.secondary100}
          />
          <Typography
            type="commonText"
            style={[styles.note, { color: colors.primary40 }]}>
            If you are sending to an exchange, be sure to include the memo the
            exchange provided so the STX is credited to your account
          </Typography>
        </View>
        <FeesCalculations
          recipient={recipient}
          amount={amount}
          setSelectedFee={setSelectedFee}
          memo={memo}
          selectedFee={selectedFee}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SendForm;
