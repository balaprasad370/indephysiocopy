// import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React, {useState} from 'react';
// import Sound from 'react-native-sound';
// import Icon from 'react-native-vector-icons/AntDesign';
// import color from '../../Constants/color';

// const AudioComponent = ({audioURL}) => {
//   const newURl =
//     'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3';
//   // 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
//   const [sound, setSound] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   const playAudio = audioURL => {
//     setIsLoading(true);

//     if (sound) {
//       sound.stop(() => {
//         setSound(null);
//         setIsPlaying(false);
//       });
//     }

//     const newSound = new Sound(audioURL, '', error => {
//       if (error) {
//         console.log('Failed to load the sound', error);
//         setIsLoading(false);
//         return;
//       }
//       setSound(newSound);
//       newSound.play(success => {
//         if (success) {
//           console.log('Successfully finished playing');
//         } else {
//           console.log('Playback failed due to audio decoding errors');
//         }
//         setIsPlaying(false);
//         setSound(null);
//         setIsLoading(false);
//       });
//       setIsPlaying(true);
//       setIsLoading(false);
//     });
//   };

//   const pauseAudio = () => {
//     if (sound) {
//       sound.pause();
//       setIsPlaying(false);
//     }
//   };

//   return (
//     <View
//       style={{
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-evenly',
//         width: '100%',
//         padding: 5,
//         borderRadius: 10,
//       }}>
//       <TouchableOpacity
//         style={{}}
//         onPress={() => (isPlaying ? pauseAudio() : playAudio(newURl))}>
//         {isPlaying ? (
//           <Icon
//             name="pausecircle"
//             style={{fontSize: 40, color: color.darkPrimary}}
//           />
//         ) : (
//           <Icon name="play" style={{fontSize: 40, color: color.darkPrimary}} />
//         )}
//       </TouchableOpacity>
//       <View
//         style={{
//           width: '75%',
//           height: 6,
//           borderRadius: 6,
//           marginRight: 5,
//           backgroundColor: color.lowPrimary,
//           marginLeft: 10,
//         }}></View>
//     </View>
//   );
// };

// export default AudioComponent;

// const styles = StyleSheet.create({});
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/AntDesign';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';

const AudioComponent = ({
  isPlaying,
  setIsPlaying,
  sound,
  setSound,
  pauseAudio,
  audioURL,
}) => {
  const newURl =
    'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3';

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

  const playAudio = audioURL => {
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
      {/* <TouchableOpacity onPress={() => seekAudio('backward')}>
        <Icon name="banckward" style={styles.seekButton} />
      </TouchableOpacity> */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            {width: `${(currentPosition / duration) * 100}%`},
          ]}
        />
      </View>
      {/* <TouchableOpacity onPress={() => seekAudio('forward')}>
        <Icon name="forward" style={styles.seekButton} />
      </TouchableOpacity> */}
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
