import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import { ListRenderItem, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AccountListItem from '../../components/Accounts/AccountListItem';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import Add from '../../assets/images/add.svg';
import AddAccount from '../../assets/images/manageAccounts/addAccount.svg';
import styles from './styles';
import { FlatList } from 'react-native-gesture-handler';
import { AccountWithAddress } from '../../models/account';

const ManageAccounts: React.FC = () => {
  const {
    walletAccounts,
    selectedAccountIndexState,
    switchAccount,
    createAccount,
  } = useAccounts();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { dispatch } = useNavigation();

  const handlePressAccount = (accountIndex: number) => {
    switchAccount(accountIndex);
  };

  const handleAddAccount = () => {
    createAccount();
  };

  const handleGoBack = () => dispatch(StackActions.pop());

  const renderAccount: ListRenderItem<AccountWithAddress> = useCallback(
    ({ item }) => {
      return (
        <AccountListItem
          account={item}
          onPressAccount={() => handlePressAccount(item.index)}
          isSelected={item.index === selectedAccountIndexState}
          key={item.address}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAccountIndexState],
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <View style={styles.screenContentContainer}>
        <Header
          leftComponent={
            <HeaderBack onPress={handleGoBack} hasChevron text="Back" />
          }
          rightComponent={
            <TouchableOpacity style={styles.createIdentityButton}>
              <Add />
              <Typography
                type="buttonText"
                style={[
                  styles.createIdentityButtonText,
                  { color: colors.secondary100 },
                ]}>
                Create Identity
              </Typography>
            </TouchableOpacity>
          }
        />
        <Typography
          type="commonText"
          style={[
            styles.accountsListTitle,
            {
              color: colors.primary40,
            },
          ]}>
          Your Accounts
        </Typography>
        <FlatList
          data={walletAccounts}
          keyExtractor={account => account.address}
          renderItem={renderAccount}
          contentContainerStyle={styles.accountsList}
        />
      </View>
      <TouchableOpacity
        onPress={handleAddAccount}
        style={styles.addAccountButton}>
        <AddAccount />
        <Typography
          type="buttonText"
          style={[styles.addAccountButtonText, { color: colors.secondary100 }]}>
          Add Account
        </Typography>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManageAccounts;
