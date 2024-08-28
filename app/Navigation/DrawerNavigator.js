import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomNavigator from './BottomNavigator';
const Drawer = createDrawerNavigator();
import {ROUTES} from '../Constants/routes';
import {Dashboard, LiveClasses, Documents, SelfLearn} from '../Screens';
import COLOR from '../Constants/color';

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="HomeTabs" screenOptions={{}}>
      <Drawer.Screen
        name=" "
        options={{
          headerShown: false,
        }}
        component={BottomNavigator}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
