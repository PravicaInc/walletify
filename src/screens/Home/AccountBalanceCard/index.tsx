import React, {
  Suspense,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import ContentLoader from 'react-content-loader/native';
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

const AccountBalanceCard: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
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
    return 0;
  }, [balance]);
  const amountValue = (+amount * price).toFixed(2);

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
        <Suspense fallback={<ContentLoader />}>
          <Typography type="hugeText" style={{ color: colors.primary100 }}>
            {`$${amountValue}`}
          </Typography>
        </Suspense>
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
          style={[
            styles.balanceActionButton,
            styles.sendButton,
            {
              backgroundColor: colors.primary100,
            },
          ]}>
          <UpArrow />
          <Typography
            type="buttonText"
            style={[styles.balanceActionButtonText, { color: colors.white }]}>
            Send
          </Typography>
        </TouchableOpacity>
        <Suspense fallback={<ContentLoader />}>
          <SendBottomSheet
            ref={sendRef}
            fullBalance={amountValue}
            price={price}
          />
        </Suspense>
        <TouchableOpacity
          onPress={handlePresentReceive}
          activeOpacity={0.9}
          style={[
            styles.balanceActionButton,
            {
              backgroundColor: colors.primary100,
            },
          ]}>
          <DownArrow />
          <Typography
            type="buttonText"
            style={[styles.balanceActionButtonText, { color: colors.white }]}>
            Receive
          </Typography>
        </TouchableOpacity>
        <Suspense fallback={<ContentLoader />}>
          <ReceiveBottomSheet ref={receiveRef} />
        </Suspense>
      </View>
    </View>
  );
};
export default withSuspense(AccountBalanceCard, <ContentLoader />);
