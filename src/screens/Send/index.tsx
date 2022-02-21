import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import Send from '../../components/SendBottomSheet/Send';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SendScreen'>;

const SendScreen: React.FC<Props> = ({
  route: {
    params: { fullBalance, price },
  },
}) => {
  const { dispatch } = useNavigation();
  return (
    <Send
      fullBalance={fullBalance}
      price={price}
      onCancel={() => dispatch(StackActions.pop())}
    />
  );
};

export default SendScreen;
