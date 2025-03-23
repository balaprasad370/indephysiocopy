import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import color from '../../Constants/color';

import LinearGradient from 'react-native-linear-gradient';
import Loading from '../../Components/Loading/Loading';
import IconTimer from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';

const Index = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {category_id, title = 'Untitled'} = route.params;
  const {path, clientId, packageId, isDark, loader, setLoader} =
    useContext(AppContext);

  const [message, setMessage] = useState('');
  const [chapters, setChapters] = useState([]);
  const style = isDark ? DarkTheme : LighTheme;
  const colors = {
    bg: isDark ? '#613BFF' : '#613BFF',
    border: isDark ? '#613BFF20' : '#613BFF20',
  };

  // Memoized function to fetch chapters data
  const fetchChapters = useCallback(async () => {
    const token = await storage.getStringAsync('token');
    if (!token) return;
    setLoader(true);
    try {
      const response = await axios.get(`${path}/admin/v1/chapters/branch`, {
        params: {
          category_id: category_id,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      if (response.data.success == false) {
        setMessage(response.data.message);
        setChapters([]);
      } else {
        setChapters(response.data.chapters);
      }
    } catch (error) {
      setMessage(error.response?.data?.message);
      setChapters([]);
    } finally {
      setLoader(false);
    }
  }, [path, category_id, clientId, packageId]);

  // Use useFocusEffect to refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchChapters();
    }, [fetchChapters]),
  );

  const getButtonText = percentage => {
    if (percentage >= 100) return 'Review Again';
    if (percentage > 0) return 'Continue Learning';
    return 'Start Learning';
  };

  const trackEvent = (name, properties) => {
    // Analytics tracking function placeholder
    console.log('Tracking event:', name, properties);
  };

  const renderChapterCard = ({item}) => {
    const progress = item.progress || {
      completion_percentage: 0,
      is_locked: false,
    };
    const progressPercentage = progress.completion_percentage || 0;

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

  if (loader) return <Loading />;

  return (
    <SafeAreaView style={{flex: 1}}>
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            onError={() => console.warn('Failed to load background image')}
          />
        </View>
        <PageTitle pageName={`${title}`} />
      </View>

      {chapters && chapters.length > 0 ? (
        <FlatList
          data={chapters}
          renderItem={renderChapterCard}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 16}}
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {message || 'No chapters available'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#613BFF',
    textAlign: 'center',
  },
});

export default Index;
