import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/AntDesign';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';
import {useFocusEffect} from '@react-navigation/native';

const AudioComponent = ({
  isPlaying,
  setIsPlaying,
  sound,
  setSound,
  pauseAudio,
  audioURL,
}) => {
  const newURl = `https://d2c9u2e33z36pz.cloudfront.net/${audioURL}`;

  const [isLoading, setIsLoading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound && isPlaying) {
        sound.getCurrentTime(seconds => setCurrentPosition(seconds));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound, isPlaying]);


  useFocusEffect(
    React.useCallback(() => {
      // Component gains focus: do nothing here

      return () => {
        // Component loses focus: stop audio and reset state
        if (sound) {
          sound.stop(() => {
            setSound(null);
            setIsPlaying(false);
          });
        }
      };
    }, [sound, setSound, setIsPlaying])
  );


  const playAudio = audioURL => {
    if (isLoading || isPlaying) {
      return; // Prevent multiple play actions when already playing or loading
    }

    setIsLoading(true);

    if (sound) {
      sound.stop(() => {
        setSound(null);
        setIsPlaying(false);
      });
    }

    const newSound = new Sound(audioURL, '', error => {
      if (error) {
        console.log('Failed to load the sound', error);
        setIsLoading(false);
        return;
      }

      setSound(newSound);
      setDuration(newSound.getDuration());

      newSound.play(success => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }

        setIsPlaying(false);
        setSound(null);
        setIsLoading(false);
      });

      setIsPlaying(true);
      setIsLoading(false);
    });
  };

  const seekAudio = direction => {
    if (sound) {
      let newPosition = currentPosition + (direction === 'forward' ? 5 : -5);
      newPosition = Math.max(0, Math.min(newPosition, duration));
      sound.setCurrentTime(newPosition);
      setCurrentPosition(newPosition);
    }
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        onPress={() => (isPlaying ? pauseAudio() : playAudio(newURl))}>
        {isPlaying ? (
          <Icon
            name="pausecircle"
            style={{fontSize: 40, color: color.darkPrimary}}
          />
        ) : (
          <Icon name="play" style={{fontSize: 40, color: color.darkPrimary}} />
        )}
      </TouchableOpacity>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            {width: `${(currentPosition / duration) * 100}%`},
          ]}
        />
      </View>

      <View style={styles.timeContainer}>
        <Text>{formatTime(currentPosition)}</Text>
        <Text>:</Text>
        <Text>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

export default AudioComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    padding: 5,
    borderRadius: 10,
  },
  seekButton: {
    fontSize: 40,
    color: color.darkPrimary,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 6,
    backgroundColor: color.lowPrimary,
    marginHorizontal: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: color.darkPrimary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '20%',
  },
});
