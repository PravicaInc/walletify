import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
  Image,
  View,
} from 'react-native';
import {Identity} from '@stacks/keychain';
import {doFinishSignIn} from '../store/onboarding/actions';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {useCardsIdentity} from '../hooks/useCardsIdentity';

interface Props {
  identity: Identity;
  identityIndex: number;
  dismiss: () => void;
}
export const UsernameCard: React.FC<Props> = (props: Props) => {
  const {identity, identityIndex, dismiss} = props;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const cardIdentity = useCardsIdentity(identity.defaultUsername);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setIsLoading(true);
          dispatch(doFinishSignIn({identityIndex}, dismiss));
        }}
        style={[
          styles.item,
          {
            backgroundColor: cardIdentity.backgroundColor,
          },
        ]}>
        <View style={styles.row}>
          <View style={{justifyContent: 'space-between', height: '100%'}}>
            <Text style={styles.blockstackText}>{cardIdentity.text}</Text>
            <View>
              <Text style={styles.blockstackIdText}>
                {identity.defaultUsername?.split('.')[0]}
              </Text>
              <Text style={styles.blockstackIdText}>
                {identity.defaultUsername?.replace(
                  identity.defaultUsername?.split('.')[0],
                  '',
                )}
              </Text>
            </View>
          </View>
          <View style={styles.rowTwo}>
            <Image style={styles.image} source={cardIdentity.image} />
            {isLoading ? (
              <ActivityIndicator size={'small'} color={'white'} />
            ) : (
              <Image
                style={styles.icon}
                resizeMode={'cover'}
                source={require('../assets/login.png')}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 15,
    padding: 19,
    height: 100,
    marginBottom: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {height: 1, width: 0},
    shadowOpacity: 0.75,
    shadowRadius: 1,
  },
  blockstackText: {
    color: '#FFF',
    opacity: 0.6,
    fontSize: 12,
  },
  blockstackIdText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adresses: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 15,
    resizeMode: 'contain',
  },
  address: {
    color: '#2C3E50',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  rowTwo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  image: {
    width: 41,
    resizeMode: 'contain',
  },
});
