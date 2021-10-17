import React from 'react';
import { styles } from './styles';
import { MyText } from '../../components/shared/myText';
import Wise from '../../assets/wise.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Home: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Wise />
      <MyText type="bigTitle">It Works</MyText>
    </SafeAreaView>
  );
};
