/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {doDeleteAuthRequest} from '../../store/onboarding/actions';
import {UsernameCard} from '../../components/UsernameCard';
import {Identity} from '@stacks/keychain';
import {
  selectAppName,
  selectFullAppIcon,
} from '../../store/onboarding/selectors';

interface Props {
  modalVisible: boolean;
  identities: Identity[];
}

const AuthModal: React.FC<Props> = ({modalVisible, identities}) => {
  const dispatch = useDispatch();
  const name = useSelector(selectAppName);
  const icon = useSelector(selectFullAppIcon);
  const dismiss = useCallback(() => {
    dispatch(doDeleteAuthRequest());
  }, []);
  return (
    <>
      <Modal animationType="slide" visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.contentWarning}>
              <View style={styles.imageContainer}>
                <Image source={{uri: icon}} style={styles.image} />
                <Text style={styles.warningText}>
                  Note: {name} is asking for your permissions to generate
                  private key to use in their apps
                </Text>
              </View>
            </View>
            <Text style={styles.blockstackText}>
              Choose an ID to use in {name}
            </Text>
            <FlatList
              ListHeaderComponent={
                <Text style={styles.headerText}>Your IDs</Text>
              }
              style={styles.flatlist}
              data={identities}
              renderItem={({item, index}) => (
                <UsernameCard
                  dismiss={dismiss}
                  identity={item}
                  identityIndex={index}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity style={[styles.loginButton]} onPress={dismiss}>
              <Text style={styles.buttonText}>Cancel Authentication</Text>
              <Image
                source={require('../../assets/cancel.png')}
                style={styles.cancel}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AuthModal;
