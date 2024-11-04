import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {ROUTES} from '../Constants/routes';
import COLOR from '../Constants/color';
import user from '../Constants/person.jpg';
import {AppContext} from '../theme/AppContext';
import storage from '../Constants/storage';
import {Icon} from 'react-native-vector-icons/Icon';
import Icons from 'react-native-vector-icons/MaterialIcons';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import color from '../Constants/color';

const DrawerContent = props => {
  const {userData, setIsAuthenticate, fetchTime} = useContext(AppContext);

  const navigation = useNavigation();

  const convertUTCToISTTime = dateString => {
    const formattedDateString = dateString.replace('T', ' ').replace('Z', '');
    // Parse the cleaned-up date string
    const date = new Date(formattedDateString);

    // Add 5 hours and 30 minutes to convert to IST
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    // Format to get the time in 'HH:mm' format
    const formattedTime = istDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // For 24-hour format
    });

    return formattedTime;
  };

  const logoutButton = async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await storage.setBoolAsync('isLoggedIn', false);
              storage.removeItem('token');
              storage.removeItem('show');
              storage.removeItem('email');
              setIsAuthenticate(false);
              navigation.navigate(ROUTES.LOGIN);
            } catch (error) {
              console.log('Error during logout:', error);
            }
          },
          style: 'destructive', // Optional: Set style to indicate danger (for destructive actions like logout)
        },
      ],
      {cancelable: true},
    );
  };

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600); // Calculate the hours
    const mins = Math.floor((seconds % 3600) / 60); // Calculate the minutes
    const secs = seconds % 60; // Remaining seconds

    return `${hrs}h ${mins}m ${secs}s`;
  };
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={{x: 25, y: 15}}
            onPress={() => navigation.navigate(ROUTES.PROFILE_SETTING)}
            style={{
              paddingRight: '3%',
            }}>
            <Image
              source={
                userData && userData.profile_pic
                  ? {
                      uri: `https://d2c9u2e33z36pz.cloudfront.net/${userData?.profile_pic}`,
                    }
                  : {
                      uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                    }
              }
              style={{width: 55, height: 55, borderRadius: 27}}
            />
          </TouchableOpacity>
          <Text style={[styles.username, {marginTop: 3, marginBottom: 3}]}>
            {userData?.first_name} {userData?.last_name}
          </Text>
          <Text style={styles.email}>{userData?.username}</Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 5,
              backgroundColor: color.darkPrimary,
              borderRadius: 5,
              padding: 5,
            }}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 5,
                padding: 5,
              }}>
              <Icons name="watch-later" size={40} color={color.white} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={{fontSize: 14}}>
                Clock started at{' '}
                {fetchTime && convertUTCToISTTime(fetchTime[0].created_date)}
              </Text>
              <Text style={{color: color.black, fontSize: 26}}>
                {fetchTime && fetchTime[0]?.total_app_time
                  ? formatTime(fetchTime[0].total_app_time)
                  : 'Loading...'}
              </Text>
            </View>
          </View>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        style={styles.logoutButton}
        onPress={logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white, // Replace with your preferred color
  },
  header: {
    // padding: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    // alignItems: 'center',
    backgroundColor: COLOR.primary,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    color: COLOR.black,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 16,
    color: COLOR.black,
  },
  logoutButton: {
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: COLOR.gray,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLOR.primary,
  },
});

export default DrawerContent;
