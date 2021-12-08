import React, { useCallback, useMemo } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop, CustomBackground } from '../shared/customBackdrop';
import { WalletUnlockInner } from '../../screens/WalletUnlock';
import styles from './styles';

type Props = {
  handleNextAction: (password: string, seedPhrase: string) => void;
};

const EnterPasswordModal = React.forwardRef<any, Props>(
  ({ handleNextAction }, ref) => {
    const snapPoints = useMemo(() => ['92%'], []);

    const handleGoNext = useCallback(
      async (password: string, seedPhrase: string) => {
        handleNextAction(password, seedPhrase);
      },
      [],
    );

    return (
      <Portal>
        <BottomSheet
          snapPoints={snapPoints}
          ref={ref}
          index={-1}
          style={styles.container}
          backgroundComponent={CustomBackground}
          handleComponent={null}
          enablePanDownToClose
          backdropComponent={CustomBackdrop}>
          <WalletUnlockInner nextAction={handleGoNext} disableBack />
        </BottomSheet>
      </Portal>
    );
  },
);

export default EnterPasswordModal;
