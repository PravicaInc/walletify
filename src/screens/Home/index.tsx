/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {FlatList, View} from 'react-native';
import {styles} from './styles';
import {useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {IdentityCard} from '../../components/IdentityCard';
import {HeaderComponent} from '../../components/Header';
import {sortIdentities} from '../../hooks/useCardsIdentity';

const Home: React.FC = () => {
  const wallet = useSelector(selectCurrentWallet);
  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Identities'}
          imageSource={require('../../assets/fingerprint.png')}
        />
        <FlatList
          data={sortIdentities(wallet?.identities || [])}
          renderItem={({item}) => <IdentityCard identity={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
};

export default Home;
