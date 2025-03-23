import React, {useContext} from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import DrawerNavigator from './DrawerNavigator';
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
  Subscriptions,
  GlobalLeaderboard,
  Translations,
  Resumes,
  Help,
  Support,
  TicketDetails,
  Raise,
  Invoice,
  ResumesEdit,
  ResumesAdd,
  MedChat,
  Tokens,
  NotificationDetails,
  Login,
  SampleQuiz,
  MarksDetails,
} from '../Screens';
import {Button, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {AppContext} from '../theme/AppContext';

import Recording from '../Screens/Recording/Index';
import StudentAccess from '../Screens/StudentAccess/StudentAccess';
import BranchChapters from '../Screens/Branch/index';

const Stack = createStackNavigator();

const StackNavigation = () => {
  const {isDark} = useContext(AppContext);
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        transitionSpec: {
          open: {animation: 'timing', config: {duration: 300}},
          close: {animation: 'timing', config: {duration: 300}},
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name={ROUTES.HOME_TAB}
        options={{headerShown: false}}
        component={DrawerNavigator}
      />
      <Stack.Screen
        name={ROUTES.LEVEL}
        options={{
          headerShown: false,
        }}
        component={Level}
      />

      <Stack.Screen
        name={ROUTES.LOGIN}
        options={{headerShown: false}}
        component={Login}
      />

      <Stack.Screen
        name={ROUTES.SAMPLE_QUIZ}
        options={{headerShown: false}}
        component={SampleQuiz}
      />

      <Stack.Screen
        name={ROUTES.RECORDING}
        options={{
          headerShown: false,
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
          headerShown: false,
        }}
        component={Notifications}
      />

      <Stack.Screen
        name={ROUTES.NOTIFICATION_DETAILS}
        options={{
          headerShown: false,
        }}
        component={NotificationDetails}
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
          headerShown: false,
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
          headerShown: false,
        }}
        component={MarksImage}
      />
      <Stack.Screen
        name={ROUTES.MARKS_DETAILS}
        options={{
          headerShown: false,
        }}
        component={MarksDetails}
      />

      <Stack.Screen
        name={ROUTES.SELF_LEARN_SCREEN}
        options={{
          headerShown: false,
        }}
        component={SelfLearnScreen}
      />

      <Stack.Screen
        name={ROUTES.BRANCH_CHAPTERS}
        options={{
          headerShown: false,
        }}
        component={BranchChapters}
      />

      <Stack.Screen
        name={ROUTES.MEDCHAT}
        options={{
          headerShown: false,
        }}
        component={MedChat}
      />

      <Stack.Screen
        name={ROUTES.TOKENS}
        options={{
          headerShown: false,
        }}
        component={Tokens}
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
          headerShown: false,
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
        name={ROUTES.GLOBAL_LEADERBOARD}
        options={{
          headerShown: false,
        }}
        component={GlobalLeaderboard}
      />

      <Stack.Screen
        name={ROUTES.SUBSCRIPTIONS}
        options={{
          headerShown: false,
        }}
        component={Subscriptions}
      />

      <Stack.Screen
        name={ROUTES.RESUMES}
        options={{
          headerShown: false,
        }}
        component={Resumes}
      />

      <Stack.Screen
        name={ROUTES.TRANSLATIONS}
        options={{
          headerShown: false,
        }}
        component={Translations}
      />

      <Stack.Screen
        name={ROUTES.HELP}
        options={{
          headerShown: false,
        }}
        component={Help}
      />

      <Stack.Screen
        name={ROUTES.SUPPORT}
        options={{
          headerShown: false,
        }}
        component={Support}
      />

      <Stack.Screen
        name={ROUTES.TICKET_DETAILS}
        options={{
          headerShown: false,
        }}
        component={TicketDetails}
      />

      <Stack.Screen
        name={ROUTES.RAISE}
        options={{
          headerShown: false,
        }}
        component={Raise}
      />

      <Stack.Screen
        name={ROUTES.INVOICE}
        options={{
          headerShown: false,
        }}
        component={Invoice}
      />

      <Stack.Screen
        name={ROUTES.RESUMES_EDIT}
        options={{
          headerShown: false,
        }}
        component={ResumesEdit}
      />

      <Stack.Screen
        name={ROUTES.RESUMES_ADD}
        options={{
          headerShown: false,
        }}
        component={ResumesAdd}
      />

      <Stack.Screen
        name={ROUTES.PROFILE_SETTING}
        options={{
          headerShown: false,
        }}
        component={ProfileSetting}
      />
    </Stack.Navigator>
  );
};

export default StackNavigation;
