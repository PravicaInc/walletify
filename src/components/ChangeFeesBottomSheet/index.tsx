import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop } from '../shared/customBackdrop';
import styles from './styles';
import {
  EstimationsLevels,
  FeeEstimationWithLevels,
  SelectedFee,
} from '../../shared/types';
import ChangeFeeIcon from '../../assets/icon-change-fee.svg';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import SimpleTextInput from '../shared/SimpleTextInput';
import { microStxToStx } from '../../shared/balanceUtils';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';

interface IProps {
  setSelectedFee: (val?: SelectedFee) => void;
  selectedFee?: SelectedFee;
  fees: FeeEstimationWithLevels[];
}

const ChangeFeesBottomSheet = React.forwardRef<BottomSheet, IProps>(
  ({ fees, selectedFee, setSelectedFee }, ref) => {
    const snapPoints = useMemo(() => ['50%'], []);
    const {
      theme: { colors },
    } = useContext(ThemeContext);
    const [newValue, setNewValue] = useState<SelectedFee | undefined>();
    useEffect(() => {
      if (selectedFee) {
        setNewValue(selectedFee);
      }
    }, [selectedFee]);
    const handleFeeChanged = useCallback((newFee: string) => {
      setNewValue({
        fee: newFee,
        level: EstimationsLevels.Custom,
      });
    }, []);
    const handleLowFeeSelected = useCallback(() => {
      setNewValue({
        fee: microStxToStx(fees[0].fee).toString(),
        level: EstimationsLevels.Low,
      });
    }, [fees]);
    const handleStandardFeeSelected = useCallback(() => {
      setNewValue({
        fee: microStxToStx(fees[1].fee).toString(),
        level: EstimationsLevels.Middle,
      });
    }, [fees]);
    const handleHighFeeSelected = useCallback(() => {
      setNewValue({
        fee: microStxToStx(fees[2].fee).toString(),
        level: EstimationsLevels.High,
      });
    }, [fees]);
    const dismissBottomSheet = useCallback(() => {
      ref.current?.close();
    }, []);
    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          setNewValue(selectedFee);
        }
      },
      [selectedFee],
    );
    const handleConfirm = useCallback(() => {
      ref.current?.close();
      setSelectedFee(newValue);
    }, [newValue]);
    const isLowEstimation = newValue?.level === EstimationsLevels.Low;
    const isStandardEstimation = newValue?.level === EstimationsLevels.Middle;
    const isHighEstimation = newValue?.level === EstimationsLevels.High;
    return (
      <Portal>
        <BottomSheet
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
          ref={ref}
          index={-1}
          handleComponent={null}
          enablePanDownToClose
          style={styles.container}
          backdropComponent={CustomBackdrop}>
          <Header
            containerStyles={styles.header}
            title="Change Fees"
            rightComponent={
              <HeaderBack
                textColor={colors.secondary100}
                text="Confirm"
                onPress={handleConfirm}
              />
            }
            leftComponent={
              <HeaderBack
                textColor={colors.secondary100}
                text="Cancel"
                onPress={dismissBottomSheet}
              />
            }
          />
          <View style={styles.contentContainer}>
            <View style={styles.card}>
              <ChangeFeeIcon width={69} height={72.35} />
              <Typography type="commonText" style={{ color: colors.primary60 }}>
                Higher fees increase the likelihood of your transaction getting
                confirmed before others. This action cannot be undone and the
                fees won't be returned, even if the transaction fails.
              </Typography>
            </View>
            <SimpleTextInput
              onChangeText={handleFeeChanged}
              value={newValue?.fee}
              label="Fees"
              keyboardType="decimal-pad"
              icon={
                <Typography
                  type="smallTitleR"
                  style={{ color: colors.primary40 }}>
                  STX
                </Typography>
              }
            />
            <View style={styles.chips}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  {
                    borderColor: isLowEstimation
                      ? colors.secondary100
                      : colors.primary40,
                    backgroundColor: isLowEstimation
                      ? colors.secondary10
                      : colors.card,
                  },
                ]}
                onPress={handleLowFeeSelected}
                activeOpacity={0.6}>
                <Typography
                  type="commonText"
                  style={{
                    color: isLowEstimation
                      ? colors.secondary100
                      : colors.primary40,
                  }}>
                  Low
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  {
                    borderColor: isStandardEstimation
                      ? colors.secondary100
                      : colors.primary40,
                    backgroundColor: isStandardEstimation
                      ? colors.secondary10
                      : colors.card,
                  },
                ]}
                onPress={handleStandardFeeSelected}
                activeOpacity={0.6}>
                <Typography
                  type="commonText"
                  style={{
                    color: isStandardEstimation
                      ? colors.secondary100
                      : colors.primary40,
                  }}>
                  Standard
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  {
                    borderColor: isHighEstimation
                      ? colors.secondary100
                      : colors.primary40,
                    backgroundColor: isHighEstimation
                      ? colors.secondary10
                      : colors.card,
                  },
                ]}
                onPress={handleHighFeeSelected}
                activeOpacity={0.6}>
                <Typography
                  type="commonText"
                  style={{
                    color: isHighEstimation
                      ? colors.secondary100
                      : colors.primary40,
                  }}>
                  High
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheet>
      </Portal>
    );
  },
);

export default ChangeFeesBottomSheet;
