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
        name="Bottom tab"
        // options={{headerTitle: ''}}
        options={{
          headerShown: false,
        }}
        component={BottomNavigator}
      />
      <Drawer.Screen name={ROUTES.DASHBOARD} component={Dashboard} />
      <Drawer.Screen name={ROUTES.LIVE_CLASS} component={LiveClasses} />
      <Drawer.Screen name={ROUTES.DOCUMENTS} component={Documents} />
      <Drawer.Screen name={ROUTES.SELF_LEARN} component={SelfLearn} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
