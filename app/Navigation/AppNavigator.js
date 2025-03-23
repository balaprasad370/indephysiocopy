import {
  StatusBar,
  StyleSheet,
  View,
  AppState,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import StackNavigation from './StackNavigation';
import AuthNavigator from './AuthNavigator';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {AppContext} from '../theme/AppContext';
import Toast from '../Components/Toast/Index';
import storage from '../Constants/storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {ROUTES} from '../Constants/routes';
import notifee, {EventType} from '@notifee/react-native';
import SubscriptionExpiry from '../Screens/SubscriptionExpiry/Index';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import trackEvent from '../Components/MixPanel/index';

const AppNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  const {isAuthenticate, isDark, show, path} = useContext(AppContext);

  const routeNameRef = useRef(null);
  const startTimeRef = useRef(null);
  const appStartTimeRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const [isConnected, setIsConnected] = useState(true);
  const [subscriptionExpiryStatus, setSubscriptionExpiryStatus] =
    useState(false);
  const [subscriptionModal, setSubscriptionModal] = useState(false);

  const [currentRoute, setCurrentRoute] = useState(null);

  // Helper function to convert milliseconds to hours, minutes, and seconds
  const formatTime = timeInMillis => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {hours, minutes, seconds};
  };
  let appOpenTime = '';

  const saveOpenTime = () => {
    appOpenTime = Date.now();
  };

  const saveExitTime = async () => {
    const appExitTime = Date.now();

    const token = await storage.getString('token');
    if (!token) {
      return;
    }
    if (!path) {
      return;
    }
    try {
      await axios.post(
        `${path}/student/v1/store-app-time`,
        {
          app_open_time: appOpenTime,
          app_close_time: appExitTime,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      if (error.response?.status === 403) {
        // Handle token refresh or redirect to login
      }
    }
  };

  const saveTimeForDay = async (screenName, timeSpent) => {
    try {
      const today = new Date().toISOString();
      const key = `${today}_${screenName}_time`;
      const savedTime = storage.getString(key) || '0';
      const totalTime = parseInt(savedTime, 10) + timeSpent;
      storage.setString(key, totalTime.toString());
      const {hours, minutes, seconds} = formatTime(totalTime);
    } catch (error) {
      // Error handling
    }
  };
  const previousScreenParams = useRef(null);
  const assessmentTimeRef = useRef(0);
  const flashTimeRef = useRef(0);
  const readingTimeRef = useRef(0);
  const quizTimeRef = useRef(0);

  const storeTimeInDatabase = async ({
    chapterId,
    activity,
    orderId,
    timeSpent,
    unique_id,
  }) => {
    const token = await storage.getString('token');

    if (!token) {
      return;
    }

    if (!path) {
      return;
    }
    try {
      const response = await axios.post(
        `${path}/store-activity-time`,
        {
          chapter_id: chapterId,
          activity,
          order_id: orderId,
          time_spent: timeSpent, // Time in milliseconds
          unique_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      // Error handling
    }
  };

  const handleRouteChange = async (previousRouteName, currentRouteName) => {
    const endTime = Date.now();
    const timeSpent = endTime - startTimeRef.current;

    if (previousRouteName) {
      let activityType = null;

      // Check which screen we are exiting and set the activity type
      if (previousRouteName === 'Reading') {
        activityType = 'reading_material';
        readingTimeRef.current += timeSpent;
      } else if (previousRouteName === 'Flash') {
        activityType = 'flashcards';
        flashTimeRef.current += timeSpent;
      } else if (previousRouteName === 'Quiz') {
        activityType = 'quiz';
        quizTimeRef.current += timeSpent;
      } else if (previousRouteName === 'Assessments') {
        activityType = 'assessments';
        assessmentTimeRef.current += timeSpent;
      }

      let timeSpent2 = timeSpent / 1000;

      if (activityType) {
        const {chapterId, orderId, unique_id} =
          previousScreenParams.current || {};

        if (chapterId && orderId && unique_id) {
          // Send the time spent to the backend
          await storeTimeInDatabase({
            chapterId,
            activity: activityType,
            orderId,
            timeSpent: timeSpent2,
            unique_id,
          });
        }
      }

      await saveTimeForDay(previousRouteName, timeSpent);
    }

    if (
      currentRouteName === 'Reading' ||
      currentRouteName === 'Flash' ||
      currentRouteName === 'Assessments' ||
      currentRouteName === 'Quiz'
    ) {
      const currentRoute = navigationRef.getCurrentRoute();
      previousScreenParams.current = {
        chapterId: currentRoute?.params?.chapter_id,
        orderId: currentRoute?.params?.order_id,
        unique_id: currentRoute?.params?.unique_id,
      };
    }

    // Reset start time for the new screen
    startTimeRef.current = Date.now();
  };

  const handleAppStateChange = async nextAppState => {
    return;

    if (nextAppState === 'active') {
      appStartTimeRef.current = Date.now(); // Reset the app-specific start time
      saveOpenTime(); // Store open time
    }

    if (
      appStateRef.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      const endTime = Date.now();
      const timeSpentInApp = endTime - appStartTimeRef.current; // Use app-specific start time

      const timespent2 = timeSpentInApp / 1000;

      const token = await storage.getString('token');

      if (!token) {
        return;
      }

      if (!path) {
        return;
      }
      let flashTime2 = flashTimeRef.current / 1000;
      let readingTime2 = readingTimeRef.current / 1000;
      let quizTime2 = quizTimeRef.current / 1000;
      let assessmentTime2 = assessmentTimeRef.current / 1000;
      await saveExitTime();

      try {
        await axios.post(
          `${path}/store-app-usage`,
          {
            total_app_time: timespent2, // Convert to seconds
            flash_time: flashTime2,
            reading_time: readingTime2,
            quiz_time: quizTime2,
            assessment_time: assessmentTime2,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        flashTimeRef.current = 0;
        readingTimeRef.current = 0;
        quizTimeRef.current = 0;
        assessmentTimeRef.current = 0;
      } catch (error) {
        // Error handling
      }
    }

    appStateRef.current = nextAppState; // Update the app state
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        navigationRef.navigate(ROUTES.OFFLINE); // Redirect to Offline screen when no internet
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);
  useEffect(() => {
    // Immediately check the current app state on mount
    const currentAppState = AppState.currentState;
    handleAppStateChange(currentAppState);
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Handle foreground notifications
    const unsubscribeForeground = notifee.onForegroundEvent(
      ({type, detail}) => {
        if (type === EventType.PRESS) {
          const link = detail?.notification?.data?.link || null;
          let params = detail?.notification?.data?.params || null;

          if (link === null) {
            return;
          }
          // Check if params is a string, then convert it to an object
          if (typeof params === 'string') {
            try {
              params = JSON.parse(params);
            } catch (error) {
              params = {}; // Fallback to empty object if parsing fails
            }
          }

          if (link) {
            navigationRef.navigate(link, params);
          }
        }
      },
    );

    // Handle background messages
    const unsubscribeBackground = notifee.onBackgroundEvent(
      async ({type, detail}) => {
        if (type === EventType.PRESS) {
          // You can store the navigation data to be used when the app is opened
          const link = detail?.notification?.data?.link || null;
          const params = detail?.notification?.data?.params || null;

          if (link) {
            // For background events, you might want to store this information
            // to navigate when the app is opened
            navigationRef.navigate(link, params);

            await storage.setString('pendingNotificationLink', link);
            await storage.setString(
              'pendingNotificationParams',
              JSON.stringify(params),
            );
          }
        }
      },
    );

    return () => {
      unsubscribeForeground();
    };
  }, []);

  const linking = {
    prefixes: [
      'meduniverse://',
      'https://meduniverse.in',
      'https://www.meduniverse.in',
    ], // Custom URL scheme & universal link
    config: {
      screens: {
        // Main screens
        [ROUTES.HOME_TAB]: 'home',
        [ROUTES.PROFILE_SETTING]: 'profile/:userId?',

        // Learning paths
        [ROUTES.LEVEL]: 'level/:levelId?',
        [ROUTES.CHAPTERS]: 'chapters/:branchId?',
        [ROUTES.BRANCH_CHAPTERS]: 'branch/:branchId?',
        [ROUTES.SELF_LEARN_SCREEN]: 'selflearn/:courseId?',
        [ROUTES.READING]: 'reading/:chapterId?',

        // Content screens
        [ROUTES.FLASH]: 'flashcards/:chapterId?',
        [ROUTES.SAMPLE_QUIZ]: 'samplequiz/:quizId?',
        [ROUTES.ASSESSMENTS]: 'assessment/:assessmentId?',
        [ROUTES.RECORDING]: 'recording/:recordingId?',
        [ROUTES.FILTER_RECORDING]: 'recordings/filter',

        // User features
        [ROUTES.SUBSCRIPTIONS]: 'subscriptions',
        [ROUTES.NOTIFICATIONS]: 'notifications',
        [ROUTES.NOTIFICATION_DETAILS]: 'notification/:notificationId?',
        [ROUTES.LEADERBOARD]: 'leaderboard',
        [ROUTES.GLOBAL_LEADERBOARD]: 'global-leaderboard',

        // Support and help
        [ROUTES.HELP]: 'help',
        [ROUTES.SUPPORT]: 'support',
        [ROUTES.TICKET_DETAILS]: 'ticket/:ticketId?',
        [ROUTES.RAISE]: 'raise-ticket',

        // Other features
        [ROUTES.FILTER_SCREEN]: 'filter',
        [ROUTES.STUDENT_ACCESS]: 'student-access',
        [ROUTES.TRANSLATIONS]: 'translations',
        [ROUTES.RESUMES]: 'resumes',
        [ROUTES.RESUMES_EDIT]: 'resume/edit/:resumeId?',
        [ROUTES.RESUMES_ADD]: 'resume/add',
        [ROUTES.MEDCHAT]: 'medchat',
        [ROUTES.TOKENS]: 'tokens',
        [ROUTES.OFFLINE]: 'offline',
        [ROUTES.INVOICE]: 'invoice/:invoiceId?',
        [ROUTES.PRICING]: 'pricing',
      },
    },
  };

  const getSubscriptionExpiry = async () => {
    const token = await storage.getStringAsync('token');
    if (!token) {
      return;
    }
    try {
      const response = await axios.get(
        `${path}/admin/v2/subscription-timestamp`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSubscriptionExpiryStatus(response?.data?.expired);
      setSubscriptionModal(response?.data?.expired);
    } catch (error) {
      // Error handling
    }
  };

  useEffect(() => {
    getSubscriptionExpiry();
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
        startTimeRef.current = Date.now();
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;
        // console.log('currentRouteName', currentRouteName);

        try {
          const mixPanelNeglectedRoutes = [
            ROUTES?.CHAPTERS,
            ROUTES?.LEVEL,
            ROUTES?.SELF_LEARN_SCREEN,
            ROUTES?.READING,
            ROUTES?.FLASH,
            ROUTES?.SAMPLE_QUIZ,
            ROUTES?.ASSESSMENTS,
            ROUTES?.RECORDING,
          ];

          if (!mixPanelNeglectedRoutes.includes(currentRouteName)) {
            trackEvent(currentRouteName, {
              screen: currentRouteName,
            });
          }
        } catch (error) {
          // console.log('error', error);
        }

        setCurrentRoute(currentRouteName);

        const neglectedRoutes = [
          ROUTES.SUBSCRIPTIONS,
          ROUTES.INVOICE,
          ROUTES.STUDENT_ACCESS,
          ROUTES.LOGIN,
          ROUTES.WELCOME,
        ];
        if (neglectedRoutes.includes(currentRouteName)) {
          setSubscriptionModal(false);
          return;
        } else {
          setSubscriptionModal(true);
        }

        if (
          previousRouteName == ROUTES.LOGIN &&
          currentRouteName == ROUTES.HOME_TAB
        ) {
          getSubscriptionExpiry();
        }

        if (
          previousRouteName == ROUTES.HOME &&
          currentRouteName == ROUTES.HOME
        ) {
          getSubscriptionExpiry();
        }

        routeNameRef.current = currentRouteName;
      }}>
      <StatusBar backgroundColor={'#613BFF'} />
      <Toast visible={show} onClose={() => setShow(false)} />
      {isAuthenticate ? <StackNavigation /> : <AuthNavigator />}
      {subscriptionExpiryStatus && subscriptionModal && (
        <View className="absolute inset-0 bg-black/40 bg-opacity-10 h-full w-full">
          <SubscriptionExpiry
            subscriptionExpiryStatus={subscriptionExpiryStatus}
            navigation={navigationRef}
          />
        </View>
      )}

      {[ROUTES.CHAPTERS, ROUTES.LEVEL, ROUTES.SELF_LEARN_SCREEN].includes(
        currentRoute,
      ) && (
        <View style={styles.fabContainer}>
          <TouchableOpacity
            onPress={() => navigationRef.navigate(ROUTES.HOME)}
            style={styles.fab}>
            <MaterialIcons name="home" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#613BFF',
    borderRadius: 30,
    padding: 15,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AppNavigator;
