import React, {useRef} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {Settings} from './Settings';

interface Props {
  imageSource: ImageSourcePropType;
  title: string;
}

export const HeaderComponent: React.FC<Props> = (props: Props) => {
  const {imageSource, title} = props;
  const actionSheetRef = useRef<ActionSheet>();

  const settings = () => {
    actionSheetRef.current?.setModalVisible(true);
  };
  return (
    <>
      <View style={styles.topHeader}>
        <View style={styles.row}>
          <Image source={imageSource} />
          <TouchableOpacity onPress={settings} style={styles.logoutButton}>
            <Image
              style={styles.logoutLogo}
              source={require('../assets/settings.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>{title}</Text>
        <Settings actionSheetRef={actionSheetRef} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logoutLogo: {width: 24, height: 24, resizeMode: 'contain', marginLeft: 10},
  topHeader: {
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 30,
    marginBottom: 21,
    marginTop: 8,
    fontWeight: 'bold',
    color: 'black',
  },
});
