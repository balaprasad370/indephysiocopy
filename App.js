import {
  StyleSheet,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import DarkTheme from './app/theme/Darktheme';
import LighTheme from './app/theme/LighTheme';
import StackNavigation from './app/Navigation/StackNavigation';
import AuthNavigator from './app/Navigation/AuthNavigator';
import axios from 'axios';
import {AppContext} from './app/theme/AppContext';
import storage from './app/Constants/storage';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import LoadComponent from './app/Components/Loading/Index';

import color from './app/Constants/color';
import {ROUTES} from './app/Constants/routes';

enableScreens();

const App = ({navigation}) => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const [userData, setUserData] = useState(null);

  const [loadTime, setLoadTIme] = useState(false);

  // const getDatFunc = async () => {
  //   try {
  //     const token = await storage.getStringAsync('token');
  //     const isLoggedIn = await storage.getBoolAsync('isLoggedIn');
  //     if (token) {
  //       const res = await axios({
  //         method: 'get',
  //         // url: 'https://server.indephysio.com/getDetails',
  //         url: 'http://192.168.1.5:4000/getDetails',

  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: 'Bearer ' + token,
  //         },

  //       });
  //       console.log('yeh reha flashcard', res.data);
  //     }
  //   } catch (error) {
  //     console.log('errormessage', error);
  //     if (error.response && error.response.status === 403) {
  //       console.log('yell chla');
  //       await storage.setBoolAsync('isLoggedIn', false);
  //       await storage.setStringAsync('token', null);
  //       setLoading(false);
  //     }
  //   }
  // };

  const chapterData = async () => {
    const token = await storage.getStringAsync('token');

    try {
      const response = await axios.get('http://192.168.1.5:4000/chapters');

      console.log('response', response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getDatFunc = async () => {
    try {
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');
      const token = await storage.getStringAsync('token');

      if (token) {
        const email = 'impaaras00@gmail.com';
        const userType = 'student';

        const res = await axios({
          method: 'get',
          url: `http://192.168.1.5:4000/getDetails?email=${encodeURIComponent(
            email,
          )}&userType=${encodeURIComponent(userType)}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });

        console.log('Response Data:', res.data);
      }
    } catch (error) {
      console.log('Error Message:', error);
      if (error.response && error.response.status === 403) {
        console.log('Token expired or invalid');
        await storage.setBoolAsync('isLoggedIn', false);
        await storage.setStringAsync('token', null);
        setLoading(false);
      }
    }
  };

  // /profile/status

  const fetchProfile = async () => {
    try {
      const response = await axios.post(
        'https://server.indephysio.com/profile',
        {student_id: '111085'},
      );
      setUserData(response.data);
    } catch (error) {
      console.log('error from fetching data from profile', error);
    }
  };

  const fetchToken = async () => {
    try {
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');
      const token = await storage.getStringAsync('token');
      if (isLoggedIn) {
        setLoading(true);
      }
    } catch (storageError) {
      console.error('Error fetching token or isLoggedIn state:', storageError);
    }
  };
  useEffect(() => {
    chapterData();
    fetchProfile();
    getDatFunc();
    fetchToken();
  }, []);

  const value = {
    isDark,
    setIsDark,
    setLoading,
    loadTime,
    setLoadTIme,
    userData,
  };

  const style = isDark ? DarkTheme : LighTheme;

  return (
    // <View style={style.appColor}>
    <AppContext.Provider value={value}>
      <NavigationContainer>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#000' : '#fff'}
        />
        {/* <SafeAreaView style={styles.container}> */}
        {loading ? <StackNavigation /> : <AuthNavigator />}
        {/* </SafeAreaView> */}
      </NavigationContainer>
    </AppContext.Provider>
    // </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        flex: 1,
        paddingTop: 20,
      },
      android: {
        flex: 1,
        paddingTop: 10,
      },
    }),
  },
  activityContain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  activityIndicator: {
    width: '20%',
  },
});
