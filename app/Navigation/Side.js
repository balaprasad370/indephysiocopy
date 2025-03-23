import React, {useContext, useEffect, useMemo} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {ROUTES} from '../Constants/routes';
import COLOR from '../Constants/color';
import {AppContext} from '../theme/AppContext';
import storage from '../Constants/storage';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import trackEvent, {mixPanel} from './../Components/MixPanel/index';

const DrawerContent = props => {
  const {userData, setIsAuthenticate, fetchTime} = useContext(AppContext);
  const navigation = useNavigation();

  const convertUTCToISTTime = dateString => {
    const formattedDateString = dateString.replace('T', ' ').replace('Z', '');
    const date = new Date(formattedDateString);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);

    return istDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
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
              await storage.removeItem('token');
              await storage.removeItem('studentName');
              await storage.removeItem('studentId');
              await storage.removeItem('email');
              await storage.removeItem('isAdmin');

              trackEvent('Log out');
              mixPanel.reset();

              setIsAuthenticate(false);
              navigation.navigate(ROUTES.LOGIN);
            } catch (error) {
              console.log('Error during logout:', error);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs}h ${mins}m ${secs}s`;
  };

  const profileImage = useMemo(() => {
    return userData && userData.profile_pic
      ? {uri: `https://d2c9u2e33z36pz.cloudfront.net/${userData?.profile_pic}`}
      : {uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'};
  }, [userData]);

  const navigationItems = [
    {
      name: 'Dashboard',
      route: ROUTES.DASHBOARD,
      icon: <Ionicons name="home-outline" size={24} color={COLOR.primary} />,
    },
    {
      name: 'Live Classes',
      route: ROUTES.LIVE_CLASS,
      icon: (
        <Ionicons name="videocam-outline" size={24} color={COLOR.primary} />
      ),
    },
    {
      name: 'Self Learn',
      route: ROUTES.SELF_LEARN,
      icon: <Ionicons name="book-outline" size={24} color={COLOR.primary} />,
    },
    {
      name: 'MedTalk AI',
      route: ROUTES.MEDTALK,
      icon: (
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color={COLOR.primary}
        />
      ),
      newLabel: true,
    },

    {
      name: 'Profile Settings',
      route: ROUTES.PROFILE_SETTING,
      icon: (
        <Ionicons name="settings-outline" size={24} color={COLOR.primary} />
      ),
    },

    {
      name: 'Subscription',
      route: ROUTES.SUBSCRIPTIONS,
      icon: (
        <Ionicons name="pricetag-outline" size={24} color={COLOR.primary} />
      ),
    },

    {
      name: 'Resumes',
      route: ROUTES.RESUMES,
      icon: (
        <Ionicons name="document-outline" size={24} color={COLOR.primary} />
      ),
    },

    {
      name: 'Help',
      route: ROUTES.HELP,
      icon: (
        <Ionicons name="help-circle-outline" size={24} color={COLOR.primary} />
      ),
    },

    {
      name: 'Support',
      route: ROUTES.SUPPORT,
      icon: <Ionicons name="call-outline" size={24} color={COLOR.primary} />,
    },
  ];

  const NavigationItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(item.route)}
      className="flex-row items-center px-5 py-3 mb-1 w-full">
      <View className="flex-row items-center">
        {item.icon}
        <Text className="ml-3 text-base font-medium text-primary">
          {item.name}
        </Text>
        {item.newLabel && (
          <View className="ml-2 bg-p1 px-2 py-0.5 rounded-full">
            <Text className="text-xs text-white font-bold">NEW</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{paddingTop: 0}}>
        <LinearGradient
          colors={[COLOR.primary, '#613BFF']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          className="px-4 py-6">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.PROFILE_SETTING)}
              className="mr-3">
              <Image
                source={profileImage}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white" numberOfLines={1}>
                {userData?.first_name} {userData?.last_name}
              </Text>
              <Text className="text-white text-opacity-90" numberOfLines={1}>
                {userData?.username}
              </Text>
            </View>
          </View>

          <View className="bg-b50 bg-opacity-10 rounded-xl p-3 mt-2">
            <View className="flex-row items-center">
              <View className="bg-white bg-opacity-20 rounded-lg p-2 mr-3">
                <Icons name="watch-later" size={28} color="#613BFF" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-p1 text-opacity-90">
                  Clock started at{' '}
                  {fetchTime && convertUTCToISTTime(fetchTime[0].created_date)}
                </Text>
                <Text className="text-p1 text-xl font-semibold">
                  {fetchTime && fetchTime[0]?.total_app_time
                    ? formatTime(fetchTime[0].total_app_time)
                    : 'Loading...'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View className="py-4 mt-2">
          {navigationItems.map((item, index) => (
            <NavigationItem key={index} item={item} />
          ))}
        </View>
      </DrawerContentScrollView>

      <TouchableOpacity
        onPress={logoutButton}
        className="flex-row items-center justify-center mx-5 my-4 py-3 px-4 bg-p1 rounded-xl shadow-md border border-opacity-20 border-white">
        <View className="flex-row items-center">
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="ml-3 text-base font-bold text-white">Logout</Text>
        </View>
        {/* <View className="absolute right-3">
          <Ionicons
            name="arrow-forward-circle-outline"
            size={20}
            color="white"
          />
        </View> */}
      </TouchableOpacity>
    </View>
  );
};

export default DrawerContent;
