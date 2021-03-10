import React from 'react';
import {View, Text} from 'react-native';
import {
  createAppContainer,
  StackActions,
  NavigationActions,
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from './src/screens/Login';
import SplashScreen from './src/screens/SplashScreen';

const HomeScreen = () => {
  return (
    <View>
      <Text>EHH</Text>
    </View>
  );
};
const ChatPageNavigator = createStackNavigator(
  {
    Splash: {
      screen: SplashScreen,
      navigationOptions: {
        header: () => null,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: () => null,
      },
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: () => null,
      },
    },
  },
  {
    initialRouteName: 'Splash',
  },
);
const AppNavigator = createAppContainer(ChatPageNavigator);

// Function for reseting Navigation;
export const resetNavigation = (dispatch: any, routeName: string) => {
  dispatch(
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName})],
    }),
  );
};

export default AppNavigator;
