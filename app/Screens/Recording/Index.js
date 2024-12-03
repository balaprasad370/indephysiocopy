// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   ActivityIndicator,
//   TouchableWithoutFeedback,
//   BackHandler,
// } from 'react-native';
// import React, {
//   useContext,
//   useRef,
//   useState,
//   useEffect,
//   useCallback,
// } from 'react';
// import Video from 'react-native-video';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Slider from '@react-native-community/slider';
// import Orientation from 'react-native-orientation-locker';
// import DarkTheme from '../../theme/Darktheme';
// import LightTheme from '../../theme/LighTheme';
// import {AppContext} from '../../theme/AppContext';

// const RecordingPlayer = ({route, navigation}) => {
//   const {isDark} = useContext(AppContext);
//   const videoRef = useRef(null);
//   const controlsTimeoutRef = useRef(null);
//   const [isPaused, setIsPaused] = useState(true);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [showControls, setShowControls] = useState(true);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [isLoading, setIsLoading] = useState(true); // New state for initial loading
//   const [isSeeking, setIsSeeking] = useState(false); // New state for seeking operations

//   const style = isDark ? DarkTheme : LightTheme;
//   const videoUrl = route.params.video_url;

//   useEffect(() => {
//     const cleanup = () => {
//       if (controlsTimeoutRef.current) {
//         clearTimeout(controlsTimeoutRef.current);
//       }
//       Orientation.lockToPortrait();
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         if (isFullScreen) {
//           toggleFullScreen();
//           return true;
//         }
//         return false;
//       },
//     );

//     const unsubscribeFocus = navigation.addListener('focus', () => {
//       setIsPaused(true);
//       setCurrentTime(0);
//       setIsLoading(true); // Reset loading state on focus
//       if (videoRef.current) {
//         videoRef.current.pause();
//       }
//     });

//     const unsubscribeBlur = navigation.addListener('blur', () => {
//       setIsPaused(true);
//       if (videoRef.current) {
//         videoRef.current.pause();
//       }
//     });

//     return () => {
//       cleanup();
//       backHandler.remove();
//       unsubscribeFocus();
//       unsubscribeBlur();
//     };
//   }, [navigation, isFullScreen]);

//   useEffect(() => {
//     // Lock to portrait by default
//     Orientation.lockToPortrait();

//     // Listen to orientation changes
//     Orientation.addOrientationListener(handleOrientationChange);

//     return () => {
//       Orientation.removeOrientationListener(handleOrientationChange);
//       Orientation.lockToPortrait(); // Reset to portrait on unmount
//     };
//   }, []);

//   useEffect(() => {
//     console.log('mount');
//     return () => {
//       console.log('unmount');
//       stopPlayVideo();
//     };
//   }, []);

//   const stopPlayVideo = () => {
//     setIsPaused(true);
//     setCurrentTime(0);
//     if (videoRef.current) {
//       videoRef.current.pause();
//     }
//   };

//   const formatTime = time => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   const togglePlayback = () => {
//     setIsPaused(!isPaused);
//     resetHideControlsTimer();
//   };

//   const stopPlayback = () => {
//     setIsPaused(true);
//     setCurrentTime(0);
//     if (videoRef.current) {
//       videoRef.current.pause();
//     }
//     resetHideControlsTimer();
//   };

//   const onLoad = data => {
//     setDuration(data.duration);
//     setIsLoading(false); // Hide loading indicator after initial load
//     setIsBuffering(false);
//   };

//   const onProgress = data => {
//     if (!isSeeking) {
//       // Only update time if not seeking
//       setCurrentTime(data.currentTime);
//     }
//   };

//   const handleSliderChange = value => {
//     setIsSeeking(true); // Start seeking state
//     setCurrentTime(value);
//   };

//   const handleSliderComplete = value => {
//     setIsSeeking(true); // Maintain seeking state during seek operation
//     if (videoRef.current) {
//       videoRef.current.seek(value);
//     }
//     // Let the onSeek handler clear the seeking state
//     resetHideControlsTimer();
//   };

//   const onSeek = () => {
//     setIsSeeking(false); // Clear seeking state after seek completes
//   };

//   const handleOrientationChange = useCallback(
//     orientation => {
//       const isLandscape = orientation.includes('LANDSCAPE');
//       if (isLandscape !== isFullScreen) {
//         setIsFullScreen(isLandscape);
//         navigation.setOptions({headerShown: !isLandscape});
//       }
//     },
//     [isFullScreen, navigation],
//   );

//   const toggleFullScreen = () => {
//     if (isFullScreen) {
//       Orientation.lockToPortrait();
//       setIsFullScreen(false);
//       navigation.setOptions({headerShown: true});
//     } else {
//       Orientation.lockToLandscape();
//       setIsFullScreen(true);
//       navigation.setOptions({headerShown: false});
//     }
//     resetHideControlsTimer();
//   };

//   const resetHideControlsTimer = () => {
//     if (controlsTimeoutRef.current) {
//       clearTimeout(controlsTimeoutRef.current);
//     }

//     setShowControls(true);

//     if (!isPaused && isFullScreen) {
//       controlsTimeoutRef.current = setTimeout(() => {
//         setShowControls(false);
//       }, 3000);
//     }
//   };

// const handleScreenTap = () => {
//   if (controlsTimeoutRef.current) {
//     clearTimeout(controlsTimeoutRef.current);
//   }

//   setShowControls(!showControls);

//   if (!showControls && !isPaused) {
//     controlsTimeoutRef.current = setTimeout(() => {
//       setShowControls(false);
//     }, 3000);
//   }
// };

//   // Combined loading indicator for all loading states
//   const showLoadingIndicator = isLoading || isBuffering || isSeeking;

//   return (
//     <TouchableWithoutFeedback onPress={handleScreenTap}>
//       <View
//         style={[styles.container, isFullScreen && {backgroundColor: '#000'}]}>
//         <StatusBar hidden={isFullScreen} />
//         <Video
//           ref={videoRef}
//           source={{uri: `https://d3kpi6hpyesigd.cloudfront.net/${videoUrl}`}}
//           style={isFullScreen ? styles.fullscreenVideo : styles.video}
//           resizeMode="contain"
//           paused={isPaused}
//           onLoad={onLoad}
//           onProgress={onProgress}
//           onBuffer={({isBuffering}) => setIsBuffering(isBuffering)} // Handle buffering
//           onError={error => console.log('Video Error:', error)}
//         />

//         {showLoadingIndicator && (
//           <View style={styles.bufferingIndicator}>
//             <ActivityIndicator size="large" color="#FFF" />
//           </View>
//         )}
//         {showControls && (
//           <View style={styles.overlay}>
//             <Slider
//               style={styles.slider}
//               minimumValue={0}
//               maximumValue={duration}
//               value={currentTime}
//               onValueChange={handleSliderChange}
//               onSlidingComplete={handleSliderComplete}
//               minimumTrackTintColor="#1fb28a"
//               maximumTrackTintColor="#d3d3d3"
//               thumbTintColor="#1eb900"
//             />

//             <View style={styles.controls}>
//               <TouchableOpacity
//                 style={styles.controlButton}
//                 onPress={togglePlayback}>
//                 <Icon
//                   name={isPaused ? 'play-arrow' : 'pause'}
//                   size={30}
//                   color={'#FFF'}
//                 />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.controlButton}
//                 onPress={stopPlayback}>
//                 <Icon name="stop" size={30} color={'#FFF'} />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.controlButton}
//                 onPress={toggleFullScreen}>
//                 <Icon
//                   name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
//                   size={30}
//                   color={'#FFF'}
//                 />
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.timeText}>
//               {formatTime(currentTime)} / {formatTime(duration)}
//             </Text>
//           </View>
//         )}
//         {isFullScreen && !showControls && (
//           <TouchableOpacity
//             style={styles.exitFullScreenButton}
//             onPress={toggleFullScreen}>
//             <Icon name="close" size={30} color={'#FFF'} />
//           </TouchableOpacity>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#111B21',
//   },
//   video: {
//     width: '100%',
//     height: 300,
//   },
//   fullscreenVideo: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//     width: '100%',
//     height: '100%',
//   },
//   // fullscreenVideo: {
//   //   width: Dimensions.get('window').height,
//   //   height: Dimensions.get('window').width,
//   // },
//   overlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     padding: 10,
//   },
//   controls: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginVertical: 10,
//   },
//   controlButton: {
//     marginHorizontal: 10,
//     borderRadius: 50,
//     padding: 10,
//   },
//   slider: {
//     width: '100%',
//     height: 40,
//   },
//   timeText: {
//     color: '#FFF',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   bufferingIndicator: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -25,
//     marginTop: -25,
//     zIndex: 1,
//   },
//   exitFullScreenButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     padding: 10,
//     borderRadius: 50,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
// });

// export default RecordingPlayer;
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
  const controlsTimeoutRef = useRef(null);

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
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    setShowControls(!showControls);

    if (!showControls && !isPaused) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
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
          onError={error => console.log('Video Error:', error)}
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
