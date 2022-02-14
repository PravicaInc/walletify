import React, { useContext, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { CustomBackdrop } from '../shared/customBackdrop';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import useNetwork from '../../hooks/useNetwork/useNetwork';
import { selectedNetworkKey } from '../../hooks/useNetwork/networkStore';
import { AvailableNetworks } from '../../models/network';

interface ChangeNetworkBottomSheetProps {
  bottomSheetRef: React.Ref<BottomSheet>;
  onCancel: () => void;
}

function RadioButton(props) {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <View
      style={[
        {
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: colors.primary100,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}>
      {props.selected ? (
        <View
          style={{
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: colors.primary100,
          }}
        />
      ) : null}
    </View>
  );
}

const ChangeNetworkBottomSheet: React.FC<ChangeNetworkBottomSheetProps> = ({
  bottomSheetRef,
  onCancel,
}) => {
  const snapPoints = React.useMemo(() => ['50%'], []);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { currentNetwork, setCurrentNetworkKey } = useNetwork();

  const switchToMainnet = () => {
    setCurrentNetworkKey(AvailableNetworks.MAINNET);
  };

  const switchToTestnet = () => {
    setCurrentNetworkKey(AvailableNetworks.MAINNET);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      handleComponent={null}
      backdropComponent={CustomBackdrop}
      enablePanDownToClose>
      <Header
        title="Change Network"
        leftComponent={
          <HeaderBack
            text="Cancel"
            onPress={onCancel}
            textColor={colors.secondary100}
          />
        }
      />
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={switchToMainnet}
          disabled={currentNetwork.name === AvailableNetworks.MAINNET}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}>
          <Typography type="buttonText">Mainnet</Typography>
          <RadioButton
            selected={currentNetwork.name === AvailableNetworks.MAINNET}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={switchToTestnet}
          disabled={currentNetwork.name === AvailableNetworks.TESTNET}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Typography type="buttonText">Testnet</Typography>
          <RadioButton
            selected={currentNetwork.name === AvailableNetworks.TESTNET}
          />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default ChangeNetworkBottomSheet;
