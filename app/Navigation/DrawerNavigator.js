// src/DrawerNavigator.js
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomNavigator from './BottomNavigator';
import DrawerContent from './Side'; // Import the custom drawer content
import {ROUTES} from '../Constants/routes';
import {Dashboard, LiveClasses, Documents, SelfLearn} from '../Screens';
import COLOR from '../Constants/color';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
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
        options={{headerShown: true}}
      />
      {/* <Drawer.Screen
        name={ROUTES.DOCUMENTS}
        component={Documents}
        options={{headerShown: false}}
      /> */}
      <Drawer.Screen
        name={ROUTES.SELF_LEARN}
        component={SelfLearn}
        options={{headerShown: true}}
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
