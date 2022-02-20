import React, { useCallback, useContext, useMemo, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { ThemeContext } from '../../contexts/Theme/theme';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import logger from '../../shared/logger';
import { withSuspense } from '../shared/WithSuspense';
import { Typography } from '../shared/Typography';
import { CustomBackdrop } from '../shared/customBackdrop';
import { useBns } from '../../hooks/bns/useBns';
import User from '../../assets/images/manageAccounts/user.svg';
import WarningIcon from '../../components/shared/WarningIcon';
import styles from './styles';

interface CreateIdentityBottomSheetProps {
  bottomSheetRef: React.Ref<BottomSheet>;
  onCancel: () => void;
}

const CreateIdentityBottomSheet: React.FC<CreateIdentityBottomSheetProps> = ({
  bottomSheetRef,
  onCancel,
}) => {
  const [userName, setUserName] = useState<string>('');
  const snapPoints = React.useMemo(() => ['95%'], []);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const {
    registerUserSubdomain,
    isRegistering,
    registrationError,
    setRegistrationError,
  } = useBns();

  const isCreateDisabled = useMemo(() => userName.length === 0, [userName]);

  const handleCreateName = useCallback(async () => {
    try {
      await registerUserSubdomain(userName, handleCancelCreateIdentity);
    } catch (err) {
      logger.error(err);
    }
  }, [userName]);

  const handleCancelCreateIdentity = () => {
    setUserName('');
    setRegistrationError('');
    onCancel();
  };

  const onUserNameChange = useCallback((name: string) => {
    setUserName(name);
    setRegistrationError('');
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      handleComponent={null}
      snapPoints={snapPoints}
      index={-1}
      backdropComponent={CustomBackdrop}
      enablePanDownToClose>
      <View style={styles.container}>
        <Header
          title="Create Identity"
          titleColor={colors.primary100}
          leftComponent={
            <HeaderBack
              isCancel
              onPress={handleCancelCreateIdentity}
              hasChevron={false}
              textColor={colors.secondary100}
            />
          }
          rightComponent={
            <TouchableOpacity
              onPress={handleCreateName}
              disabled={isCreateDisabled}>
              {isRegistering ? (
                <ActivityIndicator />
              ) : (
                <Typography
                  type="buttonText"
                  style={{
                    color: isCreateDisabled
                      ? colors.primary40
                      : colors.secondary100,
                  }}>
                  Create
                </Typography>
              )}
            </TouchableOpacity>
          }
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
              <Typography
                type="smallText"
                style={[{ color: colors.failed100 }]}>
                {registrationError}
              </Typography>
            </View>
          )}
        </View>
      </View>
    </BottomSheet>
  );
};

export default withSuspense(CreateIdentityBottomSheet);
