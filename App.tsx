import React, {useContext, useEffect, useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {CommonActions, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {UserData} from './src/context/UserData';
import {useAuthentication} from './src/hooks/useAuth';

function SplashScreen({navigation}) {
  const {failure, success} = useContext(UserData);
  useEffect(() => {
    if (success) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'Home'}],
        }),
      );
    } else if (failure) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'SignIn'}],
        }),
      );
    }
  }, [failure, success]);
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen({navigation}) {
  const {signOut} = useContext(UserData);
  return (
    <View>
      <Text>Signed in!</Text>
      <Button
        title="Sign out"
        onPress={() => {
          signOut().then(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'SignIn'}],
              }),
            );
          });
        }}
      />
    </View>
  );
}

function SignInScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {signIn} = useContext(UserData);
  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign in"
        onPress={() => {
          signIn().then(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'Home'}],
              }),
            );
          });
        }}
      />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const data = useAuthentication();
  return (
    <UserData.Provider value={data}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserData.Provider>
  );
}
