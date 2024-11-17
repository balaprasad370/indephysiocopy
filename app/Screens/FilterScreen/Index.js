import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Install react-native-vector-icons if not already done.
import color from '../../Constants/color';
import BigCalendar from 'react-native-big-calendar'; // Try default import here.

const Index = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSearch = () => {
    console.log('Search initiated with:', searchText);
  };

  const handleFilter = () => {
    setIsModalVisible(true); // Show calendar when filter button is clicked
  };

  const handleDateSelect = date => {
    setSelectedDate(date);
    setIsModalVisible(false); // Close the calendar after date selection
    console.log('Selected Date:', date);
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the calendar if cancel is pressed
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

      {/* Modal for calendar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <BigCalendar
              onDayPress={handleDateSelect}
              selectedDate={selectedDate}
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
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    height: 300, // Adjust the height as per requirement
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
});
