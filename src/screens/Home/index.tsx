import React, { useContext } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

import AccountAvatar from '../../components/shared/AccountAvatar';

import Wise from '../../assets/wise.svg';

import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/shared/Header';
import { ThemeContext } from '../../contexts/theme';
import { styles } from './styles';

const Home: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { dispatch } = useNavigation();

  const goToSettings = () => dispatch(StackActions.push('Settings'));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Header
          leftComponent={<Wise />}
          rightComponent={
            <TouchableOpacity onPress={goToSettings}>
              <AccountAvatar accountIndex={3} diameter={40} hasAura={true} />
            </TouchableOpacity>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
