import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import {ROUTES} from '../../Constants/routes';
import Example from './LanguageCard';
import {AppContext} from '../../theme/AppContext';
import axios from 'axios';
import storage from '../../Constants/storage';
import {useNavigation} from '@react-navigation/native';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';
import trackEvent from '../../Components/MixPanel';
import axiosInstance from './../../Components/axiosInstance';

const SelfLearn = () => {
  const {isDark, path} = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(true);

  // Fetch languages from API with error handling and timeout
  const getLanguages = async () => {
    try {
      setLoader(true);
      setError(null);

      const response = await axiosInstance.get('/student/languages');

      if (!response?.data?.data) {
        throw new Error('Invalid response format');
      }

      setLanguages(response.data.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        setError('Request timed out. Please try again.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Error fetching languages. Please try again later.');
      }
      console.error('Error fetching languages:', error);
    } finally {
      setLoader(false);
    }
  };

  // Handle pull-to-refresh with error handling
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await getLanguages();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const navigation = useNavigation();

  // Fetch languages only when screen first mounts or navigates forward
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = navigation.addListener('focus', e => {
      if (isSubscribed && e.data?.action?.type === 'NAVIGATE') {
        getLanguages();
      }
    });

    // Initial fetch when component mounts
    if (isSubscribed) {
      getLanguages();
    }

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [navigation]);

  // Render individual language card with error handling
  const renderItem = ({item, index}) => {
    if (!item?.lang_id || !item?.language_name) {
      return null; // Skip rendering invalid items
    }

    return (
      <View className="my-2">
        <Example
          route={ROUTES.LEVEL}
          lang_id={item.lang_id}
          trackEvent={trackEvent}
          id={index}
          img={
            item.lang_img
              ? `https://d2c9u2e33z36pz.cloudfront.net/${item.lang_img}`
              : null
          }
          name={item.language_name}
          description={item.language_description || 'No description available'}
          status={item.status || 'locked'}
        />
      </View>
    );
  };

  const EmptyListComponent = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-lg font-black text-center">
        {error || 'Loading...'}
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
        <PageTitle pageName="Self Learning" hideBackButton={true} />
      </View>
      {loader ? (
        <LoadingComponent />
      ) : (
        <FlatList
          data={languages}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item?.lang_id || index}`}
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

export default SelfLearn;
