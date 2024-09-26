import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';
import {Image} from 'react-native';
import leaderboard from '../../assets/leaderboards.png';
import storage from '../../Constants/storage';
import axios from 'axios';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import LinearGradient from 'react-native-linear-gradient';

const Index = ({
  Title,
  secondOption,
  optionClick,
  unique_id,
  status,
  room_name,
  video_url,
}) => {
  const navigation = useNavigation();
  const {userData, path, isDark} = useContext(AppContext);

  const toggleModal = option => {
    if (option === 'Quiz') {
      navigation.navigate(ROUTES.QUIZ, {module_id: unique_id, title: Title});
    } else if (option === 'Reading Material') {
      navigation.navigate(ROUTES.READING, {read_id: unique_id});
    } else if (option === 'Live') {
      navigation.navigate('Meeting', {room: 'checkpaaras'});
    } else if (option === 'Flash Card') {
      navigation.navigate(ROUTES.FLASH, {flash_id: unique_id});
    }
  };

  const [marks, setMarks] = useState([]);
  const [readingMaterial, setReadingMaterial] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const style = isDark ? DarkTheme : LighTheme;

  const [completed, setCompleted] = useState(null);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        style={style.cardBox}
        onPress={() => toggleModal(optionClick)}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{optionClick}</Text>
          {optionClick === 'Live class' && (
            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              onPress={() => {
                // Navigate based on the status
                if (status === 1) {
                  navigation.navigate(ROUTES.RECORDING, {
                    video_url: video_url,
                  });
                } else {
                  navigation.navigate('Meeting', {
                    room: room_name,
                  });
                }
              }}>
              <Text
                style={{
                  backgroundColor: color.darkPrimary,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  color: color.white,
                }}>
                {status === 1 ? 'Recording' : 'Join now'}
              </Text>
            </TouchableOpacity>
          )}
          {optionClick === 'Quiz' && status && (
            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              onPress={() =>
                navigation.navigate(ROUTES.MARKS, {
                  module_id: unique_id,
                })
              }>
              <Text
                style={{
                  backgroundColor: '#ED1C25',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  color: color.white,
                }}>
                Result
              </Text>
            </TouchableOpacity>
          )}
          {status &&
          (optionClick === 'Flash Card' ||
            optionClick === 'Reading Material') ? (
            <Text
              style={{
                backgroundColor: '#7ED957',
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: color.black,
              }}>
              Completed
            </Text>
          ) : null}
        </View>
        <LinearGradient
          style={styles.textContainer}
          colors={
            isDark
              ? ['#2A89C6', '#3397CB', '#0C5CB4']
              : ['#f4f5f8', '#f4f5f8', '#f4f5f8']
          }
          start={{x: 0, y: 0}} // Start from the left
          end={{x: 1, y: 0}}>
          {optionClick === 'Quiz' ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{width: '80%'}}>
                <Text style={[styles.cardTitle]}>{Title}</Text>
                <Text style={styles.cardSubtitle}>{secondOption}</Text>
              </View>
              <View
                style={{
                  position: 'relative',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 999,
                    left: '35%',
                    top: '20%',
                  }}>
                  <Ionicons
                    name="lock-closed-sharp"
                    style={{fontSize: 22, color: 'black'}}
                  />
                </View>
                <View style={{opacity: 0.5, padding: 2}}>
                  <TouchableOpacity
                    hitSlop={{x: 25, y: 15}}
                    onPress={
                      () => console.log('no')
                      // navigation.navigate(ROUTES.LEADERBOARD, {
                      //   module_id: unique_id,
                      // })
                    }
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={leaderboard}
                      style={{width: 50, height: 50}}
                    />
                    <Text style={{fontSize: 12, color: color.black}}>
                      Leaderboard
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.cardTitle}>{Title}</Text>
              <Text style={styles.cardSubtitle}>{secondOption}</Text>
            </>
          )}
          {/* </View> */}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginVertical: 8,
    paddingHorizontal: 16,
  },

  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: color.lowPrimary,
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  statusText: {
    color: color.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  textContainer: {
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },

  scoreBadge: {
    position: 'absolute',
    top: 5,
    right: 10,
    alignItems: 'center',
  },
  ribbon: {
    position: 'absolute',
    bottom: -8,
    width: 30,
    height: 30,
    backgroundColor: color.darkPrimary,
    zIndex: -1,
    transform: [{rotate: '45deg'}],
  },
  badgeContent: {
    width: 50,
    height: 40,

    backgroundColor: color.darkPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scoreBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
