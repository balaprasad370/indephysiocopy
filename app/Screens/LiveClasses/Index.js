import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import storage from '../../Constants/storage';
import axiosInstance from '../../Components/axiosInstance';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';
import LiveclassJoin from './components/LiveclassJoin';
import {ROUTES} from '../../Constants/routes';
import {Mixpanel} from 'mixpanel-react-native';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const Schedule = () => {
  const navigation = useNavigation();
  const currentDay = daysOfWeek[new Date().getDay() - 1] || daysOfWeek[6]; // Default to Sunday if getDay() returns 0
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [events, setEvents] = useState([]);
  const [isNextWeek, setIsNextWeek] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [classInfo, setClassInfo] = useState(null);

  const trackAutomaticEvents = false;
  const mixpanel = new Mixpanel(
    '307ab8f1e535a257669ab35fffe22d8f',
    trackAutomaticEvents,
  );

  useEffect(() => {
    mixpanel.init();
  }, []);

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay() || 7;
    if (day !== 1) now.setHours(-24 * (day - 1));
    if (isNextWeek) now.setDate(now.getDate() + 7);
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const getEndOfWeek = () => {
    const now = new Date(getStartOfWeek());
    now.setDate(now.getDate() + 6);
    now.setHours(23, 59, 59, 999);
    return now;
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const fetchSchedule = async () => {
    const token = await storage.getStringAsync('token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/app/schedule`);
      console.log('response.data', response.data);

      let fetchedEvents = [];

      response.data.forEach(item => {
        if (
          item.schedule_is_recurring === 1 &&
          item.schdeule_recur_type === 'weekly'
        ) {
          const weekIndex = parseInt(item.schedule_recur_week_index);
          if (isNaN(weekIndex)) return;

          // Convert weekIndex to day name (1 = Monday, etc)
          const dayName = daysOfWeek[weekIndex - 1];
          if (!dayName) return;

          const [startHours, startMinutes] =
            item.schedule_start_time?.split(':') || [];
          const [endHours, endMinutes] = item?.schedule_end_time?.split(':') || [];

          if (!startHours || !startMinutes || !endHours || !endMinutes) return;

          // Get current week's date for this weekday
          const currentDate = new Date(getStartOfWeek());
          const daysToAdd = weekIndex - 1; // Simplified calculation since getStartOfWeek() returns Monday
          currentDate.setDate(currentDate.getDate() + daysToAdd);

          const eventStartDate = new Date(currentDate);
          const eventEndDate = new Date(currentDate);

          eventStartDate.setHours(
            parseInt(startHours),
            parseInt(startMinutes),
            0,
            0,
          );
          eventEndDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

          const startOfWeek = getStartOfWeek();
          const endOfWeek = getEndOfWeek();

          // Check if recurring dates are "0000-00-00"
          const isZeroStartDate =
            item.schedule_recurring_date_start &&
            item.schedule_recurring_date_start.includes('0000-00-00');
          const isZeroEndDate =
            item.schedule_recurring_date_end &&
            item.schedule_recurring_date_end.includes('0000-00-00');

          // Check excluded dates
          const excludedDates = item.schedule_recur_exclude_dates
            ? item.schedule_recur_exclude_dates.split(',').filter(date => date)
            : [];
          const isExcludedDate = excludedDates.some(date => {
            const excludeDate = new Date(date);
            return isSameDate(excludeDate, currentDate);
          });

          if (isExcludedDate) {
            return;
          }

          // If dates are "0000-00-00", show event regardless of date range
          if (isZeroStartDate || isZeroEndDate) {
            if (eventStartDate >= startOfWeek && eventStartDate <= endOfWeek) {
              fetchedEvents.push({
                id: item.schedule_id,
                title: item.title || 'Untitled',
                description: item.description || '',
                start: eventStartDate,
                end: eventEndDate,
                start_time: item.schedule_start_time,
                end_time: item?.schedule_end_time,
                day: dayName,
                room_name: item.room_name || '',
              });
            }
          } else {
            // Check if current week falls within recurring date range
            const recurStartDate = new Date(item.schedule_recurring_date_start);
            const recurEndDate = new Date(item.schedule_recurring_date_end);

            if (startOfWeek >= recurStartDate && endOfWeek <= recurEndDate) {
              if (
                eventStartDate >= startOfWeek &&
                eventStartDate <= endOfWeek
              ) {
                fetchedEvents.push({
                  id: item.schedule_id,
                  title: item.title || 'Untitled',
                  description: item.description || '',
                  start: eventStartDate,
                  end: eventEndDate,
                  start_time: item.schedule_start_time,
                  end_time: item?.schedule_end_time,
                  day: dayName,
                  room_name: item.room_name || '',
                });
              }
            }
          }
        } else if (item.schedule_is_recurring === 0) {
          // Handle non-recurring events
          if (!item.schedule_start_date) return;
          
          const startDate = new Date(item.schedule_start_date);
          const [startHours, startMinutes] =
            item.schedule_start_time?.split(':') || [];
          const [endHours, endMinutes] = item?.schedule_end_time?.split(':') || [];

          if (!startHours || !startMinutes || !endHours || !endMinutes) return;

          const eventStartDate = new Date(startDate);
          const eventEndDate = new Date(startDate);

          eventStartDate.setHours(
            parseInt(startHours),
            parseInt(startMinutes),
            0,
            0,
          );
          eventEndDate.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

          const startOfWeek = getStartOfWeek();
          const endOfWeek = getEndOfWeek();

          if (eventStartDate >= startOfWeek && eventStartDate <= endOfWeek) {
            console.log('item', item);

            fetchedEvents.push({
              id: item.schedule_id,
              title: item.title || 'Untitled',
              description: item.description || '',
              start: eventStartDate,
              end: eventEndDate,
              start_time: item.schedule_start_time,
              end_time: item?.schedule_end_time,
              day: daysOfWeek[startDate.getDay() - 1] || daysOfWeek[6],
              room_name: item.room_name || '',
            });
          }
        }
      });

      console.log('fetchedEvents', fetchedEvents);

      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [isNextWeek]);

  const filteredEvents = events.filter(event => event.day === selectedDay);

  const renderEventCard = ({item}) => {
    console.log('item', item);

    const now = new Date();
    const isUpcoming =
      moment(item.start).isAfter(now) &&
      moment(item.start).isSameOrAfter(moment().startOf('day'));
    const isOngoing =
      moment(item.start).isBefore(now) && moment(item.end).isAfter(now);
    const isEnded = moment(item.end).isBefore(now);

    let statusText = '';
    let statusColor = '';
    let statusIcon = null;

    if (isUpcoming) {
      statusText = 'Upcoming';
      statusColor = '#613BFF';
      statusIcon = (
        <FontAwesome name="arrow-circle-up" size={16} color={statusColor} />
      );
    } else if (isOngoing) {
      statusText = 'Ongoing';
      statusColor = '#32CD32';
      statusIcon = (
        <MaterialIcons name="live-tv" size={16} color={statusColor} />
      );
    } else if (isEnded) {
      statusText = 'Ended';
      statusColor = '#32CD32';
      statusIcon = (
        <FontAwesome name="check-circle" size={16} color={statusColor} />
      );
    }

    return (
      <View
        key={item.id}
        style={{borderColor: statusColor}}
        className="rounded-lg bg-white dark:bg-n75 shadow-lg border-2 mb-4 mx-4 overflow-hidden">
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className="text-gray-800 dark:text-white text-lg font-bold"
              numberOfLines={1}>
              {item.title && item.title.length > 20
                ? item.title.substring(0, 20) + '...'
                : item.title}
            </Text>
            <View className="flex-row items-center space-x-2">
              {statusIcon}
              <Text className="text-sm" style={{color: statusColor}}>
                {statusText}
              </Text>
            </View>
          </View>

          <View className="flex-row items-start space-x-4 mb-4">
            <FontAwesome name="info-circle" size={16} color="#666" />
            <Text className="text-gray-600 dark:text-white flex-1 text-sm">
              {item.description || 'No description available'}
            </Text>
          </View>

          <View className="flex-row items-center space-x-4 mb-4">
            <FontAwesome name="clock-o" size={16} color="#666" />
            <Text className="text-gray-700 dark:text-white text-sm">
              {`${item.start
                .getHours()
                .toString()
                .padStart(2, '0')}:${item.start
                .getMinutes()
                .toString()
                .padStart(2, '0')} - ${item.end
                .getHours()
                .toString()
                .padStart(2, '0')}:${item.end
                .getMinutes()
                .toString()
                .padStart(2, '0')}`}
            </Text>
          </View>

          {!isEnded ? (
            <TouchableOpacity
              className="bg-p1 w-full flex-row py-4 px-4 rounded-lg space-x-4 items-center justify-center"
              onPress={() => {
                setIsOpen(true);
                setSelectedEvent(item);
              }}>
              <MaterialIcons name="video-call" size={20} color="white" />
              <Text className="text-white text-center text-sm font-semibold">
                Join Meeting
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-green-500 w-full flex-row py-4 px-4 rounded-lg space-x-4 items-center justify-center"
              onPress={() => {
                setIsOpen(true);
                setSelectedEvent(item);
              }}>
              <MaterialIcons name="info-outline" size={20} color="white" />
              <Text className="text-white text-center text-sm font-semibold">
                View Details
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const RenderClassInfo = () => {
    const isExpired = classInfo?.schedule_start_date 
      ? new Date(classInfo.schedule_start_date) < new Date()
      : false;

    return (
      <View className="flex-1 bg-white dark:bg-n75 rounded-lg w-full h-full">
        {/* header */}
        <View className="flex-row items-center justify-between border-b border-gray-200 py-3 px-4">
          <Text className="text-lg font-bold text-gray-800 dark:text-white flex-1 text-center">
            Class Info
          </Text>

          <View className="w-8">
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <MaterialIcons name="close" size={24} color="#ff0000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* title and description */}
        <View className="">
          <View className="px-6 py-6">
            <Text className="text-2xl font-bold text-p1 mb-4">
              {classInfo?.title || 'Untitled Class'}
            </Text>

            <View className="flex-row items-start mb-6">
              <MaterialIcons
                name="description"
                size={20}
                color="#666"
                style={{marginTop: 2}}
              />
              <Text className="text-gray-600 dark:text-gray-300 text-base leading-relaxed ml-2 flex-1">
                {classInfo?.description || 'No description available'}
              </Text>
            </View>

            <View className="flex-row items-center justify-start">
              <MaterialIcons name="access-time" size={20} color="#666" />
              <Text className="text-gray-600 dark:text-gray-300 text-base leading-relaxed  ml-2">
                {classInfo?.schedule_start_time
                  ? moment(classInfo.schedule_start_time, 'HH:mm').format('HH:mm')
                  : '--:--'}
              </Text>

              <MaterialIcons
                name="remove"
                size={20}
                color="#666"
                style={{marginHorizontal: 4}}
              />

              <Text className="text-gray-600 dark:text-gray-300 text-base leading-relaxed ">
                {classInfo?.schedule_end_time
                  ? moment(classInfo.schedule_end_time, 'HH:mm').format('HH:mm')
                  : '--:--'}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 py-4 border-t border-gray-200">
          {!classInfo?.live_class_recording_url && (
            <TouchableOpacity
              className="bg-p1 flex-row items-center justify-center py-4 px-6 rounded-xl mb-4"
              onPress={async () => {
                const studentName = await storage.getStringAsync('studentName');
                const studentId = await storage.getStringAsync('studentId');
                const email = await storage.getStringAsync('email');

                mixpanel.track('Join Live Class', {
                  room: classInfo?.room_name,
                  title: classInfo?.title,
                  studentName: studentName,
                  studentId: studentId,
                  email: email,
                });

                // Handle join meeting
                navigation.navigate(ROUTES.MEETING, {
                  room: classInfo?.room_name,
                });
              }}>
              <MaterialIcons
                name="video-call"
                size={24}
                color="white"
                style={{marginRight: 8}}
              />
              <Text className="text-white font-bold text-base">
                Join Live Class
              </Text>
            </TouchableOpacity>
          )}

          {classInfo?.live_class_recording_url ? (
            <TouchableOpacity
              className="bg-green-500 flex-row items-center justify-center py-3 px-6 rounded-xl"
              onPress={async () => {
                const studentName = await storage.getStringAsync('studentName');
                const studentId = await storage.getStringAsync('studentId');
                const email = await storage.getStringAsync('email');

                mixpanel.track('View Recording', {
                  room: classInfo?.room_name,
                  title: classInfo?.title,
                  studentName: studentName,
                  studentId: studentId,
                  email: email,
                });

                navigation.navigate(ROUTES.RECORDING, {
                  video_url: classInfo?.live_class_recording_url,
                });
              }}>
              <MaterialIcons
                name="play-circle-filled"
                size={24}
                color="#fff"
                style={{marginRight: 8}}
              />
              <Text className="text-white font-semibold text-base">
                View Recording
              </Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-center text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              No recording available
            </Text>
          )}
        </View>
      </View>
    );
  };

  const fetchClassInfo = async () => {
    if (!selectedEvent?.id || !selectedEvent?.room_name || !selectedEvent?.start) {
      console.error('Missing required event information');
      return;
    }
    
    try {
      const url = `/student/schedule/info/${selectedEvent.id}/${
        selectedEvent.room_name
      }/${moment(selectedEvent.start).format('YYYY-MM-DD')}`;

      console.log('url', url);

      const response = await axiosInstance.get(url);
      console.log('response.data about to fetch rf', response.data.result);
      setClassInfo(response.data.result);
    } catch (error) {
      console.error('Error fetching class info:', error);
    }
  };

  useEffect(() => {
    if (isOpen && selectedEvent) {
      console.log('selectedEvent', selectedEvent);
      fetchClassInfo();
    }
  }, [isOpen, selectedEvent]);

  return (
    <SafeAreaView className="flex-1 bg-b50  min-h-full dark:bg-n75 dark:text-white">
      <View className="">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image source={topBgBackground} className="w-full h-[200px] -mt-24" />
        </View>
        <PageTitle pageName="Live Classes" hideBackButton={true} />
      </View>
      <View className="flex-1 pt-8 pb-8">
        <View className=" dark:bg-n75 shadow-sm py-4 mb-4">
          <View className="flex-row items-center justify-between px-8 mb-4">
            <View className="flex-row gap-4 items-center justify-start w-full">
              <Pressable
                hitSlop={{x: 25, y: 15}}
                onPress={() => setIsNextWeek(false)}
                className={`px-4 py-2 rounded-lg ${
                  !isNextWeek
                    ? 'bg-p1'
                    : 'border-b75 bg-b50 border border-p1  dark:text-white dark:bg-n50 dark:border-n70'
                }`}>
                <Text
                  className={`font-medium ${
                    !isNextWeek ? 'text-white' : 'text-p1'
                  }`}>
                  This Week
                </Text>
              </Pressable>

              <Pressable
                hitSlop={{x: 25, y: 15}}
                onPress={() => setIsNextWeek(true)}
                className={`px-4 py-2 rounded-lg ${
                  isNextWeek
                    ? 'bg-p1'
                    : 'border-b75 bg-b50 border border-p1  dark:text-white dark:bg-n50 dark:border-n70'
                }`}>
                <Text
                  className={`font-medium ${
                    isNextWeek ? 'text-white' : 'text-p1'
                  }`}>
                  Next Week
                </Text>
              </Pressable>
            </View>
            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              className="p-2.5 rounded-lg border border-p1 mr-4"
              onPress={fetchSchedule}>
              <FontAwesome name="refresh" size={18} color="#613BFF" />
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            data={daysOfWeek}
            contentContainerStyle={{paddingRight: 20}}
            renderItem={({item: day}) => (
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
                onPress={() => setSelectedDay(day)}
                className={`px-5 py-3 mx-2  rounded-lg ${
                  selectedDay === day
                    ? 'bg-p1'
                    : 'bg-b50 dark:bg-n50 border border-p1'
                }`}>
                <Text
                  className={`text-center font-medium ${
                    selectedDay === day ? 'text-white' : 'text-p1'
                  }`}>
                  {day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            className="px-4"
          />
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        ) : (
          <View className="flex-1">
            {filteredEvents.length === 0 ? (
              <View className="flex-1 justify-center items-center px-4">
                <Image
                  source={{
                    uri: 'https://www.shutterstock.com/image-photo/black-chalkboard-words-no-class-260nw-2366628319.jpg',
                  }}
                  className="w-50 h-50 mb-5"
                />
                <Text className="text-xl font-bold text-gray-800 mb-2">
                  No Classes Found
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredEvents}
                renderItem={renderEventCard}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
                onRefresh={fetchSchedule}
                refreshing={isLoading}
              />
            )}
          </View>
        )}
      </View>

      {isOpen && (
        <View className="absolute bottom-0 left-0 right-0 w-full h-full bg-black/10">
          <Pressable
            onPress={() => {
              setIsOpen(false);
            }}
            className="w-full h-full absolute "></Pressable>
          <View className="flex-1">
            <LiveclassJoin className="flex-1 z-20">
              <RenderClassInfo />
            </LiveclassJoin>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Schedule;
