import {StyleSheet, Platform, StatusBar} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {AppContext, AuthProvider} from './app/theme/AppContext';
import AppNavigator from './app/Navigation/AppNavigator';
import {useContext, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import storage from './app/Constants/storage';

enableScreens();

const App = () => {
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
