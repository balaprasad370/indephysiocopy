// import {StyleSheet, Platform, StatusBar} from 'react-native';
// import {enableScreens} from 'react-native-screens';
// import {AppContext, AuthProvider} from './app/theme/AppContext';
// import AppNavigator from './app/Navigation/AppNavigator';
// import {useContext, useEffect} from 'react';
// import SplashScreen from 'react-native-splash-screen';
// import storage from './app/Constants/storage';
// import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn: 'https://1f5c8fcda18228ac5b34131e1e99cad3@o4508233533095936.ingest.us.sentry.io/4508233552297984',

//   // uncomment the line below to enable Spotlight (https://spotlightjs.com)
//   // enableSpotlight: __DEV__,
// });

// enableScreens();

// const App = () => {
//   useEffect(() => {
//     SplashScreen.hide();
//     StatusBar.setHidden(false);
//   }, []);

//   return (
//     <AuthProvider>
//       <AppNavigator />
//     </AuthProvider>
//   );
// };

// // export default App;
// export default Sentry.wrap(App);

// const styles = StyleSheet.create({
//   container: {
//     ...Platform.select({
//       ios: {
//         flex: 1,
//         paddingTop: 40,
//       },
//       android: {
//         flex: 1,
//         paddingTop: 0,
//       },
//     }),
//   },
//   activityContain: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',

//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
//   activityIndicator: {
//     width: '20%',
//   },
// });
import React, {useEffect} from 'react';
import {StyleSheet, Platform, StatusBar, Alert} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {AuthProvider} from './app/theme/AppContext';
import AppNavigator from './app/Navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://1f5c8fcda18228ac5b34131e1e99cad3@o4508233533095936.ingest.us.sentry.io/4508233552297984',
});

enableScreens();

// Error handling function to log error and notify user
const handleAppError = (error, errorInfo) => {
  console.log('An error occurred:', error.message);
  Sentry.captureException(error, {extra: errorInfo});

  // Display an alert to notify the user
  Alert.alert('Error', 'An unexpected error occurred. Please try again.');
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    StatusBar.setHidden(false);

    try {
      // Simulate an error
      // throw new Error('Test Sentry Error');
    } catch (error) {
      handleAppError(error, {componentStack: 'App -> useEffect'});
    }
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

// Error fallback component
function ErrorFallback() {
  useEffect(() => {
    Alert.alert('Error', 'An unexpected error occurred. Please try again.');
  }, []);

  return null; // Keep UI unblocked, or add error UI if preferred
}

// Main app component wrapped with Sentry error boundary
export default function MainApp() {
  return (
    <Sentry.ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => handleAppError(error, errorInfo)}>
      <App />
    </Sentry.ErrorBoundary>
  );
}

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
