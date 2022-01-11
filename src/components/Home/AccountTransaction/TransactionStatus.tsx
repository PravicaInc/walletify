import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import TransactionSuccess from '../../../assets/images/Home/transactionSuccess.svg';
import TransactionFailed from '../../../assets/images/Home/transactionFailed.svg';
import TransactionMicroBlock from '../../../assets/images/Home/transactionMicroBlock.svg';
import TransactionPending from '../../../assets/images/Home/transactionPending.svg';
import { Tx } from '../../../models/transactions';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { statusFromTx } from '../../../shared/transactionUtils';

const TransactionStatus: React.FC<{
  transaction: Tx;
}> = ({ transaction }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const status = useMemo(() => statusFromTx(transaction), [transaction]);
  switch (status) {
    case 'success_microblock':
      return (
        <View style={styles.statusContainer}>
          <TransactionMicroBlock />
          <Typography
            type="commonText"
            style={[styles.statusText, { color: colors.confirm100 }]}>
            {status}
          </Typography>
        </View>
      );
    case 'success_anchor_block':
      return (
        <View style={styles.statusContainer}>
          <TransactionSuccess />
          <Typography
            type="commonText"
            style={[styles.statusText, { color: colors.confirm100 }]}>
            Confirmed
          </Typography>
        </View>
      );
    case 'pending':
      return (
        <View style={styles.statusContainer}>
          <TransactionPending />
          <Typography
            type="commonText"
            style={[styles.statusText, { color: colors.warning100 }]}>
            Pending
          </Typography>
        </View>
      );
    case 'failed':
      return (
        <View style={styles.statusContainer}>
          <TransactionFailed />
          <Typography
            type="commonText"
            style={[styles.statusText, { color: colors.failed100 }]}>
            Failed
          </Typography>
        </View>
      );
    default:
      return <View />;
  }
};

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 5,
  },
});

export default TransactionStatus;
