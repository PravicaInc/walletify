import React, { useContext } from 'react';
import { useWindowDimensions, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import ActivityTab from '../../../components/Home/ActivityTab';
import AssetsTab from '../../../components/Home/AssetsTab';
import homeTabsStyles from './styles';

const renderScene = SceneMap({
  Assets: AssetsTab,
  Activity: ActivityTab,
});

const TabsHeader = props => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <TabBar
      indicatorStyle={{ backgroundColor: colors.primary100 }}
      style={[
        homeTabsStyles.tabsHeaderContainer,
        {
          backgroundColor: colors.white,
          borderBottomColor: colors.primary100,
        },
      ]}
      renderTabBarItem={tabProps => (
        <TouchableOpacity
          key={tabProps.key}
          activeOpacity={0.9}
          onPress={tabProps.onPress}
          style={homeTabsStyles.tabHeaderItem}>
          <Typography
            type="smallTitleR"
            style={{
              color:
                props.navigationState.routes[props.navigationState.index]
                  .key === tabProps.key
                  ? colors.primary100
                  : colors.primary40,
            }}>
            {tabProps.route.title}
          </Typography>
        </TouchableOpacity>
      )}
      {...props}
    />
  );
};

const HomeTabs: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Assets', title: 'Assets' },
    { key: 'Activity', title: 'Activity' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={TabsHeader}
    />
  );
};

export default HomeTabs;
