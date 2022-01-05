import React, { useCallback, useContext } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import NoActivity from '../../../assets/images/Home/noActivity.svg';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import activityTabStyles from './styles';
import { useTransactions } from '../../../hooks/useTransactions/useTransactions';
import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client';
import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import AccountTransaction from '../AccountTransaction';

const ActivityTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { accountTransactionsWithTransfers, mempoolTransactions } =
    useTransactions();

  const allTransactions = [
    ...mempoolTransactions,
    ...accountTransactionsWithTransfers,
  ];

  const EmptyActivity = useCallback(() => {
    return (
      <View style={activityTabStyles.emptyContainer}>
        <NoActivity />
        <Typography
          type="commonText"
          style={[
            activityTabStyles.emptyMessage,
            {
              color: colors.primary40,
            },
          ]}>
          No Activity Yet
        </Typography>
      </View>
    );
  }, []);

  const renderTransaction: ListRenderItem<
    AddressTransactionWithTransfers | MempoolTransaction
  > = useCallback(({ item }) => {
    return <AccountTransaction transaction={item} />;
  }, []);

  return (
    <FlatList
      data={allTransactions}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderTransaction}
      style={activityTabStyles.activityList}
      contentContainerStyle={activityTabStyles.activityListContent}
      ListEmptyComponent={EmptyActivity}
    />
  );
};

export default ActivityTab;
