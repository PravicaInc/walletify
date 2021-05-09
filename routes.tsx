import React from 'react';
import {Image} from 'react-native';
import {
  createAppContainer,
  StackActions,
  NavigationActions,
  NavigationPushActionPayload,
  NavigationPopActionPayload,
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from './src/screens/Login';
import SplashScreen from './src/screens/SplashScreen';
import SeedPhrase from './src/screens/SeedPhrase';
import Home from './src/screens/Home';
import CreateWallet from './src/screens/CreateWallet';
import CreatePin from './src/screens/CreatePin';
import Username from './src/screens/Username';
import EditPinCode from './src/screens/EditPinCode';
import {theme} from './theme';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Wallet from './src/screens/Wallet';
import Stacks from './src/screens/Stacks';
import Encryptions from './src/screens/Encryptions';
import IntroSlider from './src/screens/IntroSlider';

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
    IntroSlider: {
      screen: IntroSlider,
      navigationOptions: {
        header: () => null,
      }
    },
    Home: createBottomTabNavigator(
      {
        Wallet: {
          screen: Wallet,
          navigationOptions: {
            tabBarIcon: ({focused}) => {
              if (focused) {
                return (
                  <Image
                    style={{width: 35}}
                    source={require('./src/assets/w-active.png')}
                    resizeMode={'contain'}
                  />
                );
              } else {
                return (
                  <Image
                    style={{width: 35}}
                    source={require('./src/assets/w-inactive.png')}
                    resizeMode={'contain'}
                  />
                );
              }
            },
          },
        },
        Identities: {
          screen: Home,
          navigationOptions: {
            tabBarIcon: ({focused}) => {
              if (focused) {
                return (
                  <Image
                    style={{width: 35}}
                    source={require('./src/assets/i-active.png')}
                    resizeMode={'contain'}
                  />
                );
              } else {
                return (
                  <Image
                    style={{width: 35}}
                    source={require('./src/assets/i-inactive.png')}
                    resizeMode={'contain'}
                  />
                );
              }
            },
          },
        },
        Stacks: {
          screen: Stacks,
          navigationOptions: {
            tabBarIcon: ({focused}) => {
              if (focused) {
                return (
                  <Image
                    style={{width: 35}}
                    source={require('./src/assets/s-active.png')}
                    resizeMode={'contain'}
                  />
                );
              } else {
                return (
                  <Image
                    style={{width: 35}}
                    source={require('./src/assets/s-inactive.png')}
                    resizeMode={'contain'}
                  />
                );
              }
            },
          },
        },
        Encryption: {
          screen: Encryptions,
          navigationOptions: {
            tabBarIcon: ({focused}) => {
              if (focused) {
                return (
                  <Image
                    style={{width: 35}}
                    source={require('./src/assets/e-active.png')}
                    resizeMode={'contain'}
                  />
                );
              } else {
                return (
                  <Image
                    style={{width: 35}}
                    source={require('./src/assets/e-inactive.png')}
                    resizeMode={'contain'}
                  />
                );
              }
            },
          },
        },
      },
      {
        initialRouteName: 'Identities',
        tabBarOptions: {
          activeTintColor: theme.colors.primary,
          inactiveTintColor: theme.colors.textGreyColor,
          showLabel: true,
          tabStyle: {
            backgroundColor: 'transparent',
          },
          labelStyle: {
            fontWeight: 'bold',
            fontSize: 10,
          },
          // indicatorStyle: {
          //   backgroundColor: theme.colors.tabIndicator
          // },
          style: {
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            // paddingBottom: 12,
            paddingLeft: 35,
            paddingRight: 35,
            paddingTop: 8,
            justifyContent: 'space-between',
            borderWidth: 0,
            shadowColor: '#000000',
            shadowOffset: {height: 4, width: 0},
            shadowOpacity: 0.75,
            shadowRadius: 5,
          },
        },
        navigationOptions: {
          header: () => null,
        },
      },
    ),
    EditPinCode: {
      screen: EditPinCode,
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

export const pushNavigation = (
  dispatch: any,
  navigationOptions: NavigationPushActionPayload,
) => {
  dispatch(StackActions.push(navigationOptions));
};

export const popNavigation = (
  dispatch: any,
  navigationOptions?: NavigationPopActionPayload,
) => {
  dispatch(StackActions.pop(navigationOptions));
};

export default AppNavigator;
