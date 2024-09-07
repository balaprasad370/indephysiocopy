import {
  Alert,
  FlatList,
  Modal,
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
import Calender from '../../Components/Calender/Index';
import axios from 'axios';

const Index = () => {
  const {isDark, setIsDark, documents} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;
  const [events, setEvents] = useState([]);

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

  const {path} = useContext(AppContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        ListHeaderComponent={
          <View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{marginBottom: 8}}>
                <Text style={style.documentText}>Document Name</Text>
                <Text style={style.documentStatus}>Status: Attested</Text>
              </View>
              <View style={style.documentPage}></View>
            </View>
            <View
              style={{
                display: 'flex',
                marginTop: 10,

                marginBottom: 20,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                <TouchableOpacity style={styles.uploadButton}>
                  <View style={styles.uploadIconContainer}>
                    <Upload
                      name="arrowup"
                      style={{fontSize: 20, color: 'black'}}
                    />
                  </View>
                  <Text style={styles.uploadText}>Upload</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.orderTransactionButton}>
                  <Icon
                    name="wifi-tethering-error-rounded"
                    style={{fontSize: 27, marginRight: 10, color: 'white'}}
                  />
                  <Text style={styles.orderTransactionText}>
                    Order transaction
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.sortText}>Sort by</Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.documentItem}>
            <Text>Document Name: {item.document_name}</Text>
            <Text>Status: {item.status}</Text>
            {/* Display other document details as needed */}
          </View>
        )}
        ListEmptyComponent={<Text>No documents found.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  documentItem: {
    backgroundColor: '#FFF',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  uploadButton: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#4daffc',
    borderRadius: 50,
  },
  uploadIconContainer: {
    width: 30,
    backgroundColor: 'white',
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#4daffc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  orderTransactionButton: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#4daffc',
    borderRadius: 50,
  },
  orderTransactionText: {
    fontSize: 16,
    color: 'white',
    paddingTop: 5,
    paddingBottom: 5,
    fontWeight: '700',
  },
  sortText: {
    textAlign: 'right',
    marginRight: 50,
    marginTop: 20,
    fontSize: 18,
    color: '#979797',
  },
});
