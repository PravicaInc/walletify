import React, { useContext, useMemo, useRef, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import UpArrow from '../../../assets/images/upArrow.svg';
import DownArrow from '../../../assets/images/downArrow.svg';
import styles from './styles';
import { valueFromBalance } from '../../../shared/balanceUtils';
import { withSuspense } from '../../../components/shared/WithSuspense';
import { useAtomValue } from 'jotai/utils';
import { currentAccountAvailableStxBalanceState } from '../../../hooks/useAccounts/accountsStore';
import { useStxPriceValue } from '../../../hooks/useStxPrice/useStxPrice';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SendBottomSheet from '../../../components/SendBottomSheet';
import ReceiveBottomSheet from '../../../components/ReceiveBottomSheet';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';

const AccountBalanceCard: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { selectedAccountState: account } = useAccounts();
  const balance = useAtomValue(currentAccountAvailableStxBalanceState);
  const price = useStxPriceValue();

  const sendRef = useRef<BottomSheetModal>(null);
  const receiveRef = useRef<BottomSheetModal>(null);

  const handlePresentSend = useCallback(() => {
    sendRef.current?.snapToIndex(0);
  }, []);

  const handlePresentReceive = useCallback(() => {
    receiveRef.current?.snapToIndex(0);
  }, []);

  const amount = useMemo(() => {
    if (balance) {
      return valueFromBalance(balance, 'stx');
    }
    return NaN;
  }, [balance]);
  const amountValue = (+amount * price).toFixed(2);

  const balanceAvailable = balance !== undefined;
  const buttonsDisabled = account === undefined;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <Typography type="commonText" style={{ color: colors.primary40 }}>
        Total STX Balance:
      </Typography>
      <View style={styles.balanceContainer}>
        {balanceAvailable && (
          <Typography type="hugeText" style={{ color: colors.primary100 }}>
            {`$${amountValue}`}
          </Typography>
        )}
        {!balanceAvailable && (
          <ContentLoader
            speed={2}
            width={200}
            height={40}
            viewBox="0 0 200 40"
            backgroundColor={colors.darkgray}
            foregroundColor={colors.white}>
            <Rect x="0" y="8" rx="3" ry="3" width="88" height="6" />
            <Rect x="0" y="26" rx="3" ry="3" width="52" height="6" />
          </ContentLoader>
        )}
        <Typography
          type="bigTitleR"
          style={[styles.currency, { color: colors.primary40 }]}>
          USD
        </Typography>
      </View>
      <View style={styles.balanceActionsContainer}>
        <TouchableOpacity
          onPress={handlePresentSend}
          activeOpacity={0.9}
          disabled={buttonsDisabled}
          style={[
            styles.balanceActionButton,
            styles.sendButton,
            {
              backgroundColor: buttonsDisabled
                ? colors.primary40
                : colors.primary100,
            },
          ]}>
          <UpArrow />
          <Typography
            type="buttonText"
            style={[styles.balanceActionButtonText, { color: colors.white }]}>
            Send
          </Typography>
        </TouchableOpacity>
        <SendBottomSheet
          ref={sendRef}
          fullBalance={amountValue}
          price={price}
        />
        <TouchableOpacity
          onPress={handlePresentReceive}
          activeOpacity={0.9}
          disabled={buttonsDisabled}
          style={[
            styles.balanceActionButton,
            {
              backgroundColor: buttonsDisabled
                ? colors.primary40
                : colors.primary100,
            },
          ]}>
          <DownArrow />
          <Typography
            type="buttonText"
            style={[styles.balanceActionButtonText, { color: colors.white }]}>
            Receive
          </Typography>
        </TouchableOpacity>
        <ReceiveBottomSheet ref={receiveRef} />
      </View>
    </View>
  );
};
export default withSuspense(AccountBalanceCard);
