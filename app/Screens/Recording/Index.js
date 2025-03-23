import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  ActivityIndicator,
  Alert,
  StatusBar,
  BackHandler,
} from 'react-native';
import Orientation from 'react-native-orientation-locker'; 
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ROUTES} from '../../Constants/routes';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const VideoPlayer = ({route, navigation}) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true); // Start with buffering true
  const source = route.params.video_url;
  const insets = useSafeAreaInsets();



  useEffect(() => {

      if(!source.includes('https://')){
        console.log('source', source);
        
        handleVideoError('Video file may not be found or has an invalid path. Please try again later.');
      }

  }, []);



  const [isSliding, setIsSliding] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Animation values
  const topBarOpacity = useSharedValue(1);
  const controlsOpacity = useSharedValue(1);
  const bottomBarTranslateY = useSharedValue(0);

  // Animated styles
  const topBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: topBarOpacity.value,
      transform: [
        {translateY: withTiming(showControls ? 0 : -100, {duration: 300})},
      ],
    };
  });

  const centerControlsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: controlsOpacity.value,
    };
  });

  const bottomBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: controlsOpacity.value,
      transform: [{translateY: bottomBarTranslateY.value}],
    };
  });

  // Handle full screen mode
  useEffect(() => {
    if (fullScreen) {
      // Lock to landscape orientation
      StatusBar.setHidden(true);
      Orientation.lockToLandscape();
    } else {
      // Restore portrait orientation
      StatusBar.setHidden(false);
      Orientation.lockToPortrait();
    }
  }, [fullScreen, navigation]);

  // Reset orientation when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
      };
    }, [navigation]),
  );

  // Controls visibility timer
  useEffect(() => {
    let timer;
    if (showControls) {
      // Show controls with animation
      topBarOpacity.value = withTiming(1, {duration: 300, easing: Easing.ease});
      controlsOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.ease,
      });
      bottomBarTranslateY.value = withSpring(0);

      timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      // Hide controls with animation
      topBarOpacity.value = withTiming(0, {duration: 300, easing: Easing.ease});
      controlsOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.ease,
      });
      bottomBarTranslateY.value = withSpring(100);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showControls]);

  const handlePlayPause = () => setPaused(!paused);
  const handleSeek = time => {
    videoRef.current.seek(time);
    setCurrentTime(time);
  };

  const handleForward = () => handleSeek(currentTime + 10);
  const handleBackward = () => handleSeek(Math.max(0, currentTime - 10));
  const toggleControls = () => setShowControls(!showControls);

  const formatTime = time => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const handleVideoError = error => {
    // console.error('Video playback error:', error);
    Alert.alert(
      'Video Error',
      'Error occurred: Video file may not be found or has an invalid path. Please try again later.',
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const handleBackPress = useCallback(() => {
    if (fullScreen) {
      // If in landscape mode, first switch to portrait
      setFullScreen(false);
      StatusBar.setHidden(false);
      Orientation.lockToPortrait();
      return true; // Prevent default back behavior
    }
    
    // Navigate back or to home if can't go back
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate(ROUTES.HOME);
    return true; // Handled the back press
  }, [fullScreen, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <View 
      style={[
        styles.mainContainer, 
        fullScreen && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }
      ]}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: fullScreen ? insets.top : 0,
            left: 0,
            zIndex: 100,
            width: '100%',
            minHeight: 70,
            justifyContent: 'start',
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: 10,
          },
          topBarAnimatedStyle,
        ]}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            justifyContent: 'center',
            gap: 10,
            padding: 10, // Added padding for better touch target
          }}>
          <Icon name="arrow-back" size={30} color="white" />
          <Text
            style={{
              color: 'white',
              marginLeft: 10,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Back
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {isBuffering && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 10,
          }}>
          <ActivityIndicator size="large" color="#613BFF" />
        </View>
      )}

      <View
        style={[
          styles.container,
          fullScreen ? styles.fullScreen : styles.normal,
        ]}>
        {/* Video as the first layer (absolute) */}
        <Video
          ref={videoRef}
          source={{uri: source}}
          style={styles.videoAbsolute}
          paused={paused}
          resizeMode="contain"
          onBuffer={({isBuffering: buffering}) => {
            setIsBuffering(buffering);
          }}
          onProgress={data => {
            if (!isSliding) {
              setCurrentTime(data.currentTime);
            }
          }}
          onLoad={data => {
            setDuration(data.duration);
            setIsBuffering(false);
          }}
          onError={handleVideoError}
        />

        {/* Pressable layer to toggle controls */}
        <Pressable style={styles.pressableLayer} onPress={toggleControls} />

        {/* Center video controls - only show when not buffering */}
        {!isBuffering && (
          <Animated.View
            style={[styles.centerControls, centerControlsAnimatedStyle]}>
            <TouchableOpacity
              onPress={handleBackward}
              style={styles.controlButton}>
              <Icon name="replay-10" size={40} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePlayPause}
              style={styles.controlButton}>
              <Icon
                name={paused ? 'play-arrow' : 'pause'}
                size={50}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleForward}
              style={styles.controlButton}>
              <Icon name="forward-10" size={40} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Bottom slider */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: fullScreen ? insets.bottom + 20 : 60,
              width: '100%',
              paddingHorizontal: 20,
              zIndex: 2,
            },
            bottomBarAnimatedStyle,
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: 'white'}}>{formatTime(currentTime)}</Text>
            </View>
            <Slider
              style={{flex: 1}}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onSlidingStart={() => setIsSliding(true)}
              onSlidingEnd={() => {
                setIsSliding(false);
              }}
              onSlidingComplete={value => {
                setCurrentTime(value);
                videoRef.current.seek(value);
              }}
              minimumTrackTintColor="#613BFF"
              maximumTrackTintColor="#FFFFFF"
              thumbTintColor="#613BFF"
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: 'white'}}>{formatTime(duration)}</Text>
            </View>

            <TouchableOpacity onPress={() => setFullScreen(!fullScreen)}>
              <Icon name={fullScreen ? 'fullscreen-exit' : 'fullscreen'} size={30} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    flex: 1,
  },
  normal: {
    width: '100%',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
  },
  videoAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  pressableLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  centerControls: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  controlButton: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 10,
  },
  slider: {
    width: '100%',
  },
  fullscreenContainer: {
    position: 'absolute',
    right: 20,
    bottom: 0,
  },
});

export default VideoPlayer;
