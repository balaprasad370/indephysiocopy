import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Upload from 'react-native-vector-icons/AntDesign';
import SearchComponent from '../../Components/SearchComponent/Index';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import {Calendar} from 'react-native-big-calendar';

const Index = () => {
  const appContext = useContext(AppContext);

  const {isDark, setIsDark} = appContext;

  const style = isDark ? DarkTheme : LighTheme;

  // const events = [
  //   {
  //     title: 'Meeting',
  //     start: new Date(2024, 6, 31, 10, 0), // Note: month is 0-indexed, so 6 is July
  //     end: new Date(2024, 6, 31, 15, 30),
  //   },
  //   {
  //     title: 'Coffee break',
  //     start: new Date(2024, 6, 30, 10, 45),
  //     end: new Date(2024, 6, 30, 12, 30),
  //   },
  // ];
  const [events, setEvents] = useState([
    // {
    //   title: 'Meeting',
    //   start: new Date(2024, 6, 31, 10, 0),
    //   end: new Date(2024, 6, 31, 10, 30),
    // },
    // {
    //   title: 'Coffee break',
    //   start: new Date(2024, 6, 30, 15, 45),
    //   end: new Date(2024, 6, 30, 16, 30),
    // },
  ]);

  const handleAddEvent = () => {
    if (eventTitle && eventEndTime) {
      const endDate = new Date(selectedDate);
      const [hours, minutes] = eventEndTime.split(':');
      endDate.setHours(hours);
      endDate.setMinutes(minutes);

      const newEvent = {
        title: eventTitle,
        start: selectedDate,
        end: endDate,
      };
      setEvents([...events, newEvent]);
    }
    setModalVisible(false);
  };

  const handleEventPress = event => {
    Alert.prompt(
      'Update Event',
      `Enter new title for the event:`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: newTitle => {
            if (newTitle) {
              const updatedEvents = events.map(evt => {
                if (evt.title === event.title && evt.start === event.start) {
                  return {...evt, title: newTitle};
                }
                return evt;
              });
              setEvents(updatedEvents);
            }
          },
        },
      ],
      'plain-text',
      event.title,
    );
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');

  const handleDatePress = date => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  return (
    <ScrollView style={style.documentBody}>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              onChangeText={setEventTitle}
              value={eventTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="End Time (HH:MM)"
              onChangeText={setEventEndTime}
              value={eventEndTime}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={handleAddEvent}>
              <Text style={styles.textStyle}>Add Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      <View>
        <View>
          <Text style={style.documentText}>Document Name</Text>
          <Text style={style.documentStatus}>Status: Attested</Text>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}>
        <View style={style.documentPage}></View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              alignItems: 'center',
              // paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: '#4daffc',
              marginRight: '15%',
              borderRadius: 50,
            }}>
            <View
              style={{
                width: 45,
                backgroundColor: 'white',
                height: 45,
                borderRadius: 50,
                borderWidth: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Upload name="arrowup" style={{fontSize: 40}} />
            </View>
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                padding: 10,
                fontWeight: '600',
              }}>
              Upload
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              alignItems: 'center',
              // paddingLeft: 10,
              // paddingRight: 10,
              padding: 10,
              backgroundColor: '#4daffc',
              borderRadius: 50,
            }}>
            <Icon
              name="wifi-tethering-error-rounded"
              style={{fontSize: 27, marginRight: 10, color: 'white'}}
            />
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                // paddingLeft: 20,
                // paddingRight: 20,
                paddingTop: 5,
                paddingBottom: 5,
                fontWeight: '700',
              }}>
              Order transaction
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <SearchComponent />
      </View>
      <Text
        style={{
          textAlign: 'right',
          marginRight: 50,
          marginTop: 20,
          fontSize: 18,
          color: '#979797',
        }}>
        Sort by
      </Text>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
