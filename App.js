import {StyleSheet, Platform, StatusBar, Alert} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {AppContext, AuthProvider} from './app/theme/AppContext';
import AppNavigator from './app/Navigation/AppNavigator';
import {useContext, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import storage from './app/Constants/storage';
import messaging, {requestPermission} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {getFcmToken, registerListenerWithFCM} from './app/utils/fcm';

enableScreens();

const App = () => {
  useEffect(() => {
    notifee.requestPermission();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
        await notifee.displayNotification({
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,

          android: {
            channelId,
            pressAction: {
              id: 'default',
            },
            smallIcon: 'ic_launcher',
          },
        });
      } catch (error) {
        console.log('index.js file error', error);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    SplashScreen.hide();
    StatusBar.setHidden(false);
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
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
