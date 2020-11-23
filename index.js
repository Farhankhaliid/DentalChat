/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
// import App from './App';
import App from './src/App'
import {name as appName} from './app.json';
// import messaging from '@react-native-firebase/messaging';



AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//   });
// // AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => registerHeadlessListener); // <-- Add this line

