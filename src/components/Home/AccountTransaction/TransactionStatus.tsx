import React, { useContext } from 'react';
import { View } from 'react-native';
import TransactionSuccess from '../../../assets/images/Home/transactionSuccess.svg';
import TransactionFailed from '../../../assets/images/Home/transactionFailed.svg';
import TransactionMicroBlock from '../../../assets/images/Home/transactionMicroBlock.svg';
import TransactionPending from '../../../assets/images/Home/transactionPending.svg';
import { StacksTransactionStatus } from '../../../models/transactions';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';

const TransactionStatus: React.FC<{
  status: StacksTransactionStatus;
}> = ({ status }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const isPending = status === 'pending';
  const isFailed = !isPending && status !== 'success';
  if (isFailed) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TransactionFailed />
        <Typography
          type="commonText"
          style={{ color: colors.failed100, marginLeft: 5 }}>
          Failed
        </Typography>
      </View>
    );
  } else if (isPending) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TransactionPending />
        <Typography
          type="commonText"
          style={{ color: colors.warning100, marginLeft: 5 }}>
          Pending
        </Typography>
      </View>
    );
  } else if (status === 'success') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TransactionSuccess />
        <Typography
          type="commonText"
          style={{ color: colors.confirm100, marginLeft: 5 }}>
          Confirmed
        </Typography>
      </View>
    );
  } else {
    return <View />;
  }
};

export default TransactionStatus;
