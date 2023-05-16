import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View } from 'react-native';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import GeneralButton from '../../components/shared/GeneralButton';
import { isIosApp } from '../../shared/helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'previewTransaction'>;

const PreviewTransaction: React.FC<Props> = ({
  route: {
    params: { selectedFee, amount, selectedAsset, memo, recipient },
  },
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { goBack, dispatch } = useNavigation();
  const {
    submittedTransactions,
    setSubmittedTransactions,
    refreshTransactionsList,
  } = useTransactions();
  const { selectedAccountState: account, sendTransaction } = useAccounts();
  const [isSending, toggleSending] = useState<boolean>(false);

  const handleSendPress = () => {
    toggleSending(true);

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

    sendTransaction(
      selectedAsset,
      recipient,
      Number(amount),
      Number(selectedFee.fee ?? 0),
      memo,
    ).then(result => {
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

      toggleSending(false);
      dispatch(StackActions.pop(2));
    });
  };

  const ctaButton = (
    <GeneralButton
      loading={isSending}
      canGoNext={!isSending}
      onClick={handleSendPress}
      text={'Send'}
    />
  );
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        title="Preview"
        containerStyles={styles.header}
        leftComponent={<HeaderBack text="Back" hasChevron onPress={goBack} />}
        rightComponent={isIosApp && ctaButton}
      />
      <View style={styles.inputsContainer}>
        {account && selectedAsset && (
          <PreviewTransfer
            sender={account?.address}
            recipient={recipient}
            memo={memo}
            amount={Number(amount)}
            selectedFee={selectedFee}
            selectedAsset={selectedAsset}
          />
        )}
        <View style={[styles.horizontalFill, styles.centerItems]}>
          <WarningIcon width={20} height={20} fill={colors.primary60} />
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
        {!isIosApp && ctaButton}
      </View>
    </SafeAreaView>
  );
};

export default PreviewTransaction;
