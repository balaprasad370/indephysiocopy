import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
import Dashboard from '../Screens/Dashboard/Index';
import BottomNavigator from './BottomNavigator';
import {ROUTES} from '../Constants/routes';
import {
  ProfileSetting,
  Level,
  Chapters,
  SelfLearnScreen,
  ReadingMaterial,
  Meeting,
  Package,
  Flash,
  FAQ,
} from '../Screens';
import {Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation, useTheme} from '@react-navigation/native';
import {AppContext} from '../theme/AppContext';
import DarkTheme from '../theme/Darktheme';
import LighTheme from '../theme/LighTheme';

const Stack = createStackNavigator();

const StackNavigation = () => {
  const {isDark, setIsDark, isAuthenticate} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.HOME_TAB}
        options={{headerShown: false}}
        component={DrawerNavigator}
      />
      <Stack.Screen
        name={ROUTES.LEVEL}
        options={{
          headerTitle: 'Level',
          headerLeftLabelVisible: false,
        }}
        component={Level}
      />
      <Stack.Screen
        name={ROUTES.MEETING}
        options={{headerShown: false}}
        component={Meeting}
      />
      <Stack.Screen
        name={ROUTES.PACKAGE}
        options={{headerTitle: 'Packages', headerLeftLabelVisible: false}}
        component={Package}
      />
      <Stack.Screen
        name={ROUTES.CHAPTERS}
        options={{
          headerTitle: 'Chapters',
          headerLeftLabelVisible: false,
        }}
        component={Chapters}
      />
      <Stack.Screen
        name={ROUTES.SELF_LEARN_SCREEN}
        options={{headerLeftLabelVisible: false, title: 'Chapter 1'}}
        component={SelfLearnScreen}
      />
      <Stack.Screen
        name={ROUTES.READING}
        // options={{headerLeftLabelVisible: false, title: ''}}
        component={ReadingMaterial}
      />
      <Stack.Screen
        name={ROUTES.FLASH}
        options={{headerTitle: 'Flash Cards', headerLeftLabelVisible: false}}
        // options={{headerLeftLabelVisible: false, title: ''}}
        component={Flash}
      />

      <Stack.Screen
        name={ROUTES.FAQ}
        options={{
          headerTitle: 'FAQs MedUniverse ',
          headerLeftLabelVisible: false,
        }}
        component={FAQ}
      />

      <Stack.Screen
        name={ROUTES.PROFILE_SETTING}
        options={{
          headerTitle: 'Settings',
          headerTitleStyle: {
            color: isDark ? 'white' : 'black',
          },
          headerStyle: {
            backgroundColor: isDark ? 'black' : 'white',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="left" style={style.headerLeftIcon} />
            </TouchableOpacity>
          ),
        }}
        component={ProfileSetting}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
