import React, { useContext } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { CustomBackdrop } from '../shared/customBackdrop';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import useNetwork from '../../hooks/useNetwork/useNetwork';
import { AvailableNetworks } from '../../models/network';
import { Portal } from '@gorhom/portal';
import Toast from 'react-native-toast-message';
import { TOAST_VISIBILITY_TIME, useGetToastOffset } from '../../shared/layout';
import styles from './styles';
import RadioButton from './RadioButton';

interface ChangeNetworkBottomSheetProps {
  bottomSheetRef: React.Ref<BottomSheet>;
  onCancel: () => void;
  onChange: () => void;
}

const ChangeNetworkBottomSheet: React.FC<ChangeNetworkBottomSheetProps> = ({
  bottomSheetRef,
  onCancel,
  onChange,
}) => {
  const snapPoints = React.useMemo(() => ['60%'], []);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { currentNetwork, setCurrentNetworkKey } = useNetwork();
  const topOffset = useGetToastOffset();

  const switchToMainnet = () => {
    setCurrentNetworkKey(AvailableNetworks.MAINNET);
    onCancel();
    Toast.show({
      type: 'success',
      text1: 'You’re viewing Mainnet Network',
      visibilityTime: TOAST_VISIBILITY_TIME,
      topOffset,
    });
    onChange();
  };

  const switchToTestnet = () => {
    setCurrentNetworkKey(AvailableNetworks.TESTNET);
    onCancel();
    Toast.show({
      type: 'success',
      text1: 'You’re viewing Testnet Network',
      visibilityTime: TOAST_VISIBILITY_TIME,
      topOffset,
    });
    onChange();
  };

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        handleComponent={null}
        backdropComponent={CustomBackdrop}
        enablePanDownToClose>
        <Header
          title="Change Network"
          containerStyles={styles.header}
          leftComponent={
            <HeaderBack
              text="Cancel"
              onPress={onCancel}
              textColor={colors.secondary100}
            />
          }
        />
        <View style={styles.container}>
          <TouchableOpacity
            onPress={switchToMainnet}
            disabled={currentNetwork.name === AvailableNetworks.MAINNET}
            style={[
              styles.switchNetworkButton,
              styles.switchMainnetButtonSpacing,
            ]}>
            <Typography type="buttonText">Mainnet</Typography>
            <RadioButton
              selected={currentNetwork.name === AvailableNetworks.MAINNET}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={switchToTestnet}
            disabled={currentNetwork.name === AvailableNetworks.TESTNET}
            style={styles.switchNetworkButton}>
            <Typography type="buttonText">Testnet</Typography>
            <RadioButton
              selected={currentNetwork.name === AvailableNetworks.TESTNET}
            />
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </Portal>
  );
};

export default ChangeNetworkBottomSheet;
