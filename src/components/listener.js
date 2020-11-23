import {Platform, AsyncStorage, AppState} from "react-native";

import messaging from '@react-native-firebase/messaging';
import App from '../App'
import React, { useState } from "react";




// these callback will be triggered only when app is foreground or background
// export async function registerAppListener(navigation) {
// console.log('listener called');
//     messaging().onNotificationOpenedApp(remoteMessage => {
//         console.log(
//           'Notification caused app to open from background state:',
//           remoteMessage.notification,
//         );
//         console.log('---------------------------------background-------------------------------------------------------')
//         // navigation.navigate('PatientMainTab', { screen: 'Message' });
//                {App}
//       });
//       // Check whether an initial notification is available
//       messaging()
//         .getInitialNotification()
//         .then(remoteMessage => {
//           if (remoteMessage) {
//             console.log(
//               'Notification caused app to open from quit state:',
//               remoteMessage.notification,
//             );
//             console.log('--------------------------------kill--------------------------------------------------------')
//             return(
//                 <App/>
//              )         
//           }
//         });

// }
