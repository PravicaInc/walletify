/**
 * @format
 */
import './shim.js';
import 'text-encoding-polyfill';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-url-polyfill/auto';

AppRegistry.registerComponent(appName, () => App);
