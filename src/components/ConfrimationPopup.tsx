/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
interface Props {
  actionSheetRef: any;
}

export const ConfirmationPopup: React.FC<Props> = (props: Props) => {
  return (
    <>
      <ActionSheet
        onPositionChanged={(e) => console.warn(e)}
        gestureEnabled={true}
        containerStyle={{borderTopLeftRadius: 38, borderTopRightRadius: 38}}
        ref={props.actionSheetRef}>
        <View style={{paddingVertical: 48, paddingHorizontal: 48}} />
      </ActionSheet>
    </>
  );
};
