import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../Constants/routes';
import {Login, OTP, Recovery, ResetPassword, Signup, Welcome} from '../Screens';
import DrawerNavigator from './DrawerNavigator';
import {StyleSheet, View} from 'react-native';

const Stack = createStackNavigator();

const ScreenWrapper = ({children}) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={ROUTES.WELCOME} options={{headerShown: false}}>
      {props => (
        <ScreenWrapper>
          <Welcome {...props} />
        </ScreenWrapper>
      )}
    </Stack.Screen>

    <Stack.Screen name={ROUTES.LOGIN} options={{headerTitle: 'Login', headerShown: false}}>
      {props => (
        <ScreenWrapper>
          <Login {...props} />
        </ScreenWrapper>
      )}
    </Stack.Screen>
    <Stack.Screen name={ROUTES.SIGNUP} options={{headerTitle: 'Signup', headerShown: false}}>
      {props => (
        <ScreenWrapper>
          <Signup {...props} />
        </ScreenWrapper>
      )}
    </Stack.Screen>
    <Stack.Screen name={ROUTES.OTP_SCREEN}>
      {props => (
        <ScreenWrapper>
          <OTP {...props} />
        </ScreenWrapper>
      )}
    </Stack.Screen>
    <Stack.Screen name={ROUTES.RESET_PASSWORD}>
      {props => (
        <ScreenWrapper>
          <ResetPassword {...props} />
        </ScreenWrapper>
      )}
    </Stack.Screen>
    <Stack.Screen name={ROUTES.RECOVERY_PASSWORD}>
      {props => (
        <ScreenWrapper>
          <Recovery {...props} />
        </ScreenWrapper>
      )}
    </Stack.Screen>
  </Stack.Navigator>
);

export default AuthNavigator;
