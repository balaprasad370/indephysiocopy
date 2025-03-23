import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import storage from '../../Constants/storage';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';
import trackEvent from '../../Components/MixPanel';

const Index = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {level_id} = route.params;
  const {path, isDark, loader, setLoader} = useContext(AppContext);

  const [message, setMessage] = useState('');
  const [chapters, setChapters] = useState([]);
  const [isBranch, setIsBranch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChapters = async () => {
    const token = await storage.getStringAsync('token');
    if (!token) return;

    try {
      setLoader(true);
      setMessage('');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await axios.get(`${path}/admin/v7/chapters`, {
        params: {level_id},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      console.log('chapters response', response.data);
      clearTimeout(timeoutId);

      if (!response.data.success) {
        setMessage(response.data.message);
        setChapters([]);
      } else {
        setIsBranch(response.data?.is_branch || false);
        setChapters(response.data.chapters);
      }
    } catch (error) {
      // console.error('Error fetching chapters:', error);
      setMessage(error.response?.data?.message || 'Error loading chapters');
      setChapters([]);
    } finally {
      setLoader(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchChapters();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchChapters();
  }, []);

  const renderChapterCard = ({item}) => {
    const {progress} = item;
    const progressPercentage = progress?.completion_percentage || 0;

    const getProgressColors = percentage => {
      if (percentage >= 100) return {bg: '#22C55E', border: '#22C55E20'};
      if (percentage >= 75) return {bg: '#3B82F6', border: '#3B82F620'};
      if (percentage >= 50) return {bg: '#EAB308', border: '#EAB30820'};
      return {bg: '#EF4444', border: '#EF444420'};
    };

    const getButtonText = percentage => {
      if (percentage >= 100) return 'Review Chapter';
      if (percentage > 0) return 'Continue Learning';
      return 'Start Learning';
    };

    const colors = getProgressColors(progressPercentage);

    if (isBranch) {
      return (
        <View className="w-[92%] self-center rounded-[24px] shadow-xl mb-4 overflow-hidden border border-p1/20 bg-white dark:bg-n75">
          <Pressable
            android_ripple={{color: '#613BFF10'}}
            style={({pressed}) => [{opacity: pressed ? 0.95 : 1}]}
            onPress={() => {
              navigation.navigate(ROUTES.BRANCH_CHAPTERS, {
                category_id: item.category_id,
                title: item.category_title,
              });
            }}>
            <View className="relative">
              <View className="h-[120px]">
                {item.category_img ? (
                  <Image
                    resizeMode="cover"
                    className="w-full h-full"
                    source={{
                      uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.category_img}`,
                    }}
                  />
                ) : (
                  <View className="w-full h-full bg-n40 justify-center items-center">
                    <ActivityIndicator size="large" color="#613BFF" />
                  </View>
                )}
              </View>

              <View className="p-4">
                <View className="mb-2">
                  <Text className="text-lg font-bold text-p1 flex-wrap">
                    {item.category_title}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-wrap">
                  {item.category_description}
                </Text>

                <View className="mt-4">
                  <TouchableOpacity
                    className="mt-4 rounded-xl py-3 flex-row items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: '#613BFF',
                      shadowColor: '#613BFF',
                      shadowOpacity: 0.3,
                    }}
                    onPress={() => {
                      navigation.navigate(ROUTES.BRANCH_CHAPTERS, {
                        category_id: item.category_id,
                        title: item.category_title,
                      });
                    }}>
                    <MaterialIcons name="school" size={20} color="white" />
                    <Text className="ml-2 text-white font-bold text-sm">
                      Start Learning
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      );
    }

    return (
      <View className="w-[92%] self-center rounded-[24px] shadow-xl mb-4 overflow-hidden border border-p1/20 bg-white dark:bg-n75">
        <Pressable
          android_ripple={{color: '#613BFF10'}}
          style={({pressed}) => [{opacity: pressed ? 0.95 : 1}]}
          onPress={() => {
            if (!progress?.is_locked) {
              trackEvent('Chapters', {
                chapter_id: item.id,
                chapter_name: item.name,
                chapter_description: item.description,
              });

              navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
                parent_module_id: item.id,
                title: item.name,
                level_id: level_id,
              });
            }
          }}>
          <View
            className={`relative ${progress?.is_locked ? 'opacity-75' : ''}`}>
            <View className="h-[120px]">
              {item.image ? (
                <Image
                  resizeMode="cover"
                  className="w-full h-full"
                  source={{
                    uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.image}`,
                  }}
                />
              ) : (
                <View className="w-full h-full bg-n40 justify-center items-center">
                  <ActivityIndicator size="large" color="#613BFF" />
                </View>
              )}

              {progressPercentage > 0 && (
                <View
                  className="absolute top-2 right-2 z-50 bg-white px-3 py-1 rounded-full"
                  style={{borderWidth: 1, borderColor: colors.border}}>
                  <Text
                    className="font-semibold text-xs"
                    style={{color: colors.bg}}>
                    {progressPercentage >= 100
                      ? 'Completed'
                      : `${Math.round(progressPercentage)}% Complete`}
                  </Text>
                </View>
              )}
            </View>

            {progress?.is_locked && (
              <View className="absolute inset-0 bg-p1/50 backdrop-blur-[2px] flex items-center justify-center w-full h-full">
                <IonIcon name="lock-closed" size={48} color="#FFF" />
              </View>
            )}

            <View className="p-4">
              <View className="mb-2">
                <Text className="text-lg font-bold text-p1 flex-wrap">
                  {item.name}
                </Text>
              </View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-wrap">
                {item.description}
              </Text>

              {!progress?.is_locked && (
                <View className="mt-4">
                  {progressPercentage > 0 && (
                    <View
                      className="h-2 rounded-full overflow-hidden"
                      style={{backgroundColor: colors.border}}>
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${progressPercentage}%`,
                          backgroundColor: colors.bg,
                        }}
                      />
                    </View>
                  )}

                  <TouchableOpacity
                    className="mt-4 rounded-xl py-3 flex-row items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: colors.bg,
                      shadowColor: colors.bg,
                      shadowOpacity: 0.3,
                    }}
                    onPress={() => {
                      trackEvent('Chapters', {
                        chapter_id: item.id,
                        chapter_name: item.name,
                        chapter_description: item.description,
                      });

                      navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
                        parent_module_id: item.id,
                        title: item.name,
                        level_id: level_id,
                      });
                    }}>
                    <MaterialIcons name="school" size={20} color="white" />
                    <Text className="ml-2 text-white font-bold text-sm">
                      {getButtonText(progressPercentage)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

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
        <PageTitle pageName={`${isBranch ? 'Categories' : 'Chapters'}`} />
      </View>

      {loader ? (
        <View className="flex-1 justify-center items-center py-8">
          <ActivityIndicator size="large" color="#613BFF" />
        </View>
      ) : (
        <FlatList
          data={chapters}
          renderItem={renderChapterCard}
          keyExtractor={item => item.id?.toString()}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-4">
              <Text className="text-lg font-black text-center">
                {message || 'No chapters available'}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onError={error => {
            console.error('FlatList error:', error);
            setMessage('Error displaying content');
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Index;
