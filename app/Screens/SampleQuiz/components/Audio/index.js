import {View, TouchableOpacity, Text} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

const AudioPlayer = ({source}) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const intervalRef = useRef(null);
  const durationCheckRef = useRef(null);

  useEffect(() => {
    Sound.setCategory('Playback');

    const initSound = new Sound(source.uri, null, error => {
      if (error) {
        setError(true);
        console.log('Failed to load sound', error);
        return;
      }
      setSound(initSound);
      setDuration(initSound.getDuration());

      // Check duration after 3 seconds
      durationCheckRef.current = setTimeout(() => {
        if (initSound.getDuration() === 0) {
          setError(true);
          console.log('Failed to load audio - Duration is 0');
        }
      }, 3000);
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (durationCheckRef.current) {
        clearTimeout(durationCheckRef.current);
      }
      if (sound) {
        sound.stop();
        sound.release();
      }
      if (initSound) {
        initSound.stop();
        initSound.release();
      }
    };
  }, [source.uri]);

  const stopAndCleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (sound) {
      sound.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const playPause = () => {
    if (!sound) return;

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      sound.play(success => {
        if (!success) {
          setError(true);
          console.log('Sound playback failed');
        }
        stopAndCleanup();
      });
      setIsPlaying(true);

      // Update current time while playing
      intervalRef.current = setInterval(() => {
        if (!isSeeking) {
          sound.getCurrentTime(seconds => {
            setCurrentTime(seconds);
            // Check if playback has ended
            if (seconds >= duration) {
              stopAndCleanup();
            }
          });
        }
      }, 100);
    }
  };

  const onSlidingStart = () => {
    setIsSeeking(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const onSlidingComplete = value => {
    setIsSeeking(false);
    if (sound) {
      sound.setCurrentTime(value);
      setCurrentTime(value);
      
      if (isPlaying) {
        // Resume updating current time
        intervalRef.current = setInterval(() => {
          sound.getCurrentTime(seconds => {
            if (!isSeeking) {
              setCurrentTime(seconds);
              if (seconds >= duration) {
                stopAndCleanup();
              }
            }
          });
        }, 100);
      }
    }
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (error) {
    return (
      <View className="w-full p-4 bg-gray-100 rounded-lg flex items-center justify-center">
        <Icon name="error-outline" size={24} color="#ef4444" />
        <Text className="text-red-500 mt-2">Failed to load audio</Text>
      </View>
    );
  }

  return (
    <View className="w-full p-4 bg-b50 rounded-lg">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={playPause}
          className="w-12 h-12 bg-p1 rounded-full items-center justify-center shadow">
          <Icon
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View className="flex-1 mx-4">
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onSlidingStart={onSlidingStart}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor="#613BFF"
            maximumTrackTintColor="#000fff"
            thumbTintColor="#613BFF"
          />
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500">
              {formatTime(currentTime)}
            </Text>
            <Text className="text-xs text-gray-500">
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;
