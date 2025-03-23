import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useContext, useCallback} from 'react';
import axiosInstance from './../../Components/axiosInstance';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../theme/AppContext';
import YoutubeIframe from 'react-native-youtube-iframe';
import Video from 'react-native-video';
import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';

const Index = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState({});

  const {isDark} = useContext(AppContext);

  useEffect(() => {
    fetchHelpVideos();
  }, []);

  const fetchHelpVideos = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/help');
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching help videos:', err);
      setError('Failed to load help videos. Please try again later.');
      setVideos([]);
      setLoading(false);
    }
  };

  const onStateChange = useCallback((state, videoId) => {
    if (state === 'ended') {
      setPlaying(prev => ({...prev, [videoId]: false}));
    }
  }, []);

  const togglePlaying = useCallback((id) => {
    setPlaying(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const renderVideoItem = ({item}) => (
    <View className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md mb-6">
      <View className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-lg font-bold text-gray-800 dark:text-white mb-1">
          {item.title}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          {item.description}
        </Text>
      </View>

      <View className="aspect-video w-full bg-black">
        {item.is_youtube ? (
          <YoutubeIframe
            height="100%"
            width="100%"
            videoId={item.videoId}
            play={playing[item.id] || false}
            onChangeState={state => onStateChange(state, item.id)}
            webViewProps={{
              renderToHardwareTextureAndroid: true,
            }}
          />
        ) : (
          <Video
            source={{uri: item.videoUrl}}
            style={{width: '100%', height: '100%'}}
            controls={true}
            paused={!playing[item.id]}
            resizeMode="contain"
          />
        )}
      </View>

      <TouchableOpacity
        className="p-3 flex-row items-center justify-center bg-indigo-600"
        onPress={() => togglePlaying(item.id)}>
        <Ionicons
          name={playing[item.id] ? 'pause' : 'play'}
          size={20}
          color="#FFFFFF"
        />
        <Text className="text-white font-medium ml-2">
          {playing[item.id] ? 'Pause' : 'Play'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
          />
        </View>
        <PageTitle pageName="Help Center" />
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            How can we help you?
          </Text>
          <Text className="text-gray-600 dark:text-gray-300">
            Watch these tutorial videos to learn how to navigate our platform,
            access all features, and maximize your experience with our services.
          </Text>
        </View>

        {loading ? (
          <View className="flex items-center justify-center py-10">
            <Ionicons
              name="hourglass-outline"
              size={40}
              color={isDark ? '#FFFFFF' : '#6366f1'}
            />
            <Text className="mt-4 text-gray-600 dark:text-gray-300">
              Loading ...
            </Text>
          </View>
        ) : error ? (
          <View className="flex items-center justify-center py-10">
            <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
            <Text className="mt-4 text-gray-600 dark:text-gray-300">
              {error}
            </Text>
            <TouchableOpacity
              className="mt-4 bg-indigo-600 px-6 py-2 rounded-lg"
              onPress={fetchHelpVideos}>
              <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : videos.length === 0 ? (
          <View className="flex items-center justify-center py-10">
            <Ionicons
              name="videocam-off-outline"
              size={40}
              color={isDark ? '#FFFFFF' : '#6366f1'}
            />
            <Text className="mt-4 text-gray-600 dark:text-gray-300">
              No help videos available
            </Text>
          </View>
        ) : (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
