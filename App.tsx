import React from 'react';
import AppNavigator from './routes';
import {StatusBar} from 'react-native';
import {store} from './src/store';
import {Provider} from 'react-redux';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      {/* <SafeAreaView style={{flex: 1}}> */}
      <Provider store={store}>
        <AppNavigator />
      </Provider>
      {/* </SafeAreaView> */}
    </>
  );
}
