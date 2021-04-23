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
import SeedPhrase from './src/screens/SeedPhrase';
import Home from './src/screens/Home';
import CreateWallet from './src/screens/CreateWallet';
import CreatePin from './src/screens/CreatePin';
import Username from './src/screens/Username';

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
    SeedPhrase: {
      screen: SeedPhrase,
      navigationOptions: {
        header: () => null,
      },
    },
    CreateWallet: {
      screen: CreateWallet,
      navigationOptions: {
        header: () => null,
      },
    },
    CreatePin: {
      screen: CreatePin,
      navigationOptions: {
        header: () => null,
      },
    },
    Username: {
      screen: Username,
      navigationOptions: {
        header: () => null,
      },
    },
    Home: {
      screen: Home,
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
