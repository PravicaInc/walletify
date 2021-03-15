import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Identity} from '@stacks/keychain';
import {doFinishSignIn} from '../store/onboarding/actions';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  identity: Identity;
  identityIndex: number;
}
export const UsernameCard: React.FC<Props> = (props: Props) => {
  const {identity, identityIndex} = props;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#D5D5D5', '#E3E3E3', '#FFFFFF']}
        style={styles.gradient}>
        <TouchableOpacity
          onPress={() => {
            setIsLoading(true);
            dispatch(doFinishSignIn({identityIndex}));
          }}
          style={styles.item}>
          <Text style={styles.blockstackIdText}>
            {identity.defaultUsername}
          </Text>
          {isLoading ? (
            <ActivityIndicator size={'small'} color={'black'} />
          ) : (
            <Image
              style={styles.icon}
              resizeMode={'cover'}
              source={require('../assets/right-arrow.png')}
            />
          )}
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 9,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  icon: {width: 25, height: 23},
  item: {
    padding: 20,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  blockstackIdText: {
    color: 'black',
    fontSize: 18,
  },
});
