// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';
// import messaging from '@react-native-firebase/messaging';
// import 'react-native-gesture-handler';
// import notifee from '@notifee/react-native';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   try {
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//     });
//     await notifee.displayNotification({
//       title: remoteMessage?.notification?.title,

//       body: remoteMessage?.notification?.body,
//       android: {
//         channelId,
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   } catch (error) {
//     console.log('index.js file error2', error);
//   }
// });
// AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Use a unique ID for each notification; you can use remoteMessage.messageId if available
    const notificationId =
      remoteMessage.messageId || new Date().getTime().toString(); // Fallback to timestamp

    // Optionally, you can maintain a record of displayed notification IDs to prevent duplicates
    const displayedNotifications = new Set();

    // Check if the notification has already been displayed
    if (!displayedNotifications.has(notificationId)) {
      displayedNotifications.add(notificationId); // Mark this notification as displayed

      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
          // Optional: add small icon if needed
          smallIcon:
            'https://d2c9u2e33z36pz.cloudfront.net/uploads/1730736392Meduniverse%20logo%20favicon.png', // Replace with your icon name
        },
        id: notificationId, // Set the unique ID here
      });
    }
  } catch (error) {
    console.log('index.js file error2', error);
  }
});

AppRegistry.registerComponent(appName, () => App);
