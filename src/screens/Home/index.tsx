/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import {useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';

const Home: React.FC = () => {
  const {dispatch} = useNavigation();
  const wallet = useSelector(selectCurrentWallet);

  const logout = () => {
    resetNavigation(dispatch, 'Login');
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Text style={styles.blockstackText}>Blockstack ID</Text>
        <Text style={styles.blockstackIdText}>{item.defaultUsername}</Text>
        <View style={styles.adresses}>
          <Image
            source={require('../../assets/stacks.png')}
            style={styles.icon}
          />
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <View style={styles.adresses}>
          <Image
            source={require('../../assets/bitcoin.png')}
            style={styles.icon}
          />
          <Text style={styles.address}>{wallet?.firstBitcoinAddress}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/pravica-background.png')}
        style={styles.container}>
        <View style={styles.topHeader}>
          <Image
            style={styles.pravicaLogo}
            source={require('../../assets/login-header.png')}
          />
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.buttonText}>Logout</Text>
            <Image
              style={styles.logoutLogo}
              source={require('../../assets/logout.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sheetContainer}>
          <FlatList
            ListHeaderComponent={
              <Text style={styles.headerText}>Your IDs</Text>
            }
            style={{padding: 16}}
            data={wallet?.identities}
            renderItem={renderItem}
          />
        </View>
      </ImageBackground>
    </>
  );
};

export default Home;
