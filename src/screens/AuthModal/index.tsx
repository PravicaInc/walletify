/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {useDispatch} from 'react-redux';
import {doDeleteAuthRequest} from '../../store/onboarding/actions';
import {UsernameCard} from '../../components/UsernameCard';
import {Identity} from '@stacks/keychain';

interface Props {
  setModalVisible: (isVisible: boolean) => void;
  modalVisible: boolean;
  icon: string | undefined;
  name: string | undefined;
  identities: Identity[];
}

const AuthModal: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const {modalVisible, setModalVisible, icon, name, identities} = props;
  const dismiss = useCallback(() => {
    dispatch(doDeleteAuthRequest());
    setModalVisible(!modalVisible);
  }, [modalVisible]);
  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ImageBackground
          source={require('../../assets/pravica-background.png')}
          style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.contentWarning}>
              <View style={styles.imageContainer}>
                <Image source={{uri: icon}} style={styles.image} />
              </View>
              <Text style={styles.warningText}>
                Note: Pravica is asking for your permissions to generate private
                key to use in their apps
              </Text>
            </View>
            <Text style={styles.blockstackText}>
              Choose an ID to use in {name}
            </Text>
            <FlatList
              ListHeaderComponent={
                <Text style={styles.headerText}>Your Stacks IDs</Text>
              }
              style={styles.flatlist}
              data={identities}
              renderItem={({index, item}) => (
                <UsernameCard dismiss={dismiss} identity={item} identityIndex={index} />
              )}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                <TouchableOpacity
                  style={[styles.loginButton]}
                  onPress={dismiss}>
                  <Text style={styles.buttonText}>Cancel Authentication</Text>
                  <Image
                    source={require('../../assets/cancel.png')}
                    style={styles.cancel}
                  />
                </TouchableOpacity>
              }
            />
          </View>
        </ImageBackground>
      </Modal>
    </>
  );
};

export default AuthModal;
