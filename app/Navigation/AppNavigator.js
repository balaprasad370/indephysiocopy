import {StatusBar, StyleSheet, View, AppState} from 'react-native';
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

const AppNavigator = () => {
  const {isAuthenticate, isDark, show, path} = useContext(AppContext);

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef(null);
  const startTimeRef = useRef(null);
  const appStartTimeRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const [isConnected, setIsConnected] = useState(true);

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
    appOpenTime = Date.now(); // Save the open time in UTC
    console.log(`App opened at (UTC): ${appOpenTime}`);
  };

  const saveExitTime = async () => {
    const appExitTime = Date.now(); // Save the exit time in UTC
    console.log(`App exited at (UTC): ${appExitTime}`);

    const token = await storage.getString('token'); // Replace with your method of getting the token

    // Send the open and exit times to the backend
    try {
      await axios.post(
        `${path}/store-app-time`,
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
      console.log('Open and exit times sent successfully');
    } catch (error) {
      console.log('Error sending open and exit times:', error);
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
      console.log(`totalTime`, totalTime);
    } catch (error) {
      console.log('Error saving time:', error);
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

      // console.log('Time spent data stored successfully:', response.data);
    } catch (error) {
      console.log('Error storing time spent data:', error);
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

      // await saveTimeForDay(previousRouteName, timeSpent);
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
    if (nextAppState === 'active') {
      appStartTimeRef.current = Date.now(); // Reset the app-specific start time
      await saveOpenTime(); // Store open time
    }

    if (
      appStateRef.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      const endTime = Date.now();
      const timeSpentInApp = endTime - appStartTimeRef.current; // Use app-specific start time

      console.log(timeSpentInApp);

      const timespent2 = timeSpentInApp / 1000;

      const token = await storage.getString('token');
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

        console.log('Total app time sent successfully');

        // Clear the times after successful submission
        flashTimeRef.current = 0;
        readingTimeRef.current = 0;
        quizTimeRef.current = 0;
        assessmentTimeRef.current = 0;
      } catch (error) {
        console.log('Error sending total app usage data:', error);
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

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
        startTimeRef.current = Date.now();
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await handleRouteChange(previousRouteName, currentRouteName);
          routeNameRef.current = currentRouteName;
        }
      }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000' : '#FFF'}
      />
      <Toast visible={show} onClose={() => setShow(false)} />
      {isAuthenticate ? <StackNavigation /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
