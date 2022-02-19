import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ToastShowOptions } from 'react-native-toast-message';
import { IThemeColors } from '../../contexts/Theme/theme';
import { Typography } from '../shared/Typography';

interface SuccessWithUndoOptions {
  backgroundColor: string;
  action: () => void;
  icon: any;
}
interface ExtendedToastProps extends ToastShowOptions {
  props: SuccessWithUndoOptions;
}
export const toastConfig = (colors: IThemeColors) => ({
  success: ({ text1 }: ToastShowOptions) => (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.secondary100,
        },
      ]}>
      <Typography type="commonText" style={{ color: colors.white }}>
        {text1}
      </Typography>
    </View>
  ),
  successWithUndo: ({
    text1,
    props: { icon, action, backgroundColor },
  }: ExtendedToastProps) => (
    <View
      style={[
        styles.container,
        styles.undo,
        {
          backgroundColor,
        },
      ]}>
      {icon}
      <Typography
        type="smallTitleR"
        style={[styles.title, { color: colors.white }]}>
        {text1}
      </Typography>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={action}
        style={styles.undoBtn}>
        <Typography
          type="buttonText"
          style={[styles.undoText, { color: colors.white }]}>
          UNDO
        </Typography>
      </TouchableOpacity>
    </View>
  ),
});

const styles = StyleSheet.create({
  container: {
    height: 35,
    maxWidth: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    paddingHorizontal: 10,
  },
  undo: {
    width: '90%',
    maxWidth: '90%',
    flexDirection: 'row',
    height: 50,
    paddingHorizontal: 15,
  },
  title: {
    marginHorizontal: 8,
  },
  undoBtn: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  undoText: {
    marginHorizontal: 5,
  },
});
