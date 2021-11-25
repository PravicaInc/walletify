import React, { useContext, useEffect } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AccountAvatar from '../../components/shared/AccountAvatar';
import { useWallet } from '../../hooks/useWallet/useWallet';
import Wise from '../../assets/wise.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/shared/Header';
import { ThemeContext } from '../../contexts/Theme/theme';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = (props: Props) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { dispatch } = useNavigation();

  const { restoreWallet } = useWallet();
  const { password, seedPhrase } = props.route.params;

  useEffect(() => {
    restoreWallet(seedPhrase, password);
  }, []);

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
