import {StyleSheet, Platform, StatusBar, Alert} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {AppContext, AuthProvider} from './app/theme/AppContext';
import AppNavigator from './app/Navigation/AppNavigator';
import {useContext, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import storage from './app/Constants/storage';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

enableScreens();

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        console.log('remoteMessage', remoteMessage);
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
        await notifee.displayNotification({
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          // android: {
          //   channelId,
          //   pressAction: {
          //     id: 'default',
          //   },
          // },
          android: {
            channelId,
            pressAction: {
              id: 'default',
            },
            smallIcon:
              'https://d2c9u2e33z36pz.cloudfront.net/uploads/1730736392Meduniverse%20logo%20favicon.png', // Set your default icon here
          },
        });
      } catch (error) {
        console.log('index.js file error2', error);
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
// export default Sentry.wrap(App);

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
