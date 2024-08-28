import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import StackNavigation from './StackNavigation';
import AuthNavigator from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {AppContext} from '../theme/AppContext';
import Toast from '../Components/Toast/Index';

const AppNavigator = () => {
  const {isAuthenticate, setIsAuthenticate, isDark, show} =
    useContext(AppContext);

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000000' : '#FFFFFF'}
      />
      <Toast visible={show} onClose={() => setShow(false)} />
      {isAuthenticate ? <StackNavigation /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
