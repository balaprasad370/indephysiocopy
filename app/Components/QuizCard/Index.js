import React, {memo, useCallback, useContext} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';
import {Image} from 'react-native';
import leaderboard from '../../assets/leaderboards.png';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import LinearGradient from 'react-native-linear-gradient';
import IconTimer from 'react-native-vector-icons/Ionicons';

const QuizCard = memo(
  ({
    Title,
    secondOption,
    parent_module_id,
    optionClick,
    unique_id,
    status,
    room_name,
    video_url,
    order_id,
    time_spent,
    locked,
    live_class_end_date,
    level_id,
  }) => {
    const navigation = useNavigation();
    const {isDark} = useContext(AppContext);
    const style = isDark ? DarkTheme : LighTheme;

    // Memoized time formatter
    const formatTime = useCallback(milliseconds => {
      const hours = Math.floor(milliseconds / (1000 * 60 * 60));
      const minutes = Math.floor(
        (milliseconds % (1000 * 60 * 60)) / (1000 * 60),
      );
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    const toggleModal = useCallback(
      option => {
        const routes = {
          Quiz: () =>
            navigation.navigate(ROUTES.QUIZ, {
              module_id: unique_id,
              title: Title,
              order_id,
              chapter_id: parent_module_id,
              unique_id,
              level_id,
            }),
          'Reading Material': () =>
            navigation.navigate(ROUTES.READING, {
              read_id: unique_id,
              order_id,
              chapter_id: parent_module_id,
              unique_id,
            }),
          Live: () =>
            navigation.navigate('Meeting', {
              room: 'checkpaaras',
              order_id,
              chapter_id: parent_module_id,
              unique_id,
            }),
          'Flash Card': () =>
            navigation.navigate(ROUTES.FLASH, {
              flash_id: unique_id,
              order_id,
              chapter_id: parent_module_id,
              unique_id,
            }),
          Assessments: () =>
            navigation.navigate(ROUTES.ASSESSMENTS, {
              assessment_id: unique_id,
              order_id,
              chapter_id: parent_module_id,
              unique_id,
            }),
        };

        const navigate = routes[option];
        if (navigate) navigate();
      },
      [navigation, unique_id, Title, order_id, parent_module_id, level_id],
    );

    return (
      <View style={styles.cardContainer}>
        <View style={styles.lockIconContainer}>
          {locked && (
            <TouchableOpacity
              onPress={() => Linking.openURL('https://portal.indephysio.com')}
              style={styles.lockButton}>
              <IconTimer
                name="lock-closed-sharp"
                size={30}
                color="#000"
                style={styles.lockIcon}
              />
              <Text style={styles.subscriptionText}>Subscription Required</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          style={[style.cardBox, styles.cardShadow]}
          onPress={
            locked
              ? () => Linking.openURL('https://portal.indephysio.com')
              : () => toggleModal(optionClick)
          }>
          <View
            style={[styles.statusContainer, locked && styles.lockedContent]}>
            <Text style={styles.statusText}>{optionClick}</Text>
            {optionClick === 'Live class' && (
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
                style={{
                  backgroundColor: color.darkPrimary,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRadius: 20,
                }}
                onPress={() => {
                  navigation.navigate(
                    status === 1 ? ROUTES.RECORDING : 'Meeting',
                    status === 1 ? {video_url} : {room: room_name},
                  );
                }}>
                <Text
                  style={{fontSize: 13, fontWeight: 600, color: color.white}}>
                  {status === 1 ? 'Recording' : 'Join now'}
                </Text>
              </TouchableOpacity>
            )}
            {optionClick === 'Quiz' && status && (
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
                style={{
                  backgroundColor: '#ED1C25',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  borderRadius: 20,
                  paddingBottom: 5,
                }}
                onPress={() =>
                  !locked &&
                  navigation.navigate(ROUTES.MARKS, {module_id: unique_id})
                }>
                <Text
                  style={{color: color.white, fontSize: 13, fontWeight: 600}}>
                  Result
                </Text>
              </TouchableOpacity>
            )}
            {/* {status &&
              ['Flash Card', 'Assessments', 'Reading Material'].includes(
                optionClick,
              ) && (
                <TouchableOpacity
                  disabled={true}
                  style={[
                    {
                      backgroundColor: '#7ED957',
                      paddingLeft: 10,
                      borderRadius: 20,
                      paddingRight: 10,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontSize: 13,
                      fontWeight: '600',
                      color: color.black,
                    },
                    Platform.OS === 'ios'
                      ? {borderRadius: 20}
                      : {borderRadius: 20},
                  ]}>
                  <Text>Completed</Text>
                </TouchableOpacity>
              )} */}
            {status &&
            (optionClick === 'Flash Card' ||
              optionClick === 'Assessments' ||
              optionClick === 'Reading Material') ? (
              <TouchableOpacity
                disabled={true}
                style={[
                  {
                    backgroundColor: '#7ED957',
                    paddingLeft: 10,
                    borderRadius: 20,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontSize: 13,
                    fontWeight: '600',
                    color: color.black,
                  },
                  Platform.OS === 'ios'
                    ? {borderRadius: 20}
                    : {borderRadius: 20},
                ]}>
                <Text>Completed</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <LinearGradient
            style={styles.textContainer}
            colors={
              isDark
                ? ['#2A89C6', '#3397CB', '#0C5CB4']
                : ['#f4f5f8', '#f4f5f8', '#f4f5f8']
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            {optionClick === 'Quiz' ? (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{width: '80%'}}>
                  <Text
                    selectable={true}
                    style={[styles.cardTitle, locked && {opacity: 0.5}]}>
                    {Title}
                  </Text>
                  <Text style={[styles.cardSubtitle, locked && {opacity: 0.5}]}>
                    {secondOption}
                  </Text>
                  {time_spent !== undefined &&
                    time_spent !== 0 &&
                    time_spent !== null && (
                      <Text
                        style={
                          locked
                            ? {fontSize: 12, color: color.black, opacity: 0.5}
                            : {fontSize: 12, color: color.black}
                        }>
                        You have spent: {formatTime(time_spent * 1000)}
                      </Text>
                    )}
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
                      onPress={() => console.log('no')}
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
                <Text style={[styles.cardTitle, locked && styles.lockedText]}>
                  {Title}
                </Text>
                <Text
                  style={[styles.cardSubtitle, locked && styles.lockedText]}>
                  {secondOption}
                </Text>
                {live_class_end_date && (
                  <Text style={styles.dateText}>
                    Class happened{' '}
                    {new Date(live_class_end_date).toLocaleString()}
                  </Text>
                )}
                {time_spent > 0 && (
                  <Text
                    style={[styles.timeSpentText, locked && styles.lockedText]}>
                    You have spent: {formatTime(time_spent * 1000)}
                  </Text>
                )}
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  contentContainer: {
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 100,
    shadowOffset: {
      width: 50,
      height: 60,
    },
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
  lockIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '37%',
    zIndex: 9999,
  },
  lockButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
});

export default QuizCard;
