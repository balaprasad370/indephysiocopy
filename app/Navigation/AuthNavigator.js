import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../Constants/routes';
import {Login, OTP, Recovery, ResetPassword, Signup} from '../Screens';
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
    padding: '5%',
  },
});

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name={ROUTES.LOGIN}>
      {props => (
        <ScreenWrapper>
          <Login {...props} />
        </ScreenWrapper>
      )}
    </Stack.Screen>
    <Stack.Screen name={ROUTES.SIGNUP}>
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
