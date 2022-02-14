import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useRef } from 'react';
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
import BottomSheet from '@gorhom/bottom-sheet';
import CreateIdentityBottomSheet from '../../components/CreateIdentityBottomSheet';
import { OptionsPick } from '../../components/OptionsPick';
import WarningIcon from '../../components/shared/WarningIcon';
import AccountAvatar from '../../components/shared/AccountAvatar';

const ManageAccounts: React.FC = () => {
  const {
    walletAccounts,
    selectedAccountIndexState,
    selectedAccountState,
    switchAccount,
    createAccount,
  } = useAccounts();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { dispatch } = useNavigation();

  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const confirmIdentityCreationModal = useRef<BottomSheet>(null);
  const createIdentityUnAvailableModal = useRef<BottomSheet>(null);

  const handlePressCreateIdentity = useCallback(() => {
    if (selectedAccountState?.username) {
      createIdentityUnAvailableModal.current?.expand();
    } else {
      confirmIdentityCreationModal.current?.expand();
    }
  }, [selectedAccountState]);

  const handleConfirmCreateIdentity = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex(0);
  }, []);

  const handleCancelCreateIdentity = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

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
      <Header
        containerStyles={{ paddingLeft: 20 }}
        leftComponent={
          <HeaderBack onPress={handleGoBack} hasChevron text="Back" />
        }
        rightComponent={
          <TouchableOpacity
            style={styles.createIdentityButton}
            onPress={handlePressCreateIdentity}>
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
      <View style={styles.screenContentContainer}>
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
          showsVerticalScrollIndicator={false}
          renderItem={renderAccount}
          contentContainerStyle={styles.accountsList}
        />
        <TouchableOpacity
          onPress={handleAddAccount}
          style={styles.addAccountButton}>
          <AddAccount />
          <Typography
            type="buttonText"
            style={[
              styles.addAccountButtonText,
              { color: colors.secondary100 },
            ]}>
            Add Account
          </Typography>
        </TouchableOpacity>
      </View>
      <OptionsPick
        ref={confirmIdentityCreationModal}
        title="Create Unique Username"
        subTitle="Make sure you want to create a name for this account, because it is not a reversible process."
        userIcon={
          <AccountAvatar
            diameter={65}
            accountName={`Account ${selectedAccountIndexState + 1}`}
          />
        }
        username={`Account ${selectedAccountIndexState + 1}`}
        options={[
          {
            label: 'Yes, Create',
            onClick: handleConfirmCreateIdentity,
          },
        ]}
      />
      <OptionsPick
        ref={createIdentityUnAvailableModal}
        userIcon={
          <WarningIcon width={65} height={65} fill={colors.warning100} />
        }
        username="Warning"
        title="Account already Have a Username"
        subTitle="The Account you chose has registered a name already you can choose another one which doesn't have a name yet"
        options={[
          {
            label: 'ok',
            onClick: async () =>
              createIdentityUnAvailableModal.current?.close(),
          },
        ]}
      />
      <CreateIdentityBottomSheet
        bottomSheetRef={bottomSheetModalRef}
        onCancel={handleCancelCreateIdentity}
      />
    </SafeAreaView>
  );
};

export default ManageAccounts;
