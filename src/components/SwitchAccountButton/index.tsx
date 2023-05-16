import React, { useContext } from 'react';
import { TouchableHighlight, View } from 'react-native';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import AccountAvatar from '../shared/AccountAvatar';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import { truncateAddress } from '../../shared/addressUtils';
import Switch from '../../assets/images/Home/switch.svg';
import styles from './styles';

interface SwitchAccountButtonProps {
  handlePressSwitchAccount: () => void;
  mode: 'large' | 'small';
}

const SwitchAccountButton: React.FC<SwitchAccountButtonProps> = props => {
  const { handlePressSwitchAccount, mode } = props;
  const { selectedAccountState, walletAccounts } = useAccounts();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const accountName =
    selectedAccountState?.username ||
    `Account ${selectedAccountState ? selectedAccountState?.index + 1 : 0}`;

  if (selectedAccountState === undefined) {
    return (
      <View
        style={[
          styles.largeButtonContainer,
          {
            backgroundColor: colors.card,
          },
        ]}>
        <ContentLoader
          speed={2}
          width={200}
          height={40}
          viewBox="0 0 200 40"
          backgroundColor={colors.darkgray}
          foregroundColor={colors.white}>
          <Rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <Rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
          <Circle cx="20" cy="20" r="20" />
        </ContentLoader>
      </View>
    );
  }

  return (
    <TouchableHighlight
      underlayColor={colors.primary10}
      onPress={mode === 'large' ? handlePressSwitchAccount : undefined}
      style={[
        {
          backgroundColor: colors.card,
        },
        mode === 'large'
          ? styles.largeButtonContainer
          : styles.smallButtonContainer,
      ]}>
      <>
        <AccountAvatar
          accountName={accountName}
          diameter={mode === 'large' ? 45 : 27.5}
        />
        <View style={styles.accountInfo}>
          <Typography
            numberOfLines={1}
            type={mode === 'large' ? 'smallTitle' : 'commonTextBold'}
            style={[
              mode === 'large' ? styles.accountName : styles.none,
              { color: colors.text },
            ]}>
            {accountName}
          </Typography>
          <Typography
            type={mode === 'large' ? 'commonText' : 'smallText'}
            style={[
              mode === 'large' ? styles.address : styles.none,
              { color: colors.primary40 },
            ]}>
            {`(${
              selectedAccountState?.address
                ? truncateAddress(selectedAccountState?.address, 11)
                : '....'
            })`}
          </Typography>
        </View>
        {(walletAccounts?.length || 0) > 1 && (
          <View style={styles.switchIconContainer}>
            {mode === 'large' && (
              <Typography
                type="commonText"
                style={[styles.switchText, { color: colors.secondary100 }]}>
                Switch
              </Typography>
            )}
            {mode === 'large' && <Switch fill={colors.secondary100} />}
          </View>
        )}
      </>
    </TouchableHighlight>
  );
};

export default SwitchAccountButton;
