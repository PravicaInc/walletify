import React, { useContext, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import GeneralButton from '../../components/shared/GeneralButton';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';
import { useUnlockWallet } from '../../hooks/useWallet/useUnlockWallet';
import EnterPasswordModal from '../../components/EnterPasswordModal';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';

const RecoverSeedPhrase: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { dispatch } = useNavigation();
  const [decryptedSeedPhrase, setDecryptedSeedPhrase] = useState<
    string | undefined
  >();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const handlePasswordModalAction = (password: string, seedPhrase: string) => {
    bottomSheetModalRef.current?.close();
    setDecryptedSeedPhrase(seedPhrase);
  };

  const { validateUserCredentials } = useUnlockWallet(
    handlePasswordModalAction,
    bottomSheetModalRef,
  );

  const handleGoBack = () => dispatch(StackActions.pop());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <EnterPasswordModal
        ref={bottomSheetModalRef}
        handleNextAction={handlePasswordModalAction}
      />
      <Header
        leftComponent={
          <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
        }
      />
      <View style={styles.contentContainer}>
        <View style={styles.topContent}>
          <LockedShield />
          <Typography type="bigTitle" style={styles.title}>
            Recover Your Seed Phrase
          </Typography>
          <Typography
            type="commonText"
            style={[styles.description, { color: colors.primary60 }]}>
            This feature allows you to recover your seed phrase in case you need
            it.
          </Typography>
        </View>
        {decryptedSeedPhrase ? (
          <SeedPhraseGrid phrase={decryptedSeedPhrase} />
        ) : (
          <View style={styles.bottomContent}>
            <GeneralButton
              type={'activePrimary'}
              onPress={validateUserCredentials}
              style={styles.actionButtonTop}>
              View Seed Phrase
            </GeneralButton>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default RecoverSeedPhrase;
