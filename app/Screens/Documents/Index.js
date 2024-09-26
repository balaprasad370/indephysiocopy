import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
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
import Calender from '../../Components/Calender/Index';
import axios from 'axios';
import DocumentCard from '../../Components/DocumentCard/Index';
import Tasks from '../../Components/Tasks/Index';
import {ImageBackground} from 'react-native';

const Index = () => {
  const {isDark, path, setIsDark, documents} = useContext(AppContext);

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

  return (
    <SafeAreaView style={style.documentContainer}>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[{key: 'documents'}]}
          style={{padding: 20}}
          renderItem={() => (
            <View>
              <View>
                <Text style={style.buttonTab}>Documentation</Text>
                <Text style={style.modalStatus}>Status: Not started</Text>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 30, marginBottom: 10}}
                horizontal={true}>
                {[
                  {id: 1, title: 'Indephysio documents', content: 'Tasks'},
                  {
                    id: 2,
                    title: 'Document 2',
                    content: 'Content for Document 2',
                  },
                  {
                    id: 3,
                    title: 'Document 3',
                    content: 'Content for Document 3',
                  },
                ].map((doc, index) => (
                  <DocumentCard
                    key={doc.id}
                    isDone={index === 0}
                    title={doc.title}
                    onPress={() => setSelectedDocument(doc)}
                  />
                ))}
                {/* <DocumentCard isDone={true} />
                <DocumentCard isDone={true} />
                <DocumentCard /> */}
              </ScrollView>

              <View style={{marginTop: 30}}>
                <Tasks name="Payments and Dues" />
                <Tasks name="Agreements" />
                <Tasks name="Request for Attestation" />
                <Tasks name="Software and App terms and agreement" />
              </View>
            </View>
          )}
          keyExtractor={item => item.key}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  documentItem: {
    backgroundColor: '#FFF',
    // padding: 10,
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  documentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  documentBox: {
    width: '30%',
    backgroundColor: '#f0f4ff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
