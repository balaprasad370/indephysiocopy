import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import StackNavigation from './StackNavigation';
import AuthNavigator from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {AppContext} from '../theme/AppContext';
import Toast from '../Components/Toast/Index';
import storage from '../Constants/storage';
import axios from 'axios';

const AppNavigator = () => {
  const {
    isAuthenticate,
    setIsAuthenticate,
    isDark,
    show,
    packageName,
    setPackageId,
    packageId,
    path,
  } = useContext(AppContext);

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
