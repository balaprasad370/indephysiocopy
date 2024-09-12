import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';
import {Image} from 'react-native';
import leaderboard from '../../assets/leaderboards.png';
import storage from '../../Constants/storage';
import axios from 'axios';

const Index = ({Title, secondOption, optionClick, unique_id}) => {
  const navigation = useNavigation();
  const {userData, path} = useContext(AppContext);

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

  useEffect(() => {
    const fetchMarks = async () => {
      const token = await storage.getStringAsync('token');
      if (token) {
        try {
          const response = await axios.get(`${path}/student/allscore`, {
            params: {
              student_id: userData?.student_id,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          });

          setMarks(response.data?.result || []);
        } catch (error) {
          console.error('Error fetching marks:', error);
        }
      }
    };

    fetchMarks();
  }, []);

  // Check if there is a mark with matching module_id
  const isResultsAvailable = marks.some(mark => mark.module_id === unique_id);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.cardBox}
        onPress={() => toggleModal(optionClick)}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{optionClick}</Text>
          {/* Conditionally render the Results button */}
          {(optionClick === 'Quiz' || optionClick === 'Flash Card') &&
          isResultsAvailable ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.MARKS, {
                  module_id: unique_id,
                  student_id: userData?.student_id,
                })
              }>
              <Text
                style={{
                  backgroundColor:
                    optionClick === 'Flash Card' ? '#7ED957' : '#ED1C25',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    optionClick === 'Flash Card' ? color.black : color.white,
                }}>
                Results
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.textContainer}>
          {optionClick === 'Quiz' ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.cardTitle}>{Title}</Text>
                <Text style={styles.cardSubtitle}>{secondOption}</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ROUTES.LEADERBOARD, {
                    module_id: unique_id,
                  })
                }
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Image source={leaderboard} style={{width: 50, height: 50}} />
                <Text style={{fontSize: 12, color: color.black}}>
                  Leaderboard
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.cardTitle}>{Title}</Text>
              <Text style={styles.cardSubtitle}>{secondOption}</Text>
            </>
          )}
        </View>
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
  cardBox: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1f4f8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
