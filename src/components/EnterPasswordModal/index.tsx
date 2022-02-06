import React, { useCallback, useMemo, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { CustomBackdrop, CustomBackground } from '../shared/customBackdrop';
import { WalletUnlockInner } from './WalletUnlock';
import styles from './styles';
import { Keyboard } from 'react-native';
import { Portal } from '@gorhom/portal';

type Props = {
  handleNextAction: (password: string, seedPhrase: string) => void;
  isDismissible: boolean;
  resetWalletCb?: () => void;
};

const EnterPasswordModal = React.forwardRef<any, Props>(
  ({ handleNextAction, isDismissible, resetWalletCb }, ref) => {
    const snapPoints = useMemo(() => ['94%'], []);
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
          enablePanDownToClose={isDismissible}
          backdropComponent={CustomBackdrop}>
          <WalletUnlockInner
            cancelAction={handleCancel}
            isDismissible={isDismissible}
            reset={reset}
            resetAction={resetWalletCb}
            nextAction={handleGoNext}
          />
        </BottomSheet>
      </Portal>
    );
  },
);

export default EnterPasswordModal;
