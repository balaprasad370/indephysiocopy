import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RecordingPlayer = ({videoUrl}) => {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const seekForward = () => {
    const newTime = Math.min(currentTime + 10, duration); // Seek forward 10 seconds
    videoRef.current.seek(newTime);
    setCurrentTime(newTime);
  };

  const seekBackward = () => {
    const newTime = Math.max(currentTime - 10, 0); // Seek backward 10 seconds
    videoRef.current.seek(newTime);
    setCurrentTime(newTime);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: `https://d3kpi6hpyesigd.cloudfront.net/qzxh4gzqelqfcrdk_2024-09-16-01-05-18.mp4`,
        }}
        style={styles.video}
        resizeMode="contain"
        paused={isPaused}
        onLoad={onLoad}
        onProgress={onProgress}
        onBuffer={this.onBuffer}
        onError={this.videoError}
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={seekBackward}>
          <Icon name="replay-10" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={togglePlayback}>
          <Icon
            name={isPaused ? 'play-arrow' : 'pause'}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={seekForward}>
          <Icon name="forward-10" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={stopPlayback}>
          <Icon name="stop" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.timeText}>
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
    backgroundColor: '#FFF',
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    padding: 10,
  },
  timeText: {
    color: '#fff',
    marginTop: 5,
  },
});

export default RecordingPlayer;
