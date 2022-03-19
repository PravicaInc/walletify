import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import PreviewTransfer from '../../components/PreviewTransfer';
import WarningIcon from '../../components/shared/WarningIcon';
import { SubmittedTransaction } from '../../models/transactions';
import { useTransactions } from '../../hooks/useTransactions/useTransactions';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import { AccountToken } from '../../models/account';

type StackParamsList = {
  PreviewTransaction: {
    amount: string;
    recipient: string;
    memo: string;
    dismissBottomSheet: () => void;
    selectedAsset: AccountToken;
  };
};
const PreviewTransaction: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { goBack } = useNavigation();
  const {
    params: { amount, selectedAsset, dismissBottomSheet, memo, recipient },
  } = useRoute<RouteProp<StackParamsList, 'PreviewTransaction'>>();
  const {
    submittedTransactions,
    setSubmittedTransactions,
    refreshTransactionsList,
  } = useTransactions();
  const {
    selectedAccountState: account,
    estimateTransactionFees,
    sendTransaction,
  } = useAccounts();
  const [fees, setFees] = useState<Number>(NaN);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSendPress = () => {
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
  };

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
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        title="Preview"
        leftComponent={
          <HeaderBack
            textColor={colors.secondary100}
            text="Back"
            hasChevron
            chevronColor={colors.secondary100}
            onPress={goBack}
          />
        }
        rightComponent={
          <TouchableOpacity disabled={isLoading} onPress={handleSendPress}>
            <Typography
              type="buttonText"
              style={{
                color: isLoading ? colors.primary40 : colors.secondary100,
              }}>
              Send
            </Typography>
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
            If you confirm this transaction it is not reversible. Make sure all
            arguments are correct.
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default PreviewTransaction;
