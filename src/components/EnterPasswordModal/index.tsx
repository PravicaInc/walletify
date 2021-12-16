import React, { useCallback, useMemo, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop, CustomBackground } from '../shared/customBackdrop';
import { WalletUnlockInner } from '../../screens/WalletUnlock';
import styles from './styles';
import { Keyboard } from 'react-native';

type Props = {
  handleNextAction: (password: string, seedPhrase: string) => void;
};

const EnterPasswordModal = React.forwardRef<any, Props>(
  ({ handleNextAction }, ref) => {
    const snapPoints = useMemo(() => ['92%'], []);
    const [reset, setReset] = useState<boolean>(false);
    const handleGoNext = useCallback(
      async (password: string, seedPhrase: string) => {
        handleNextAction(password, seedPhrase);
      },
      [],
    );
    const handleCancel = useCallback(() => {
      ref?.current.close();
      Keyboard.dismiss();
    }, []);
    const handleChange = useCallback((index: number) => {
      if (index === -1) {
        Keyboard.dismiss();
        setReset(false);
      } else {
        setReset(true);
      }
    }, []);

    return (
      <Portal>
        <BottomSheet
          snapPoints={snapPoints}
          ref={ref}
          index={-1}
          onChange={handleChange}
          style={styles.container}
          backgroundComponent={CustomBackground}
          handleComponent={null}
          enablePanDownToClose
          backdropComponent={CustomBackdrop}>
          <WalletUnlockInner
            cancelAction={handleCancel}
            reset={reset}
            nextAction={handleGoNext}
          />
        </BottomSheet>
      </Portal>
    );
  },
);

export default EnterPasswordModal;
