import {
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
  Modal,
  View,
  Text,
  Vibration,
} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {AppContext, AuthProvider} from './app/theme/AppContext';
import AppNavigator from './app/Navigation/AppNavigator';
import {useContext, useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import storage from './app/Constants/storage';
import messaging, {requestPermission} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Mixpanel} from 'mixpanel-react-native';

// Enable native screens optimization
enableScreens();

const App = () => {
  // Initialize Mixpanel analytics
  const trackAutomaticEvents = false;
  const mixpanel = new Mixpanel(
    '307ab8f1e535a257669ab35fffe22d8f',
    trackAutomaticEvents,
  );

  mixpanel.init();

  // Update Mixpanel with user information
  useEffect(() => {
    updateMixpanel();
  }, []);

  const updateMixpanel = async () => {
    const studentName = await storage.getStringAsync('studentName');
    const studentId = await storage.getStringAsync('studentId');
    const email = await storage.getStringAsync('email');

    if (studentName && studentId && email) {
      mixpanel.identify(studentName + ' ' + studentId);
      mixpanel.track('App Opened', {
        studentName: studentName,
        studentId: studentId,
        email: email,
      });
    }
  };

  // Request notification permissions on app start
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    await messaging().requestPermission();
  };

  // Handle background messages
  useEffect(() => {
    // Set up background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // Create notification channel for Android
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      // Check if notification has HTML content
      const hasHtmlContent =
        remoteMessage?.data?.htmlBody ||
        (remoteMessage?.notification?.body &&
          remoteMessage?.notification?.body.includes('<'));

      // Check for image URL from different possible locations
      const imageUrl =
        remoteMessage?.data?.imageUrl ||
        remoteMessage?.notification?.android?.imageUrl ||
        remoteMessage?.notification?.ios?.attachments?.[0]?.url;

      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        subtitle: remoteMessage?.data?.subtitle,
        body: remoteMessage?.notification?.body,
        data: remoteMessage.data,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_launcher',
          ...(imageUrl && {
            style: {
              type: AndroidStyle.BIGPICTURE,
              picture: imageUrl,
            },
          }),
          ...(hasHtmlContent &&
            !imageUrl && {
              style: {
                type: AndroidStyle.BIGTEXT,
                text:
                  remoteMessage?.data?.htmlBody ||
                  remoteMessage?.notification?.body,
              },
            }),
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
        },
        ios: {
          ...(imageUrl && {
            attachments: [
              {
                url: imageUrl,
                thumbnailHidden: false,
              },
            ],
          }),
          critical: true,
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
      });
    });
  }, []);

  // Subscribe to topics and handle foreground messages
  useEffect(() => {
    try {
      // Subscribe to general topics
      messaging().subscribeToTopic('all');
      messaging().subscribeToTopic('installedNoAccount');
    } catch (error) {
      console.error('Failed to subscribe to topics:', error);
    }

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        messaging.NotificationAndroidPriority.PRIORITY_MIN;

        // Vibrate device when notification is received
        Vibration.vibrate([0, 500, 100, 600]); // Short, pause, long, pause pattern

        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          badge: true,
          vibration: false,
        });

        // Check if notification has HTML content
        const hasHtmlContent =
          remoteMessage?.data?.htmlBody ||
          (remoteMessage?.notification?.body &&
            remoteMessage?.notification?.body.includes('<'));

        // Check for image URL from different possible locations
        const imageUrl =
          remoteMessage?.data?.imageUrl ||
          remoteMessage?.notification?.android?.imageUrl ||
          remoteMessage?.notification?.ios?.attachments?.[0]?.url;

        await notifee.displayNotification({
          title: remoteMessage?.notification?.title,
          subtitle: remoteMessage?.data?.subtitle,
          body: remoteMessage?.notification?.body,
          data: remoteMessage.data,
          android: {
            channelId,
            pressAction: {
              id: 'default',
            },
            smallIcon: 'ic_launcher',
            // Use BigPicture style if image URL exists
            ...(imageUrl && {
              style: {
                type: AndroidStyle.BIGPICTURE,
                picture: imageUrl,
              },
            }),
            // Use BigText style if HTML content exists
            ...(hasHtmlContent &&
              !imageUrl && {
                style: {
                  type: AndroidStyle.BIGTEXT,
                  text:
                    remoteMessage?.data?.htmlBody ||
                    remoteMessage?.notification?.body,
                },
              }),
            importance: AndroidImportance.HIGH,
            timestamp: new Date().getTime(),
            showTimestamp: true,
            ongoing: false,
            fullScreenAction: {
              id: 'default',
              launchActivity: 'default',
            },
            visibility: AndroidVisibility.PUBLIC,
            largeIcon: 'ic_launcher',
          },
          ios: {
            // Handle attachments for iOS if image URL exists
            ...(imageUrl && {
              attachments: [
                {
                  url: imageUrl,
                  thumbnailHidden: false,
                },
              ],
            }),
            critical: true,
            timestamp: new Date().getTime(),
            foregroundPresentationOptions: {
              alert: true,
              badge: true,
              sound: false,
            },
            interruptionLevel: 'timeSensitive',
          },
        });
      } catch (error) {
        console.error('Error displaying notification:', error);
      }
    });

    return unsubscribe;
  }, []);

  // Handle notification clicks when app is in background
  useEffect(() => {
    const handleInitialNotification = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        // Store navigation data to be used in AppNavigator
        if (initialNotification.data?.link) {
          await storage.setString(
            'pendingNotificationLink',
            initialNotification.data.link,
          );
          if (initialNotification.data?.params) {
            await storage.setString(
              'pendingNotificationParams',
              typeof initialNotification.data.params === 'string'
                ? initialNotification.data.params
                : JSON.stringify(initialNotification.data.params),
            );
          }
        }
      }
    };

    handleInitialNotification();
  }, []);

  // Hide splash screen when app is ready
  useEffect(() => {
    SplashScreen.hide();
    StatusBar.setHidden(false);
  }, []);

  return (
    <AuthProvider>
      <StatusBar backgroundColor="#613BFF" />
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        flex: 1,
        paddingTop: 40,
      },
      android: {
        flex: 1,
        paddingTop: 0,
      },
    }),
  },
  activityContain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  activityIndicator: {
    width: '20%',
  },
});
