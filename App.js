// import React from 'react';

// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';

// import Home from './components/Home';
// import Meeting from './components/Meeting';

// const RootStack = createStackNavigator();

// const App = () => (
//   <NavigationContainer>
//     <RootStack.Navigator initialRouteName="Home">
//       <RootStack.Screen
//         component={Home}
//         name="Home"
//         options={{
//           headerShown: false,
//         }}
//       />
//       <RootStack.Screen
//         component={Meeting}
//         name="Meeting"
//         options={{
//           headerShown: false,
//         }}
//       />
//     </RootStack.Navigator>
//   </NavigationContainer>
// );

// export default App;
import {
  StyleSheet,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
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

enableScreens();

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const value = {
    isDark,
    setIsDark,
    setLoading,
  };

  const fetchToken = async () => {
    try {
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');
      if (isLoggedIn) {
        setLoading(true);
      }

      // if (isLoggedIn) {
      //   setLoading(true);
      // } else {
      //   try {
      //     const response = await axios.post('http://localhost:4000/userData', {
      //       token,
      //     });

      //     console.log('frontend', response.data);

      //   } catch (networkError) {
      //     console.error('Network error:', networkError);
      //   }
      // }
    } catch (storageError) {
      console.error('Error fetching token or isLoggedIn state:', storageError);
    }
  };

  async function verifyToken() {
    const token = await storage.getStringAsync('token');
    console.log('milgya', token);
    if (token !== null) {
      axios
        .post('http://192.168.1.4:4000/userData', {token: token})
        .then(res => {
          console.log('mila data', res.data);
          // setUserData(res.data.data);
        })
        .catch(error => {
          console.log('helo', error);
        });
    }
  }

  // const verifyToken = async () => {
  //   const token = await storage.getStringAsync('token');
  //   console.log('reeree', token);
  //   if (token !== null) {
  //     console.log('token yeh', token);
  //     try {
  //       await axios
  //         .post("'http:/localhost:4000/user", {token})
  //         .then(res => console.log('heybhagwan', res));
  //     } catch (error) {
  //       console.log('Error token is missing', error);
  //     }
  //   }
  // };

  useEffect(() => {
    // verifyToken();
    fetchToken();
  }, []);

  const style = isDark ? DarkTheme : LighTheme;

  return (
    <View style={style.appColor}>
      <AppContext.Provider value={value}>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            {loading ? <StackNavigation /> : <AuthNavigator />}
          </SafeAreaView>
        </NavigationContainer>
      </AppContext.Provider>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        flex: 1,
        paddingTop: 50,
      },
      android: {
        flex: 1,
        paddingTop: 20,
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
