/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler';
import notifee from '@notifee/react-native';

AppRegistry.registerComponent(appName, () => App);
