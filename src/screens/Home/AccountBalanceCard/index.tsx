import React, { useContext, useMemo, useRef, useCallback } from 'react';
import { TouchableHighlight, View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import UpArrow from '../../../assets/images/upArrow.svg';
import DownArrow from '../../../assets/images/downArrow.svg';
import styles from './styles';
import { valueFromBalance } from '../../../shared/balanceUtils';
import { useAtomValue } from 'jotai/utils';
import { currentAccountAvailableStxBalanceState } from '../../../hooks/useAccounts/accountsStore';
import { useStxPriceValue } from '../../../hooks/useStxPrice/useStxPrice';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ReceiveBottomSheet from '../../../components/ReceiveBottomSheet';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useAssets } from '../../../hooks/useAssets/useAssets';
import BigNumber from 'bignumber.js';

const AccountBalanceCard: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { selectedAccountState: account } = useAccounts();
  const { selectedAccountAssets: assets } = useAssets();
  const { dispatch } = useNavigation();
  const balance = useAtomValue(currentAccountAvailableStxBalanceState);
  const price = useStxPriceValue();

  const receiveRef = useRef<BottomSheetModal>(null);

  const handlePresentSend = useCallback(() => {
    const stxAsset = assets.find(a => a.name === 'STX');
    if (!stxAsset) {
      return;
    }
    dispatch(
      StackActions.push('SendForm', {
        asset: {
          ...stxAsset,
          value: valueFromBalance(balance || new BigNumber(0), 'stx'),
        },
      }),
    );
  }, [account, assets, balance]);

  const handlePresentReceive = useCallback(() => {
    receiveRef.current?.snapToIndex(0);
  }, []);

  const amountValue = useMemo(() => {
    if (balance) {
      return valueFromBalance(balance.multipliedBy(price), 'stx', {
        fixedDecimals: false,
      });
    }
    return NaN;
  }, [balance, price]);

  const balanceAvailable = balance !== undefined;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <Typography type="commonText" style={{ color: colors.primary40 }}>
        Total STX Balance in USD
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
          style={[styles.currency, { color: colors.text }]}>
          USD
        </Typography>
      </View>
      <View style={styles.balanceActionsContainer}>
        <TouchableHighlight
          onPress={handlePresentSend}
          underlayColor={colors.primaryButtonClick}
          style={[
            styles.balanceActionButton,
            styles.sendButton,
            {
              backgroundColor: colors.primary100,
            },
          ]}>
          <>
            <UpArrow fill={colors.white} />
            <Typography
              type="buttonText"
              style={[styles.balanceActionButtonText, { color: colors.white }]}>
              Send
            </Typography>
          </>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={handlePresentReceive}
          underlayColor={colors.primaryButtonClick}
          style={[
            styles.balanceActionButton,
            {
              backgroundColor: colors.primary100,
            },
          ]}>
          <>
            <DownArrow fill={colors.white} />
            <Typography
              type="buttonText"
              style={[styles.balanceActionButtonText, { color: colors.white }]}>
              Receive
            </Typography>
          </>
        </TouchableHighlight>
        <ReceiveBottomSheet ref={receiveRef} />
      </View>
    </View>
  );
};
export default AccountBalanceCard;
