import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import {AppContext} from '../../theme/AppContext';

const RecordingPlayer = ({route}) => {
  const {isDark} = useContext(AppContext);
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const style = isDark ? DarkTheme : LighTheme;

  const videoUrl = route.params.video_url;

  // Function to format time in mm:ss
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlayback = () => {
    setIsPaused(!isPaused);
  };

  const stopPlayback = () => {
    setIsPaused(true);
    setCurrentTime(0);
    videoRef.current.seek(0);
  };

  const onLoad = data => {
    setDuration(data.duration);
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const handleSliderChange = value => {
    setCurrentTime(value);
    videoRef.current.seek(value);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: `https://d3kpi6hpyesigd.cloudfront.net/${videoUrl}`,
        }}
        style={styles.video}
        resizeMode="contain"
        paused={isPaused}
        onLoad={onLoad}
        onProgress={onProgress}
        onBuffer={data => console.log('Buffering...', data)}
        onError={error => console.error('Video Error:', error)}
      />
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
          style={[styles.controlButton, {backgroundColor: '#FFF'}]}
          onPress={togglePlayback}>
          <Icon
            name={isPaused ? 'play-arrow' : 'pause'}
            size={30}
            color={'#111B21'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, {backgroundColor: '#FFF'}]}
          onPress={stopPlayback}>
          <Icon name="stop" size={30} color={'#111B21'} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.timeText, {color: '#FFF'}]}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    </View>
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
    color: '#000',
    marginTop: 5,
  },
});

export default RecordingPlayer;
