import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Button,
  ActivityIndicator,  
  SafeAreaView,
  StatusBar,
  Linking
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AppContext} from '../../theme/AppContext';
import color from '../../Constants/color';
import scale from '../../utils/utils';
import {useNavigation} from '@react-navigation/native';
import storage from '../../Constants/storage';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import LinearGradient from 'react-native-linear-gradient';
import {ROUTES} from '../../Constants/routes';
import { Tooltip } from 'react-native-paper';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const Index = () => {
  const currentDay = daysOfWeek[new Date().getDay() - 1];
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [events, setEvents] = useState([]);
  const [isNextWeek, setIsNextWeek] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const {isDark, path, packageId, clientId, packageName, documentStatus} =
    useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const [isLoading, setIsLoading] = useState(false);

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay() || 7;
    if (day !== 1) now.setHours(-24 * day);
    if (isNextWeek) now.setDate(now.getDate() + 7);
    return new Date(now.setHours(0, 0, 0, 0));
  };

  const getEndOfWeek = () => {
    const now = new Date(getStartOfWeek());
    now.setDate(now.getDate() + 6);
    return new Date(now.setHours(23, 59, 59, 999));
  };
  const fetchSchedule = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${path}/app/schedule`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });

        console.log("response", response.data);
        
        let fetchedEvents = [];

        response.data.forEach(item => {
          const startDate = new Date(item.schedule_start_date);
          const endDate = new Date(item.schedule_end_date);
          const [startHours, startMinutes] =
            item.schedule_start_time.split(':');
          const [endHours, endMinutes] = item.schedule_end_time.split(':');

          startDate.setHours(startHours, startMinutes);
          endDate.setHours(endHours, endMinutes);

          if (item.schedule_is_recurring === 0) {
            fetchedEvents.push({
              title: item.title,
              description: item.description,
              start: startDate,
              end: endDate,
              day: startDate.toLocaleDateString('en-US', {weekday: 'long'}),
              room_name: item.room_name,
            });
          } else if (item.schedule_is_recurring === 1) {
            const recurringStartDate = new Date(
              item.schedule_recurring_date_start,
            );
            const recurringEndDate = new Date(item.schedule_recurring_date_end);

            if (item.schdeule_recur_type === 'daily') {
              let currentDate = new Date(recurringStartDate);
              while (currentDate <= recurringEndDate) {
                let eventStartDate = new Date(currentDate);
                let eventEndDate = new Date(currentDate);

                eventStartDate.setHours(startHours, startMinutes);
                eventEndDate.setHours(endHours, endMinutes);

                fetchedEvents.push({
                  title: item.title,
                  description: item.description,
                  start: eventStartDate,
                  end: eventEndDate,
                  day: eventStartDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                  }),
                  room_name: item.room_name,
                });

                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
              }
            } else if (item.schdeule_recur_type === 'weekdays') {
              let weekdays = item.schedule_recur_week_index
                .split(',')
                .map(Number);

              let currentDate = new Date(recurringStartDate);
              while (currentDate <= recurringEndDate) {
                let dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                if (weekdays.includes(dayOfWeek)) {
                  let eventStartDate = new Date(currentDate);
                  let eventEndDate = new Date(currentDate);

                  eventStartDate.setHours(startHours, startMinutes);
                  eventEndDate.setHours(endHours, endMinutes);

                  fetchedEvents.push({
                    title: item.title,
                    description: item.description,
                    start: eventStartDate,
                    end: eventEndDate,
                    day: eventStartDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                    }),
                    room_name: item.room_name,
                  });
                }

                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
              }
            } else if (item.schdeule_recur_type === 'weekly') {
              let weekdays = item.schedule_recur_week_index
                .split(',')
                .map(Number);
              // Check if the start and end dates are invalid
              const invalidDate = '0000-00-00';
              const isInvalidDate =
                item.schedule_recurring_date_start === invalidDate ||
                item.schedule_recurring_date_end === invalidDate;

              if (isInvalidDate) {
                // Get the current date
                let currentDate = new Date();
                // Get the start of the current week (Monday)
                let startOfWeek = new Date(
                  currentDate.setDate(
                    currentDate.getDate() - currentDate.getDay() + 1,
                  ),
                );
                for (let i = 0; i < 7; i++) {
                  let dayOfWeek = startOfWeek.getDay() % 7; // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
                  if (weekdays.includes(dayOfWeek)) {
                    let eventStartDate = new Date(startOfWeek);
                    let eventEndDate = new Date(startOfWeek);
                    eventStartDate.setHours(startHours, startMinutes);
                    eventEndDate.setHours(endHours, endMinutes);

                    fetchedEvents.push({
                      title: item.title,
                      description: item.description,
                      start: eventStartDate,
                      end: eventEndDate,
                      day: eventStartDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                      }),
                      room_name: item.room_name,
                    });
                  }

                  startOfWeek.setDate(startOfWeek.getDate() + 1); // Move to the next day
                }
              } else {
                let weekdays = item.schedule_recur_week_index
                  .split(',')
                  .map(Number);
                let currentDate = new Date(recurringStartDate);

                while (currentDate <= recurringEndDate) {
                  let dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                  if (weekdays.includes(dayOfWeek)) {
                    let eventStartDate = new Date(currentDate);
                    let eventEndDate = new Date(currentDate);

                    eventStartDate.setHours(startHours, startMinutes);
                    eventEndDate.setHours(endHours, endMinutes);

                    fetchedEvents.push({
                      title: item.title,
                      description: item.description,
                      start: eventStartDate,
                      end: eventEndDate,
                      day: eventStartDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                      }),
                      room_name: item.room_name,
                    });
                  }

                  currentDate.setDate(currentDate.getDate() + 1);
                }
              }
            }
          }
        });
        const weekFilteredEvents = fetchedEvents.filter(event => {
          return (
            event.start >= getStartOfWeek() && event.start <= getEndOfWeek()
          );
        });

        console.log("weekFilteredEvents", weekFilteredEvents);
        

        setEvents(weekFilteredEvents);
      } catch (err) {
        setEvents([]);
        if (err.response) {
          const status = err.response.status;
          if (status === 404) {
            console.log('No schedules found for the provided criteria.');
          } else if (status === 500) {
            console.log(
              'An error occurred while fetching the schedule. Please try again later.',
            );
          } else {
            console.log('An unexpected error occurred.');
          }
        } else if (err.request) {
          console.log(
            'No response received from the server. Please check your network connection.',
          );
        } else {
          console.log('Error in setting up the request:', err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    fetchSchedule();
  }, [isNextWeek]);

  const filteredEvents = events.filter(event => event.day === selectedDay);

  const renderEventCard = ({item}) => (
    <TouchableOpacity
      style={style.liveClasscard}
      hitSlop={{x: 25, y: 15}}
      onPress={() => {
        setSelectedEvent(item);
        setModalVisible(true);
      }}>
      <LinearGradient
        colors={['#2A89C6', '#3397CB', '#0C5CB4']}
        start={{x: 0, y: 0}} // Start from the left
        end={{x: 1, y: 0}}
        style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTime}>{item.title}</Text>
          <View style={styles.cardTimeDiv}></View>
        </View>
      </LinearGradient>
      <View style={styles.cardContent}>
        <View style={{marginTop: scale(5)}}>
          <Text style={{marginVertical: 7}}>{item.description}</Text>
        </View>
        <Text style={styles.cardTime}>
          {`${item.start.getHours()}:${item.start
            .getMinutes()
            .toString()
            .padStart(2, '0')} - ${item.end.getHours()}:${item.end
            .getMinutes()
            .toString()
            .padStart(2, '0')} ${item.start.getHours() >= 12 ? 'PM' : 'AM'}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

 

  return (
    <>
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={"#613BFF"} />
      <View style={style.liveClasscontainer}>
        <View style={{height: '18%'}}>
          <View style={styles.toggleContainer}>
            <LinearGradient
              colors={
                !isNextWeek
                  ? ['#2A89C6', '#3397CB', '#0C5CB4'] // Colors for 'Next Week'
                  : isDark
                  ? ['#3B3B3B', '#3B3B3B']
                  : ['#f5f5f5', '#f5f5f5'] // Colors for 'This Week'
              }
              start={{x: 0, y: 0}} // Start from the left
              end={{x: 1, y: 0}} // End at the right
              style={[
                style.toggleButton,
                !isNextWeek && styles.activeToggleButton,
              ]}>
              <TouchableOpacity
                // style={[
                //   style.toggleButton,
                //   !isNextWeek && styles.activeToggleButton,
                // ]}
                hitSlop={{x: 25, y: 15}}
                onPress={() => {
                  setIsNextWeek(false);
                  fetchSchedule();
                }}>
                <Text
                  style={[
                    style.toggleText,
                    !isNextWeek && style.activeToggleText,
                  ]}>
                  This Week
                </Text>
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={
                isNextWeek
                  ? ['#2A89C6', '#3397CB', '#0C5CB4'] // Colors for 'Next Week'
                  : isDark
                  ? ['#3B3B3B', '#3B3B3B']
                  : ['#f5f5f5', '#f5f5f5'] // Colors for 'This Week'
              }
              start={{x: 0, y: 0}} // Start from the left
              end={{x: 1, y: 0}} // End at the right
              style={[
                style.toggleButton,
                !isNextWeek && styles.activeToggleButton,
              ]}>
              <TouchableOpacity
                // style={[
                //   style.toggleButton,
                //   isNextWeek && styles.activeToggleButton,
                // ]}
                hitSlop={{x: 25, y: 15}}
                onPress={() => {
                  setIsNextWeek(true);
                  fetchSchedule();
                }}>
                <Text style={style.toggleText}>Next Week</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              style={{padding: scale(10), borderWidth: 1, borderColor: '#0C5CB4', borderRadius: scale(10)}}
              onPress={() => {
                fetchSchedule();
              }}>
              <Icon name="refresh" size={18} color={'#0C5CB4'} />
            </TouchableOpacity>

          </View>

          <FlatList
            horizontal
            data={daysOfWeek}
            renderItem={({item: day}) => (
              <LinearGradient
                colors={
                  selectedDay === day
                    ? ['#2A89C6', '#3397CB', '#0C5CB4'] // Colors for 'Next Week'
                    : isDark
                    ? ['#3B3B3B', '#3B3B3B']
                    : ['#f5f5f5', '#f5f5f5'] // Colors for 'This Week'
                }
                style={[
                  style.dayButton,
                  selectedDay === day && styles.selectedDayButton,
                ]}
                start={{x: 0, y: 0}} // Start from the left
                end={{x: 1, y: 0}}>
                <TouchableOpacity
                  hitSlop={{x: 25, y: 15}}
                  key={day}
                  onPress={() => setSelectedDay(day)}>
                  <Text
                    style={[
                      style.dayText,
                      selectedDay === day && styles.selectedDayText,
                    ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
            keyExtractor={day => day}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
          />
        </View>

       {isLoading ? (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color={color.darkPrimary} />
    </View>) :
        (<View style={{height: '83%',paddingVertical: scale(10)}}>
          {filteredEvents.length === 0 ? (
            <>
            <FlatList
              data={[1]}
              renderItem={() => (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: scale(10)}}>
                  <Text style={{fontSize: scale(17), color: color.black}}>No classes on {selectedDay}</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.eventList}
              onRefresh={fetchSchedule}
              refreshing={isLoading}
            
            />
           
           {documentStatus !== 2 ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: scale(10)}}>
           
           <Tooltip title="Subscribe to access live classes" style={{padding: scale(10), borderRadius: scale(5)}}>
                  <LinearGradient
                  colors={['#2A89C6', '#3397CB', '#0C5CB4']}
                  start={{x: 0, y: 0}} // Start from the left
                  end={{x: 1, y: 0}}
                  style={{padding: scale(10), borderRadius: scale(10)}}>
                  <TouchableOpacity onPress={() => Linking.openURL('https://portal.indephysio.com/dashboard')}
                   style={{ borderRadius: scale(10)}}>
                    <Text style={{fontSize: scale(17), color: color.white}}>Subscribe Now</Text>
                  </TouchableOpacity>
                  </LinearGradient>
                  </Tooltip>
                  </View> : null}
            </>

          ) : (
            <FlatList
              data={filteredEvents}
              renderItem={renderEventCard}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.eventList}
              onRefresh={fetchSchedule}
              refreshing={isLoading}
            />
          )}
        </View>)}

        {selectedEvent && (
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Close Button */}
                <TouchableOpacity
                  hitSlop={{x: 25, y: 15}}
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Icon name="times" size={18} color={color.darkGrey} />
                </TouchableOpacity>

                {/* Time at the Top */}
                <Text style={styles.modalTime}>
                  {`${selectedEvent.start.getHours()}:${selectedEvent.start
                    .getMinutes()
                    .toString()
                    .padStart(
                      2,
                      '0',
                    )} - ${selectedEvent.end.getHours()}:${selectedEvent.end
                    .getMinutes()
                    .toString()
                    .padStart(2, '0')} ${
                    selectedEvent.start.getHours() >= 12 ? 'PM' : 'AM'
                  }`}
                </Text>

                {/* Title and Description */}
                <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedEvent.description}
                </Text>

                {/* Join Class Button */}
                <TouchableOpacity
                  hitSlop={{x: 25, y: 15}}
                  style={styles.joinButton}
                  onPress={() => {
                    navigation.navigate('Meeting', {
                      room: selectedEvent.room_name,
                    });
                    setModalVisible(false);
                  }}>
                  <Text style={styles.joinButtonText}>Join Class</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scale(10),
    gap: scale(10),
    paddingHorizontal: scale(10),
    paddingTop: scale(10),
  },

  activeToggleButton: {
    backgroundColor: color.lowPrimary,
  },

  daySelector: {
    marginVertical: scale(10),
    paddingHorizontal: scale(10),
    borderBottomWidth: scale(1),
    borderBottomColor: color.grey,
    paddingBottom: scale(6),
    height: scale(50),
  },
  dayButton: {
    paddingVertical: scale(10),
    height: scale(40),
    paddingHorizontal: scale(15),
    borderRadius: scale(10),
    backgroundColor: '#f0f0f0',
    marginHorizontal: scale(5),
  },
  selectedDayButton: {
    height: scale(40),
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderRadius: scale(10),
    marginHorizontal: scale(5),
    backgroundColor: color.lowPrimary,
  },
  dayText: {
    color: '#000',
  },
  selectedDayText: {
    color: color.black,
    fontWeight: 'bold',
  },
  eventList: {
    paddingHorizontal: scale(8),
    paddingBottom: scale(20),
  },
  noEventsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: scale(17),
    color: color.black,
  },

  cardHeader: {
    backgroundColor: color.lightPrimary,
    padding: scale(10),
    borderTopLeftRadius: scale(3),
    borderTopRightRadius: scale(3),
  },
  cardTime: {
    color: color.black,
    fontWeight: 'bold',
    fontSize: scale(15),
  },
  mainHeaderLevel: {
    textAlign: 'center',
    fontSize: scale(14),
    fontWeight: '700',
    color: color.black,
  },
  cardTimeDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pathway: {
    fontSize: scale(14),
    fontWeight: '600',
    color: color.black,
  },
  cardContent: {
    padding: scale(10),
  },

  cardDescription: {
    fontSize: scale(13),
    color: color.grey,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: scale(10),
    padding: scale(20),
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTime: {
    fontSize: 16,
    color: '#888',
    marginBottom: scale(10),
    textAlign: 'left',
  },
  modalTitle: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: scale(10),
    textAlign: 'left',
  },
  modalDescription: {
    fontSize: scale(15),
    color: '#555',
    marginBottom: scale(10),
    textAlign: 'left',
  },
  joinButton: {
    alignSelf: 'flex-end',
    backgroundColor: color.darkPrimary,
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(5),
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(15),
  },
});

export default Index;
