import React, { useCallback, useContext } from 'react';
import { FlatList, View } from 'react-native';
import NoActivity from '../../../assets/images/Home/noActivity.svg';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import activityTabStyles from './styles';

const ActivityTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const EmptyActivity = useCallback(() => {
    return (
      <View style={activityTabStyles.emptyContainer}>
        <NoActivity />
        <Typography
          type="commonText"
          style={[
            activityTabStyles.emptyMessage,
            {
              color: colors.primary40,
            },
          ]}>
          No Activity Yet
        </Typography>
      </View>
    );
  }, []);

  return (
    <FlatList
      data={Array(0)}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={() => <View />}
      style={activityTabStyles.activityList}
      contentContainerStyle={activityTabStyles.activityListContent}
      ListEmptyComponent={EmptyActivity}
    />
  );
};

export default ActivityTab;
