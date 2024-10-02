import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import storage from '../../Constants/storage';

const useScreenTimeTracker = screenName => {
  const startTimeRef = useRef(null); // To store start time without causing re-renders
  const appStateRef = useRef(AppState.currentState); // Track the current app state

  // Load and save screen time using storage
  const saveScreenTime = async totalScreenTime => {
    try {
      await storage.setItem(`${screenName}_time`, totalScreenTime.toString());
    } catch (error) {
      console.error(`Error saving time for ${screenName}:`, error);
    }
  };

  // Function to calculate and save time spent on the screen
  const calculateAndSaveTime = async () => {
    const endTime = Date.now();
    const sessionTime = endTime - startTimeRef.current; // Calculate time spent

    // Load the saved total time and update it with the new session time
    try {
      const savedTime = await storage.getItem(`${screenName}_time`);
      const totalScreenTime = savedTime
        ? parseInt(savedTime, 10) + sessionTime
        : sessionTime;

      await saveScreenTime(totalScreenTime); // Save the updated total time
    } catch (error) {
      console.error(`Error calculating time for ${screenName}:`, error);
    }
  };

  // Handle app state changes (foreground/background)
  const handleAppStateChange = nextAppState => {
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      startTimeRef.current = Date.now(); // App enters the foreground
    } else if (
      appStateRef.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      // App is going to the background, calculate the time spent
      if (startTimeRef.current) {
        calculateAndSaveTime();
      }
    }

    appStateRef.current = nextAppState; // Update app state reference
  };

  // Start tracking when the component mounts
  useEffect(() => {
    // Set the start time when the component is mounted (screen is entered)
    startTimeRef.current = Date.now();

    // Add app state listener
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Clean up when the component unmounts (screen is exited)
    return () => {
      if (startTimeRef.current) {
        calculateAndSaveTime(); // Save the time on exit
      }
      if (subscription) subscription.remove(); // Remove event listener
    };
  }, [screenName]); // Only runs once when the component mounts/unmounts

  return null; // No need to return anything for now unless needed
};

export default useScreenTimeTracker;
