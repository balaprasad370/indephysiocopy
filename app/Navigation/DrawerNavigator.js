// src/DrawerNavigator.js
import React, {useContext, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomNavigator from './BottomNavigator';
import DrawerContent from './Side'; // Import the custom drawer content
import {ROUTES} from '../Constants/routes';
import {
  Dashboard,
  LiveClasses,
  Documents,
  SelfLearn,
  ProfileSetting,
  MedTalk,
} from '../Screens';
import COLOR from '../Constants/color';
import {AppContext} from '../theme/AppContext';
import DarkTheme from '../theme/Darktheme';
import LighTheme from '../theme/LighTheme';
import storage from '../Constants/storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const {isDark, fetchTime} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      drawerContent={props => <DrawerContent {...props} />} // Use custom drawer content
      screenOptions={{
        drawerStyle: {
          backgroundColor: COLOR.white, // Replace with your preferred color
        },
        headerStyle: {
          backgroundColor: COLOR.primary, // Replace with your preferred color
        },
        headerTintColor: COLOR.white, // Replace with your preferred color
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Drawer.Screen
        name={ROUTES.DASHBOARD}
        component={BottomNavigator}
        options={{headerShown: false}}
      />

      <Drawer.Screen
        name={ROUTES.LIVE_CLASS}
        component={LiveClasses}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ROUTES.SELF_LEARN}
        component={SelfLearn}
        options={{
          headerShown: false,
        }}
        // options={{headerShown: true}}
      />
      <Drawer.Screen
        name={ROUTES.PROFILE_SETTING}
        component={ProfileSetting}
        options={{
          headerTitle: 'Profile',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
      />

      <Drawer.Screen
        name={ROUTES.MEDTALK}
        component={MedTalk}
        options={{
          headerShown: false,
          drawerLabel: 'MedTalk AI Chat',
          drawerLabelStyle: {
            fontWeight: 'bold',
          },
          drawerContentStyle: {
            backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
          },
          drawerContentOptions: {
            activeTintColor: COLOR.primary,
          },
        }}
      />

      <Drawer.Screen
        name=" "
        component={BottomNavigator}
        options={{headerShown: true}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
