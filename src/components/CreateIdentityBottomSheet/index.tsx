import React, { useCallback, useContext, useMemo, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { ThemeContext } from '../../contexts/Theme/theme';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { TextInput, View } from 'react-native';
import logger from '../../shared/logger';
import { withSuspense } from '../shared/WithSuspense';
import { Typography } from '../shared/Typography';
import { CustomBackdrop } from '../shared/customBackdrop';
import { useBns } from '../../hooks/bns/useBns';
import User from '../../assets/images/manageAccounts/user.svg';
import WarningIcon from '../../components/shared/WarningIcon';
import styles from './styles';
import GeneralButton from '../shared/GeneralButton';
import { isIosApp } from '../../shared/helpers';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AccountWithAddress } from '../../models/account';

interface CreateIdentityBottomSheetProps {
  bottomSheetRef: React.Ref<BottomSheet>;
  onCancel: () => void;
}

const CreateIdentityBottomSheet: React.FC<CreateIdentityBottomSheetProps> = ({
  bottomSheetRef,
  onCancel,
}) => {
  const snapPoints = React.useMemo(() => ['95%'], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      handleComponent={null}
      snapPoints={snapPoints}
      index={-1}
      backdropComponent={CustomBackdrop}
      enablePanDownToClose>
      <CreateIdentityBottomSheetInner onCancel={onCancel} />
    </BottomSheet>
  );
};

export default withSuspense(CreateIdentityBottomSheet);

interface IProps {
  onCancel: () => void;
}
type StackParamsList = {
  CreateIdentity: {
    selectedAccount?: AccountWithAddress;
  };
};
export const CreateIdentityBottomSheetInner: React.FC<IProps> = ({
  onCancel,
}) => {
  const {
    params: { selectedAccount },
  } = useRoute<RouteProp<StackParamsList, 'CreateIdentity'>>();
  const [userName, setUserName] = useState<string>('');
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { goBack } = useNavigation();
  const {
    registerUserSubdomain,
    isRegistering,
    registrationError,
    setRegistrationError,
  } = useBns(selectedAccount);
  const isEdit = !!selectedAccount;

  const isCreateDisabled = useMemo(() => userName.length === 0, [userName]);

  const handleCreateName = useCallback(async () => {
    try {
      await registerUserSubdomain(userName, handleCancelCreateIdentity).then(
        () => {
          if (isEdit) {
            goBack();
          }
        },
      );
    } catch (err) {
      logger.error(err);
    }
  }, [userName, isEdit]);

  const handleCancelCreateIdentity = () => {
    if (isEdit) {
      goBack();
    } else {
      onCancel();
    }
    setUserName('');
    setRegistrationError('');
  };

  const onUserNameChange = useCallback((name: string) => {
    setUserName(name);
    setRegistrationError('');
  }, []);

  const ctaButton = (
    <GeneralButton
      loading={isRegistering}
      canGoNext={!isCreateDisabled}
      onClick={handleCreateName}
      text={'Create'}
    />
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        title="Create Identity"
        titleColor={colors.primary100}
        leftComponent={
          <HeaderBack
            text={isEdit ? 'Back' : 'Cancel'}
            onPress={handleCancelCreateIdentity}
            hasChevron={isEdit}
            textColor={colors.secondary100}
          />
        }
        rightComponent={isIosApp && ctaButton}
      />
      <View style={styles.contentContainer}>
        <User />
        <Typography
          type="bigTitle"
          style={[styles.title, { color: colors.primary100 }]}>
          Choose a Username
        </Typography>
        <Typography
          type="commonText"
          style={[styles.description, { color: colors.primary40 }]}>
          Create your decentralized identity using Blockchain Naming System of
          Stacks.
        </Typography>
        <Typography
          type="commonText"
          style={[styles.inputHeader, { color: colors.primary100 }]}>
          Your Identity’s Username
        </Typography>
        <View
          style={[
            styles.userNameInputContainer,
            {
              borderColor: isCreateDisabled
                ? colors.primary20
                : registrationError
                ? colors.failed100
                : colors.primary100,
            },
          ]}>
          <TextInput
            autoCapitalize="none"
            editable={!isRegistering}
            autoCompleteType="off"
            autoCorrect={false}
            value={userName}
            onChangeText={onUserNameChange}
            style={styles.usernameInput}
          />
          <Typography
            type="smallTitleR"
            style={[styles.userNameInputSuffix, { color: colors.primary40 }]}>
            .id.stx
          </Typography>
        </View>
        {registrationError.length > 0 && userName.length > 0 && (
          <View style={styles.userNameErrorContainer}>
            <WarningIcon
              fill={colors.failed100}
              width={10}
              height={10}
              style={styles.userNameErrorIcon}
            />
            <Typography type="smallText" style={[{ color: colors.failed100 }]}>
              {registrationError}
            </Typography>
          </View>
        )}
        {!isIosApp && ctaButton}
      </View>
    </View>
  );
};
