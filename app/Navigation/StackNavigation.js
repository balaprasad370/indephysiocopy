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
  Gernal,
  Regular,
  Portal,
  Pricing,
  Installment,
  Quiz,
  MarksImage,
  Leaderboard,
  FilterRecording,
  Assessment,
  Offline,
  Notifications,
  FilterScreen,
} from '../Screens';
import {Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation, useTheme} from '@react-navigation/native';
import {AppContext} from '../theme/AppContext';
import DarkTheme from '../theme/Darktheme';
import LighTheme from '../theme/LighTheme';
import Recording from '../Screens/Recording/Index';
import VoiceComponent from '../Screens/Quiz/VoiceComponent';
import AppUsageTracker from '../Screens/AppUsage/Index';
import StudentAccess from '../Screens/StudentAccess/StudentAccess';

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
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Level}
      />
      <Stack.Screen
        name={ROUTES.RECORDING}
        options={{
          headerTitle: 'Recording',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Recording}
      />
      <Stack.Screen
        name={ROUTES.REGULAR}
        options={{
          headerTitle: 'Regular Pathway',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Regular}
      />
      <Stack.Screen
        name={ROUTES.PRICING}
        options={{
          headerTitle: 'Our Package',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Pricing}
      />
      <Stack.Screen
        name={ROUTES.QUIZ}
        options={{
          headerTitle: 'Quiz',
          headerLeftLabelVisible: false,
          headerShown: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Quiz}
      />
      <Stack.Screen
        name={ROUTES.Installement}
        options={{
          headerTitle: 'Instalment Plans',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Installment}
      />
      <Stack.Screen
        name={ROUTES.PORTAL}
        options={{
          headerTitle: 'Referral Portal',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        // component={Offline}
        component={Portal}
      />
      <Stack.Screen
        name={ROUTES.OFFLINE}
        options={{
          headerTitle: 'No Internet',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Offline}
      />
      <Stack.Screen
        name={ROUTES.NOTIFICATIONS}
        options={{
          headerTitle: 'Notifications',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Notifications}
      />
      <Stack.Screen
        name={ROUTES.ASSESSMENTS}
        options={{
          headerTitle: 'Assessments',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Assessment}
      />

      <Stack.Screen
        name={ROUTES.MEETING}
        options={{headerShown: false}}
        component={Meeting}
      />
      <Stack.Screen
        name={ROUTES.PACKAGE}
        options={{
          headerTitle: 'Packages',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Package}
      />
      <Stack.Screen
        name={ROUTES.CHAPTERS}
        options={{
          headerTitle: 'Chapters',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Chapters}
      />
      <Stack.Screen
        name={ROUTES.LEADERBOARD}
        options={{
          headerTitle: 'Leader Board',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={Leaderboard}
      />
      <Stack.Screen
        name={ROUTES.MARKS}
        options={{
          headerTitle: 'Marks',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={MarksImage}
      />

      <Stack.Screen
        name={ROUTES.SELF_LEARN_SCREEN}
        options={{
          headerLeftLabelVisible: false,
          title: ' ',
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={SelfLearnScreen}
      />
      <Stack.Screen
        name={ROUTES.READING}
        options={{
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        // options={{headerLeftLabelVisible: false, title: ''}}
        component={ReadingMaterial}
      />
      <Stack.Screen
        name={ROUTES.FLASH}
        options={{
          headerTitle: 'Flash Cards',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        // options={{headerLeftLabelVisible: false, title: ''}}
        component={Flash}
      />
      <Stack.Screen
        name={ROUTES.FILTER_RECORDING}
        options={{
          headerTitle: 'Filter Recording',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={FilterRecording}
      />
      <Stack.Screen
        name={ROUTES.FAQ}
        options={{
          headerTitle: 'FAQs MedUniverse ',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={FAQ}
      />

      <Stack.Screen
        name={ROUTES.FILTER_SCREEN}
        options={{
          headerTitle: 'Live Class Filter',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={FilterScreen}
      />
      <Stack.Screen
        name={ROUTES.STUDENT_ACCESS}
        options={{
          headerTitle: 'Student Access',
          headerLeftLabelVisible: false,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTintColor: isDark ? '#fff' : '#000',
        }}
        component={StudentAccess}
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
            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              onPress={() => navigation.goBack()}>
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
