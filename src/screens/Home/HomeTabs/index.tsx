import React, { useContext } from 'react';
import { useWindowDimensions, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import AssetsTab from '../../../components/Home/AssetsTab';
import styles from './styles';
import AssetActivityList from '../../../components/AssetActivityList';

const renderScene = SceneMap({
  Assets: AssetsTab,
  Activity: AssetActivityList,
});

const TabsHeader = (props: any) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <TabBar
      indicatorStyle={{ backgroundColor: colors.activeState }}
      style={[
        styles.tabsHeaderContainer,
        {
          backgroundColor: colors.defaultBlack,
        },
      ]}
      renderTabBarItem={tabProps => (
        <TouchableOpacity
          key={tabProps.key}
          activeOpacity={0.9}
          onPress={tabProps.onPress}
          style={styles.tabHeaderItem}>
          <Typography
            type="smallTitleR"
            style={{
              color:
                props.navigationState.routes[props.navigationState.index]
                  .key === tabProps.key
                  ? colors.activeState
                  : colors.deactiveState,
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
  const layout = useWindowDimensions();
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const [homeTabRoutes] = React.useState([
    { key: 'Assets', title: 'Assets' },
    { key: 'Activity', title: 'Activity' },
  ]);

  return (
    <TabView
      navigationState={{ index: currentTabIndex, routes: homeTabRoutes }}
      renderScene={renderScene}
      onIndexChange={setCurrentTabIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={TabsHeader}
    />
  );
};

export default HomeTabs;
