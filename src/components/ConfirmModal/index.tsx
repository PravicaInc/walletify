import React, { useContext, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import NoteIcon from '../../assets/images/note-icon.svg';
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  handleNextAction: () => void;
  imageComponent?: React.ReactNode | (() => React.ReactNode);
  title: string;
  description: string;
  renderContinueText: React.ReactNode | (() => React.ReactNode);
  renderAbortText: React.ReactNode | (() => React.ReactNode);
};

const SheetBackground: React.FC<BottomSheetBackgroundProps> = ({ style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: 'transparent',
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

const ResetWalletModal = React.forwardRef<any, Props>(
  (
    {
      handleNextAction,
      imageComponent,
      title,
      description,
      renderContinueText,
      renderAbortText,
    },
    ref,
  ) => {
    const {
      theme: { colors },
    } = useContext(ThemeContext);

    const snapPoints = useMemo(() => ['45%'], []);

    const handleDismissModal = useCallback(() => {
      if (ref) {
        ref.current?.dismiss();
      }
    }, [ref]);

    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        snapPoints={snapPoints}
        ref={ref}
        index={0}
        backdropComponent={renderBackdrop}
        backgroundComponent={SheetBackground}
        style={styles.sheet}
        bottomInset={40}
        detached={true}>
        <View style={[styles.top, { backgroundColor: colors.white }]}>
          <View style={styles.imgContainer}>
            {imageComponent ? (
              typeof imageComponent === 'function' ? (
                imageComponent()
              ) : (
                imageComponent
              )
            ) : (
              <NoteIcon />
            )}
          </View>
          <View
            style={[
              styles.descriptionContainer,
              { borderColor: colors.primary20 },
            ]}>
            <Typography type="midTitle">{title}</Typography>
            <Typography
              type="commonText"
              style={[styles.descriptionTxt, { color: colors.primary40 }]}>
              {description}
            </Typography>
          </View>
          <View style={styles.resetContainer}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={handleNextAction}>
              {typeof renderContinueText === 'function'
                ? renderContinueText()
                : renderContinueText}
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.bottom, { backgroundColor: colors.white }]}>
          <TouchableOpacity style={styles.button} onPress={handleDismissModal}>
            {typeof renderAbortText === 'function'
              ? renderAbortText()
              : renderAbortText}
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  },
);

export default ResetWalletModal;
