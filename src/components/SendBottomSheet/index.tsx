import React, { useMemo, useRef } from 'react';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop } from '../shared/customBackdrop';
import Send from './Send';

type Props = {
  fullBalance: any;
  price: any;
};

const SendBottomSheet = React.forwardRef<any, Props>(
  ({ fullBalance, price }, ref) => {
    const snapPoints = useMemo(() => ['92%'], []);

    return (
      <Portal>
        <BottomSheet
          snapPoints={snapPoints}
          ref={ref}
          index={-1}
          handleComponent={null}
          enablePanDownToClose
          backdropComponent={CustomBackdrop}>
          <Send fullBalance={fullBalance} price={price} />
        </BottomSheet>
      </Portal>
    );
  },
);

export default SendBottomSheet;
