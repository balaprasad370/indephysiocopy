import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator, // Added for buffering indicator
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useContext, useRef, useState, useEffect} from 'react';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker'; // For orientation handling
import DarkTheme from '../../theme/Darktheme';
import LightTheme from '../../theme/LighTheme';
import {AppContext} from '../../theme/AppContext';

const RecordingPlayer = ({route, navigation}) => {
  const {isDark} = useContext(AppContext);
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false); // State for buffering

  const style = isDark ? DarkTheme : LightTheme;
  const videoUrl = route.params.video_url;

  // Format time to mm:ss
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayback = () => {
    setIsPaused(!isPaused);
    resetHideControlsTimer();
  };

  const stopPlayback = () => {
    setIsPaused(true);
    setCurrentTime(0);
    videoRef.current.seek(0);
    resetHideControlsTimer();
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsBuffering(false); // Stop showing buffer when video is loaded
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const handleSliderChange = value => {
    videoRef.current.seek(value); // Immediately update video to the slider's value
    setCurrentTime(value); // Update current time instantly
    resetHideControlsTimer();
  };

  // Handle full-screen toggle
  const toggleFullScreen = () => {
    if (isFullScreen) {
      Orientation.lockToPortrait();
      setIsFullScreen(false);
      navigation.setOptions({headerShown: true});
    } else {
      Orientation.lockToLandscape();
      setIsFullScreen(true);
      navigation.setOptions({headerShown: false});
    }
    resetHideControlsTimer();
  };

  const resetHideControlsTimer = () => {
    setShowControls(true);
    if (isFullScreen) {
      setTimeout(() => {
        setShowControls(false); // Auto-hide controls after 3 seconds
      }, 3000);
    }
  };

  // Handle showing/hiding controls on screen tap
  const handleScreenTap = () => {
    setShowControls(!showControls);
    if (showControls) {
      resetHideControlsTimer();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View
        style={[styles.container, isFullScreen && {backgroundColor: '#000'}]}>
        <StatusBar hidden={isFullScreen} />
        <Video
          ref={videoRef}
          source={{uri: `https://d3kpi6hpyesigd.cloudfront.net/${videoUrl}`}}
          style={isFullScreen ? styles.fullscreenVideo : styles.video}
          resizeMode="contain"
          paused={isPaused}
          onLoad={onLoad}
          onProgress={onProgress}
          onBuffer={({isBuffering}) => setIsBuffering(isBuffering)} // Handle buffering
          onError={error => console.error('Video Error:', error)}
        />

        {isBuffering && (
          <View style={styles.bufferingIndicator}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        )}

        {showControls && (
          <View style={styles.overlay}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onValueChange={handleSliderChange}
              minimumTrackTintColor="#1fb28a"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#1eb900"
            />

            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={togglePlayback}>
                <Icon
                  name={isPaused ? 'play-arrow' : 'pause'}
                  size={30}
                  color={'#FFF'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={stopPlayback}>
                <Icon name="stop" size={30} color={'#FFF'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleFullScreen}>
                <Icon
                  name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                  size={30}
                  color={'#FFF'}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
        )}

        {isFullScreen && !showControls && (
          <TouchableOpacity
            style={styles.exitFullScreenButton}
            onPress={toggleFullScreen}>
            <Icon name="close" size={30} color={'#FFF'} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111B21',
  },
  video: {
    width: '100%',
    height: 300,
  },
  fullscreenVideo: {
    width: Dimensions.get('window').height, // Switch width and height for landscape
    height: Dimensions.get('window').width,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    padding: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  controlButton: {
    marginHorizontal: 10,
    borderRadius: 50,
    padding: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 5,
  },
  bufferingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    zIndex: 1,
  },
  exitFullScreenButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent button background
  },
});

export default RecordingPlayer;
