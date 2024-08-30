import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Button,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AppContext} from '../../theme/AppContext';
import color from '../../Constants/color';
import scale from '../../utils/utils';
import {useNavigation} from '@react-navigation/native';
import storage from '../../Constants/storage';

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
  const {isDark, path} = useContext(AppContext);

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay() || 7;
    if (day !== 1) now.setHours(-24 * (day - 1));
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
      try {
        const response = await axios.get(
          `http://${path}:4000/app/schedule`,
          // `https://server.indephysio.com/app/schedule`,
          {
            params: {
              package_id: '3',
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );

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
                  });
                }

                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
              }
            } else if (item.schdeule_recur_type === 'weekly') {
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
                  });
                }

                currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
              }
            }
          }
        });
        const weekFilteredEvents = fetchedEvents.filter(event => {
          return (
            event.start >= getStartOfWeek() && event.start <= getEndOfWeek()
          );
        });

        setEvents(weekFilteredEvents);
      } catch (err) {
        console.log('Error fetching schedule:', err);
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
      style={styles.card}
      onPress={() => {
        setSelectedEvent(item);
        setModalVisible(true);
      }}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTime}>
          {`0${item.start.getHours()}-0${item.end.getHours()} ${
            item.start.getHours() >= 12 ? 'PM' : 'AM'
          }`}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !isNextWeek && styles.activeToggleButton,
          ]}
          onPress={() => {
            setIsNextWeek(false);
            fetchSchedule();
          }}>
          <Text style={styles.toggleText}>This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, isNextWeek && styles.activeToggleButton]}
          onPress={() => {
            setIsNextWeek(true);
            fetchSchedule();
          }}>
          <Text style={styles.toggleText}>Next Week</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={daysOfWeek}
        renderItem={({item: day}) => (
          <TouchableOpacity
            key={day}
            onPress={() => setSelectedDay(day)}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton,
            ]}>
            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText,
              ]}>
              {day}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={day => day}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daySelector}
      />

      {filteredEvents.length === 0 ? (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>No classes on {selectedDay}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventCard}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.eventList}
        />
      )}

      {selectedEvent && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <StatusBar
              barStyle={isDark ? 'light-content' : 'dark-content'}
              backgroundColor="rgba(0, 0, 0, 0.5)"
            />
            <View style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Icon name="times" size={18} color={color.darkGrey} />
              </TouchableOpacity>

              {/* Time at the Top */}
              <Text style={styles.modalTime}>
                {`${selectedEvent.start.getHours()}:${selectedEvent.start.getMinutes()} - ${selectedEvent.end.getHours()}:${selectedEvent.end.getMinutes()} ${
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
                style={styles.joinButton}
                onPress={() => {
                  navigation.navigate('Meeting', {room: 'checkpaaras'});
                  setModalVisible(false);
                }}>
                <Text style={styles.joinButtonText}>Join Class</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: scale(10),
  },
  toggleButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(20),
    backgroundColor: '#f0f0f0',
    marginHorizontal: scale(5),
  },
  activeToggleButton: {
    backgroundColor: color.lowPrimary,
  },
  toggleText: {
    color: '#000',
    fontWeight: 'bold',
  },
  daySelector: {
    marginVertical: scale(10),
    paddingHorizontal: scale(10),
    borderBottomWidth: scale(1),
    borderBottomColor: color.grey,
    paddingBottom: scale(6),
  },
  dayButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(15),
    borderRadius: scale(10),
    backgroundColor: '#f0f0f0',
    marginHorizontal: scale(5),
  },
  selectedDayButton: {
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
  card: {
    flex: 1,
    margin: scale(5),
    maxWidth: '50%',
    borderRadius: scale(5),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: scale(5),
    elevation: 3,
  },
  cardHeader: {
    backgroundColor: color.lightPrimary,
    padding: scale(10),
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  cardTime: {
    color: color.black,
    fontWeight: 'bold',
    fontSize: scale(13),
  },
  cardContent: {
    padding: scale(10),
  },
  cardTitle: {
    fontSize: scale(15),
    fontWeight: 'bold',
    color: color.black,
    marginBottom: scale(5),
  },
  cardDescription: {
    fontSize: scale(13),
    color: color.grey,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

const data = [
  {
    client_id: 7,
    created_date: '2024-08-27T05:09:57.000Z',
    description: '',
    modified_date: '2024-08-27T05:09:57.000Z',
    package_id: 1,
    schdeule_recur_type: 'weekdays',
    schedule_end_date: '2024-08-26T18:30:00.000Z',
    schedule_end_time: '07:35:00',
    schedule_id: 65,
    schedule_is_recurring: 1,
    schedule_recur_week_index: '1,2,3,4,5',
    schedule_recurring_date_end: '2024-09-09T18:30:00.000Z',
    schedule_recurring_date_start: '2024-08-26T18:30:00.000Z',
    schedule_start_date: '2024-08-26T18:30:00.000Z',
    schedule_start_time: '07:30:00',
    title: 'Weekdays (Paaras)',
  },
  {
    client_id: 7,
    created_date: '2024-08-27T05:11:12.000Z',
    description: '',
    modified_date: '2024-08-27T05:11:12.000Z',
    package_id: 1,
    schdeule_recur_type: '',
    schedule_end_date: '2024-08-26T18:30:00.000Z',
    schedule_end_time: '07:55:00',
    schedule_id: 66,
    schedule_is_recurring: 0,
    schedule_recur_week_index: '',
    schedule_recurring_date_end: '0000-00-00',
    schedule_recurring_date_start: '0000-00-00',
    schedule_start_date: '2024-08-26T18:30:00.000Z',
    schedule_start_time: '07:50:00',
    title: 'Do not recur(Paaras)',
  },
  {
    client_id: 7,
    created_date: '2024-08-27T05:12:36.000Z',
    description: '',
    modified_date: '2024-08-27T05:12:36.000Z',
    package_id: 1,
    schdeule_recur_type: 'daily',
    schedule_end_date: '2024-08-27T18:30:00.000Z',
    schedule_end_time: '08:00:00',
    schedule_id: 67,
    schedule_is_recurring: 1,
    schedule_recur_week_index: '0,1,2,3,4,5,6',
    schedule_recurring_date_end: '2024-08-29T18:30:00.000Z',
    schedule_recurring_date_start: '2024-08-26T18:30:00.000Z',
    schedule_start_date: '2024-08-27T18:30:00.000Z',
    schedule_start_time: '07:55:00',
    title: 'daily',
  },
];
