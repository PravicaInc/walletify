import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop } from '../shared/customBackdrop';
import styles from './styles';
import {
  NavigationContainer,
  NavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';
import { SendAssetsRoutes } from '../../navigation';

const SendBottomSheet = React.forwardRef<any>((props, ref) => {
  const snapPoints = useMemo(() => ['92%'], []);
  const navigationRef = useRef<NavigationContainerRef>(null);
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'sendForm' }],
        }),
      );
    }
  }, []);
  return (
    <Portal>
      <BottomSheet
        snapPoints={snapPoints}
        ref={ref}
        index={-1}
        handleComponent={null}
        enablePanDownToClose
        style={styles.container}
        onChange={handleSheetChanges}
        backdropComponent={CustomBackdrop}>
        <View style={styles.contentContainer}>
          <NavigationContainer ref={navigationRef} independent={true}>
            <SendAssetsRoutes />
          </NavigationContainer>
        </View>
      </BottomSheet>
    </Portal>
  );
});

export default SendBottomSheet;
