import {StatusBar, StyleSheet, View, AppState} from 'react-native';
import React, {useContext, useEffect, useRef} from 'react';
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

const AppNavigator = () => {
  const {isAuthenticate, isDark, show, path} = useContext(AppContext);

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef(null);
  const startTimeRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

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
      console.error('Error sending open and exit times:', error);
    }
  };

  const saveTimeForDay = async (screenName, timeSpent) => {
    try {
      const today = new Date().toISOString();
      const key = `${today}_${screenName}_time`;
      const savedTime = storage.getString(key) || '0';
      const totalTime = parseInt(savedTime, 10) + timeSpent;
      storage.setString(key, totalTime.toString());

      // Format the total time for better readability
      const {hours, minutes, seconds} = formatTime(totalTime);
      // console.log(
      //   `Total time spent on ${screenName} today: ${hours}h ${minutes}m ${seconds}s`,
      // );
    } catch (error) {
      console.error('Error saving time:', error);
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
      console.error('Error storing time spent data:', error);
    }
  };
  // Create a reference to store params of the previous screen (Reading screen)

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

      if (activityType) {
        const {chapterId, orderId, unique_id} =
          previousScreenParams.current || {};

        if (chapterId && orderId && unique_id) {
          // Send the time spent to the backend
          await storeTimeInDatabase({
            chapterId,
            activity: activityType,
            orderId,
            timeSpent,
            unique_id,
          });

          // Clear the time after it's sent
          if (activityType === 'reading_material') {
            readingTimeRef.current = 0;
          } else if (activityType === 'flashcards') {
            flashTimeRef.current = 0;
          } else if (activityType === 'quiz') {
            quizTimeRef.current = 0;
          } else if (activityType === 'assessments') {
            assessmentTimeRef.current = 0;
          }
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
    if (nextAppState === 'active') {
      startTimeRef.current = Date.now(); // Reset the start time
      await saveOpenTime(); // Store open time
    }

    // Check if the app is going to the background or inactive
    if (
      appStateRef.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      const endTime = Date.now();
      const timeSpent = endTime - startTimeRef.current;

      // Send app exit time
      await saveExitTime();

      const token = await storage.getString('token');
      try {
        await axios.post(
          `${path}/store-app-usage`,
          {
            total_app_time: timeSpent,
            flash_time: flashTimeRef.current,
            reading_time: readingTimeRef.current,
            quiz_time: quizTimeRef.current,
            assessment_time: assessmentTimeRef.current,
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
        console.error('Error sending total app usage data:', error);
      }
    }

    appStateRef.current = nextAppState; // Update the app state
  };

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
