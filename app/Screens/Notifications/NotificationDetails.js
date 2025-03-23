import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Image,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import axiosInstance from '../../Components/axiosInstance';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {AppContext} from '../../theme/AppContext';
import moment from 'moment';
import {ROUTES} from '../../Constants/routes';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';

const NotificationDetails = () => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const {isDark} = useContext(AppContext);

  console.log(route.params);
  
  useEffect(() => {
    const fetchNotificationDetails = async () => {
      try {
        const notificationId = route.params?.notificationId;
        if (!notificationId) {
          throw new Error('Notification ID is required');
        }

        const response = await axiosInstance.get(
          `/admin/v2/notifications/${notificationId}`,
        );
        console.log(response.data);
        setNotification(response.data.notification);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notification details:', err);
        setError('Failed to load notification details');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationDetails();
  }, [route.params?.notificationId]);

  const handleActionPress = () => {
    if (notification?.url) {
      if (
        notification.url.startsWith('http://') ||
        notification.url.startsWith('https://') ||
        notification.url.startsWith('www.')
      ) {
        // Open external link
        const finalUrl = notification.url.startsWith('www.')
          ? `https://${notification.url}`
          : notification.url;
        Linking.openURL(finalUrl).catch(err =>
          console.error('An error occurred', err),
        );
      } else {
        // Navigate within the app
        if (ROUTES[notification.url]) {
          navigation.navigate(ROUTES[notification.url]);
          if (notification.url_params) {
            const paramsFix = notification.url_params.replace(
              /(\w+):/g,
              '"$1":',
            );
            const params = JSON.parse(paramsFix);
            navigation.navigate(ROUTES[notification.url], params);
          } else {
            navigation.navigate(ROUTES[notification.url]);
          }
        } else {
          console.log('Invalid route');
        }
      }
    }
  };

  const getNotificationIcon = type => {
    switch (type) {
      case 'alert':
        return 'alert-circle-outline';
      case 'warning':
        return 'warning-outline';
      case 'info':
        return 'information-circle-outline';
      case 'message':
        return 'chatbox-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = type => {
    switch (type) {
      case 'alert':
        return isDark ? '#ef4444' : '#ef4444';
      case 'warning':
        return isDark ? '#f59e0b' : '#f59e0b';
      case 'info':
        return isDark ? '#3b82f6' : '#3b82f6';
      case 'message':
        return isDark ? '#10b981' : '#10b981';
      default:
        return isDark ? '#6366f1' : '#6366f1';
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <View className="relative pb-4">
          <View className="absolute w-full top-0 left-0 right-0">
            <Image
              source={topBgBackground}
              className="w-full h-[200px] -mt-24"
              resizeMode="cover"
            />
          </View>
          <View className="flex-row justify-between items-center px-4 pt-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 rounded-full bg-opacity-20 bg-gray-500">
              <AntIcon
                name="arrowleft"
                size={24}
                color={isDark ? '#fff' : '#000'}
              />
            </TouchableOpacity>
            <Text
              className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
              Notification Details
            </Text>
            <View style={{width: 32}} />
          </View>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <Icon
            name="alert-circle-outline"
            size={70}
            color={isDark ? '#ef4444' : '#ef4444'}
          />
          <Text
            className={`text-lg font-medium mt-4 text-center ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => setLoading(true)}
            className="mt-6 bg-indigo-600 px-6 py-3 rounded-xl">
            <Text className="text-white font-semibold text-base">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = notification?.created_at
    ? moment(notification.created_at * 1000).format('MMM DD, YYYY • hh:mm A')
    : 'Unknown date';

  return (
    <SafeAreaView className={`flex-1 bg-b50 `}>
      <View className="relative pb-4">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
          />
        </View>
        <View className="flex-row justify-between items-center px-4">
          <PageTitle pageName="Notification Details" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <View
          className={`rounded-2xl overflow-hidden mb-6 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
          <View className="p-5">
            <View className="flex-row items-center mb-4">
              <View
                className="rounded-full p-3 mr-3"
                style={{
                  backgroundColor: getNotificationColor(notification?.type),
                }}>
                <Icon
                  name={getNotificationIcon(notification?.type)}
                  size={24}
                  color="#fff"
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-lg font-bold ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                  {notification?.title}
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  {formattedDate}
                </Text>
              </View>
            </View>

            <View
              className={`h-px my-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
            />

            <Text
              className={`text-base leading-6 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {notification?.message}
            </Text>

            {notification?.url && (
              <TouchableOpacity
                onPress={handleActionPress}
                className="mt-6 bg-indigo-600 py-3 rounded-xl flex-row justify-center items-center">
                <Text className="text-white font-semibold text-base mr-2">
                  View
                </Text>
                <AntIcon name="arrowright" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationDetails;
