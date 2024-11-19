import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Calendar} from 'react-native-calendars';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import axios from 'axios';

const Index = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [classes, setClasses] = useState([]); // State to store the fetched classes
  const {isDark, path, packageId} = useContext(AppContext);

  const handleSearch = () => {
    console.log('Search initiated with:', searchText);
  };

  const handleFilter = () => {
    setIsModalVisible(true); // Show calendar when filter button is clicked
  };

  const handleDateSelect = date => {
    setSelectedDate(date.dateString); // Get the selected date
    setIsModalVisible(false); // Close the calendar after date selection
    console.log('Selected Date:', date.dateString); // Print selected date
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the calendar if cancel is pressed
  };

  const fetchSchedule = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(`${path}/app/filter/liveclassess`, {
          params: {
            package_id: packageId,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setClasses(response?.data || []); // Set the classes in state
        console.log('Fetched Classes:', response?.data);
      } catch (error) {
        console.log('Error fetching schedule:', error);
      }
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const renderClassItem = ({item}) => {
    const formatDate = isoDate => {
      if (!isoDate) return 'N/A'; // Handle empty or null date values
      const date = new Date(isoDate);
      return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    };

    return (
      <View style={styles.classCard}>
        <Text style={styles.classTitle}>{item.title_live}</Text>
        <Text style={styles.classDescription}>{item.description_live}</Text>
        <Text style={styles.classTime}>
          Created: {formatDate(item.created_date_live)} | Modified:{' '}
          {formatDate(item.modified_date_live)}
        </Text>
        <View style={styles.buttonContainer}>
          {item.status === 1 ? (
            <TouchableOpacity
              style={styles.recordingButton}
              onPress={() =>
                console.log('Watch Recording:', item.live_class_recording_url)
              }>
              <Text style={styles.buttonText}>Watch Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => console.log('Join Class:', item.room_name)}>
              <Text style={styles.buttonText}>Join Class</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here..."
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
          <Icon name="filter-list" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* FlatList to display classes */}
      <FlatList
        data={classes}
        keyExtractor={item => item.schedule_live_class_id.toString()}
        renderItem={renderClassItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for calendar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Calendar
              current={selectedDate || new Date().toISOString().split('T')[0]}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: color.darkPrimary,
                  selectedTextColor: 'white',
                },
              }}
              onDayPress={handleDateSelect}
              monthFormat={'yyyy MM'}
              style={styles.calendar}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    width: '80%',
    color: '#333',
  },
  filterButton: {
    backgroundColor: color.darkPrimary,
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: color.darkPrimary,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  schedule: {
    fontSize: 12,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  calendar: {
    width: '100%',
    height: 300,
  },
  modalButton: {
    backgroundColor: color.darkPrimary,
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  listContent: {
    paddingBottom: 20,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  classDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  classTime: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    backgroundColor: color.darkPrimary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  recordingButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
