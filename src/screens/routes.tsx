import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Splash } from './Splash';
import { Home } from './Home';

const Stack = createStackNavigator();

export const Routes: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Splash"
        component={Splash}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
    </Stack.Navigator>
  );
};
