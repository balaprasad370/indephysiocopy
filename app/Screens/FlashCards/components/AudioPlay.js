import React, {useState, useRef, useEffect} from 'react';
import {View, TouchableOpacity, Text, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';
import LottieView from 'lottie-react-native';
import AudioWaves from '../../../assets/lottie/audiowaves.json';

const AudioPlay = ({item, onPlaybackStatusChange, deleteRecording, index}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const lottieRef = useRef(null);
  const [audioSource, setAudioSource] = useState({uri: item?.uri});

  const togglePlayback = () => {
    setIsPlaying(prev => {
      const newState = !prev;
      if (newState) {
        videoRef.current?.seek(currentTime || 0);
      } else {
        onPlaybackStatusChange && onPlaybackStatusChange(false, index);
      }
      return newState;
    });
  };

  useEffect(() => {
    console.log('item?.uri', item?.uri);
    return () => {
      stopAudio();
    };
  }, [item?.uri]);

  const stopAudio = () => {
    console.log('rendered');

    videoRef.current?.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    onPlaybackStatusChange && onPlaybackStatusChange(false, index);
  };

  const handleLoad = ({duration}) => setDuration(duration);
  const handleProgress = ({currentTime}) => setCurrentTime(currentTime);
  const handleEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    onPlaybackStatusChange && onPlaybackStatusChange(false, index);
  };

  const handleError = error => {
    console.error('Audio playback error:', error);
    setIsPlaying(false);
    Alert.alert('Error', 'Something went wrong with the audio file.');
    onPlaybackStatusChange && onPlaybackStatusChange(false, index);
  };

  const formatTime = timeInSeconds => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  return (
    <View className="flex flex-row justify-between items-center p-3 bg-b50 rounded-lg mb-2 shadow-lg">
      <View className="flex-1 mr-2">
        <Text
          className="text-sm font-medium text-gray-800 mb-1"
          numberOfLines={1}>
          {item?.text || 'No text available'}
        </Text>
        <Text className="text-xs text-gray-500">
          {item?.language === 'english' ? 'English' : 'German'} •{' '}
          {formatTime(duration)}
        </Text>
      </View>

      {isPlaying ? (
        <View className="flex flex-row items-center">
          <TouchableOpacity
            className="bg-p1 rounded-full w-10 h-10 justify-center items-center mr-2"
            onPress={togglePlayback}>
            <Icon name="pause" size={24} color="white" />
          </TouchableOpacity>
          <View className="w-24 justify-center items-center">
            <View className="h-8 w-16 justify-center items-center">
              <LottieView
                ref={lottieRef}
                source={AudioWaves}
                style={{width: 60, height: 30}}
                autoPlay
                loop
              />
            </View>
            <Text className="text-xs text-gray-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex flex-row items-center">
          <TouchableOpacity
            className="bg-p1 rounded-lg p-2 mr-2 justify-center items-center"
            onPress={togglePlayback}>
            <Icon name="play-arrow" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 rounded-lg p-2 justify-center items-center"
            onPress={() => deleteRecording(index)}>
            <Icon name="delete" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {isPlaying && (
        <Video
          ref={videoRef}
          source={audioSource}
          audioOnly
          paused={!isPlaying}
          onLoad={handleLoad}
          onProgress={handleProgress}
          onEnd={handleEnd}
          onError={handleError}
          style={{width: 0, height: 0}}
        />
      )}
    </View>
  );
};

export default AudioPlay;
