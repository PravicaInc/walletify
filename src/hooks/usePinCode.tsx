import React, {useState} from 'react';
import {Text, ViewStyle} from 'react-native';
import {
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

export const usePinCode = (
  cellStyle: ViewStyle,
  focusCellStyle: ViewStyle,
  errCellStyle?: ViewStyle,
  addMargin?: boolean,
) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const renderCell = ({index, symbol, isFocused}: RenderCellOptions) => {
    let textChild = null;
    if (symbol) {
      textChild = '•';
    }
    return (
      <Text
        key={index}
        style={[
          cellStyle,
          isFocused && focusCellStyle,
          errCellStyle,
          {marginLeft: (!addMargin && index) === 0 ? 0 : 8},
        ]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };
  return {
    value,
    setValue,
    renderCell,
    ref,
    prop,
  };
};
