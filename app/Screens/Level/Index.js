import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';
import trackEvent from '../../Components/MixPanel';
import axiosInstance from '../../Components/axiosInstance';

const Index = ({route}) => {
  const {path, isDark} = useContext(AppContext);
  const {lang_id} = route.params;
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [loader, setLoader] = useState(true);

  const fetchLevels = async () => {
    const token = await storage.getStringAsync('token');
    if (!token) {
      setError('Authentication token not found');
      return;
    }

    try {
      setLoader(true);
      setError(null);

      const response = await axiosInstance.get(`/student/v1/level/${lang_id}`);

      if (!response?.data?.data) {
        throw new Error('Invalid response format');
      }

      setLevels(response.data.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        setError('Request timed out. Please try again.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Error fetching levels. Please try again later.');
      }
      console.error('Error fetching levels:', error);
    } finally {
      setLoader(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchLevels();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = navigation.addListener('focus', e => {
      if (isSubscribed && e.data?.action?.type === 'NAVIGATE') {
        fetchLevels();
      }
    });

    if (isSubscribed) {
      fetchLevels();
    }

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [navigation]);

  const renderItem = ({item}) => (
    <View className="w-[92%] self-center rounded-[24px] shadow-xl mb-4 overflow-hidden border border-p1/20 bg-white dark:bg-n75">
      <Pressable
        android_ripple={{color: '#613BFF10'}}
        style={({pressed}) => [
          {
            opacity: pressed ? 0.95 : 1,
          },
        ]}
        onPress={() => {
          if (item.status !== 'locked') {
            trackEvent('Levels', {
              level_id: item.level_id,
              level_name: item.level_name,
              level_description: item.level_description,
            });
            navigation.navigate(ROUTES.CHAPTERS, {level_id: item.level_id});
          }
        }}>
        <View
          className={`relative ${
            item.status === 'locked' ? 'opacity-75' : ''
          }`}>
          <View className="h-[120px]">
            {item.level_img ? (
              <Image
                resizeMode="cover"
                className="w-full h-full"
                source={{
                  uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.level_img}`,
                }}
              />
            ) : (
              <View className="w-full h-full bg-n40 justify-center items-center">
                <ActivityIndicator size="large" color="#613BFF" />
              </View>
            )}
            {item.status !== 'locked' ? (
              <View className="absolute top-2 right-2 z-50 bg-white border border-green-600/20 px-3 py-1 rounded-full">
                <Text className="text-green-600 font-semibold text-xs">
                  Enrolled
                </Text>
              </View>
            ) : (
              <View className="absolute top-2 right-2 z-50 bg-white border border-red-600/20 px-3 py-1 rounded-full">
                <Text className="text-red-600 font-semibold text-xs">
                  Not Enrolled
                </Text>
              </View>
            )}
          </View>

          {item.status === 'locked' && (
            <View className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center w-full h-full">
              <View className="bg-white/90 rounded-2xl p-4 shadow-lg transform transition-all duration-200 hover:scale-105">
                <View className="relative">
                  <IonIcon name="lock-closed" size={40} color="#613BFF" />
                  <View className="absolute -top-1 -right-1">
                    <View className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  </View>
                </View>
              </View>
            </View>
          )}

          <View className="p-4">
            <View className="mb-2">
              <Text className="text-lg font-bold text-p1 flex-wrap">
                {item.level_name}
              </Text>
            </View>
            <Text className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-wrap">
              {item.level_description}
            </Text>

            {item.status !== 'locked' && (
              <Pressable
                className="mt-4 bg-p1 rounded-xl py-3 flex-row items-center justify-center shadow-lg shadow-p1/30"
                onPress={() => {
                  trackEvent('Levels', {
                    level_id: item.level_id,
                    level_name: item.level_name,
                    level_description: item.level_description,
                  });
                  navigation.navigate(ROUTES.CHAPTERS, {
                    level_id: item.level_id,
                  });
                }}>
                <MaterialIcons name="school" size={20} color="white" />
                <Text className="ml-2 text-white font-bold text-sm">
                  Start Learning
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );

  const EmptyListComponent = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-lg font-black text-center">
        {error || "You don't have access to this premium content"}
      </Text>
    </View>
  );

  const LoadingComponent = () => (
    <View className="flex-1 justify-center items-center py-8">
      <ActivityIndicator size="large" color="#613BFF" />
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 bg-b50 ${isDark ? 'bg-n75' : ''}`}>
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            onError={() => console.warn('Failed to load background image')}
          />
        </View>
        <PageTitle pageName="Levels" />
      </View>
      {loader ? (
        <LoadingComponent />
      ) : (
        <FlatList
          data={levels}
          renderItem={renderItem}
          keyExtractor={item => item.level_id.toString()}
          ListEmptyComponent={EmptyListComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onError={error => {
            console.error('FlatList error:', error);
            setError('Error displaying content');
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Index;
