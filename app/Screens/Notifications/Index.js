import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState, useCallback} from 'react';
import storage from '../../Constants/storage';
import {AppContext} from '../../theme/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {FlashList} from '@shopify/flash-list';
import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import axiosInstance from '../../Components/axiosInstance';

const Index = () => {
  const {path, isDark} = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const getNotifications = async () => {
    setLoading(true);
    const token = await storage.getStringAsync('token');

    if (token) {
      try {
        const response = await axiosInstance.get(`/admin/v2/notifications`);

        console.log(response.data.notifications);

        if (response.data.status) {
          setNotifications(response.data.notifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        setNotifications([]);
        console.log('error', error);
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    } else {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getNotifications();
  }, []);

  useEffect(() => {
    getNotifications();
  }, []);

  const formatDate = timestamp => {  
    return moment(timestamp * 1000).fromNow();
  };

  const handleNotificationPress = (notificationId) => {
    navigation.navigate(ROUTES.NOTIFICATION_DETAILS, {
      notificationId: notificationId,
    });
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

  const getNotificationColor = (type, isRead) => {
    if (isRead) {
      return isDark ? 'bg-gray-700' : 'bg-gray-100';
    }

    switch (type) {
      case 'alert':
        return isDark ? 'bg-red-800' : 'bg-red-500 bg-opacity-20';
      case 'warning':
        return isDark ? 'bg-amber-800' : 'bg-amber-500 bg-opacity-20';
      case 'info':
        return isDark ? 'bg-blue-800' : 'bg-blue-500 bg-opacity-20';
      case 'message':
        return isDark ? 'bg-green-800' : 'bg-green-500 bg-opacity-20';
      default:
        return isDark ? 'bg-indigo-800' : 'bg-p1 bg-opacity-20';
    }
  };

  const getNotificationTextColor = (type, isRead) => {
    if (isRead) {
      return isDark ? 'text-gray-300' : 'text-gray-800';
    }

    switch (type) {
      case 'alert':
        return isDark ? 'text-red-300' : 'text-red-700';
      case 'warning':
        return isDark ? 'text-amber-300' : 'text-amber-700';
      case 'info':
        return isDark ? 'text-blue-300' : 'text-blue-700';
      case 'message':
        return isDark ? 'text-green-300' : 'text-green-700';
      default:
        return isDark ? 'text-indigo-300' : 'text-p1';
    }
  };

  const getNotificationBgColor = (type, isRead) => {
    if (isRead) {
      return isDark ? 'bg-gray-800' : 'bg-white';
    }

    switch (type) {
      case 'alert':
        return isDark ? 'bg-red-900/30' : 'bg-red-50';
      case 'warning':
        return isDark ? 'bg-amber-900/30' : 'bg-amber-50';
      case 'info':
        return isDark ? 'bg-blue-900/30' : 'bg-blue-50';
      case 'message':
        return isDark ? 'bg-green-900/30' : 'bg-green-50';
      default:
        return isDark ? 'bg-indigo-900/30' : 'bg-p1/20';
    }
  };

  const renderItem = ({item}) => {
    const isRead = item.is_read === 1;

    return (
      <TouchableOpacity
        className="mb-3"
        onPress={() => handleNotificationPress(item.id, item.url)}>
        <View
          className={`flex-row items-start p-4 rounded-xl shadow-sm ${getNotificationBgColor(
            item.type,
            isRead,
          )}`}>
          <View
            className={`${getNotificationColor(
              item.type,
              isRead,
            )} rounded-full p-3 mr-3`}>
            <Icon
              name={getNotificationIcon(item.type)}
              size={22}
              color={isRead ? (isDark ? '#9ca3af' : '#4b5563') : '#fff'}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <Text
                numberOfLines={1}
                className={`text-base font-semibold ${getNotificationTextColor(
                  item.type,
                  isRead,
                )}`}>
                {item.title}
              </Text>
              <Text
                className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                {formatDate(item.created_at)}
              </Text>
            </View>
            <Text
              numberOfLines={4}
              className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-neutral-500'
              } py-1`}>
              {item.message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View className="flex items-center justify-center py-10">
      <Icon
        name="notifications-off-outline"
        size={50}
        color={isDark ? '#6366f1' : '#9ca3af'}
      />
      <Text
        className={`text-center mt-4 text-base ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
        No notifications available
      </Text>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-b50'}`}>
      <View className="relative pb-4">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
          />
        </View>
        <View className="flex-row justify-between items-center px-4">
          <PageTitle pageName="Notifications" />
        </View>
      </View>

      <View className="flex-1 px-4 py-4">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Loading notifications...
            </Text>
          </View>
        ) : (
          <FlashList
            data={notifications}
            renderItem={renderItem}
            estimatedItemSize={100}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Index;
