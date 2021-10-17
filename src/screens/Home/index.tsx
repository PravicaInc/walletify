import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { MyText } from '../../components/shared/myText';
import Wise from '../../assets/wise.svg';

export const Home: React.FC = () => {
  return (
    <View style={styles.container}>
      <Wise />
      <MyText type="bigTitle">It Works</MyText>
    </View>
  );
};
