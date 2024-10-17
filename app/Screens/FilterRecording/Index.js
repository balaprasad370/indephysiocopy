import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-ui-datepicker';
import {ROUTES} from '../../Constants/routes';

// Custom Dropdown Component
const CustomDropdown = ({data, onSelect, title, selectedItem}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = item => {
    onSelect(item);
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        onPress={() => setIsDropdownOpen(prev => !prev)}
        style={styles.dropdownButton}>
        <Text style={styles.dropdownText}>
          {selectedItem
            ? selectedItem.level_name || selectedItem.name
            : `Select ${title}`}
        </Text>
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownListContainer}>
          <ScrollView nestedScrollEnabled={true} style={styles.dropdownList}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(item)}
                style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>
                  {item.level_name || item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const App = () => {
  const navigation = useNavigation();
  const {path, clientId} = useContext(AppContext);
  const [levels, setLevels] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loader, setLoader] = useState(false);
  const langId = 1;

  useEffect(() => {
    const fetchLevels = async () => {
      const token = await storage.getStringAsync('token');
      try {
        const response = await axios.get(`${path}/levels/${langId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        if (response.data.status) {
          setLevels(response.data.data);
        }
      } catch (error) {
        console.log('Error fetching levels:', error);
      }
    };

    fetchLevels();
  }, [path, langId]);

  const chapterData = async level_id => {
    const token = await storage.getStringAsync('token');
    if (token) {
      setLoader(true);
      try {
        const response = await axios.get(`${path}/chapters`, {
          params: {
            level_id: level_id,
            client_id: clientId,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setChapters(response.data);
      } catch (error) {
        console.log('Error fetching chapters:', error);
      } finally {
        setLoader(false);
      }
    }
  };

  const handleLevelSelect = level => {
    setSelectedLevel(level);
    setSelectedChapter(null);
    chapterData(level.level_id);
    setLiveClasses([]);
  };

  const handleChapterSelect = async chapter => {
    setSelectedChapter(chapter);
    await fetchLiveClasses(chapter.id, selectedDate);
  };

  const fetchLiveClasses = async (chapterId, date) => {
    try {
      const token = await storage.getStringAsync('token');
      const response = await axios.get(`${path}/live-classes/v1/filter`, {
        params: {chapter_id: chapterId, date},
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });

      if (response.data.success) {
        setLiveClasses(response.data.live_classes);
      } else {
        console.log('Error fetching live classes: ', response.data.message);
      }
    } catch (error) {
      console.log('Error fetching live classes:', error);
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    if (selectedChapter) {
      fetchLiveClasses(selectedChapter.id, date);
    }
  };

  const handleLiveClassPress = videoUrl => {
    navigation.navigate(ROUTES.RECORDING, {video_url: videoUrl});
  };

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Select Level</Text>
      <CustomDropdown
        data={levels}
        onSelect={handleLevelSelect}
        title="Level"
        selectedItem={selectedLevel}
      />
      {selectedLevel && (
        <>
          <Text style={styles.title}>Select Chapter</Text>
          <CustomDropdown
            data={chapters}
            onSelect={handleChapterSelect}
            title="Chapter"
            selectedItem={selectedChapter}
          />
          <Text style={styles.title}>Select Date</Text>
          <DatePicker
            mode="date"
            date={selectedDate}
            onDateChange={handleDateChange}
            style={styles.datePicker}
          />
        </>
      )}
      {loader && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
    </View>
  );

  const renderLiveClasses = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleLiveClassPress(item.live_class_recording_url)}
      style={styles.item}>
      <Text style={styles.classTitle}>{item.title_live || 'No Title'}</Text>
      <Text style={styles.classDescription}>
        {item.description_live || 'No Description'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={liveClasses}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <Text style={styles.noClassesText}>No live classes available.</Text>
      }
      renderItem={renderLiveClasses}
      keyExtractor={item =>
        item.live_class_id
          ? item.live_class_id.toString()
          : Math.random().toString()
      }
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true} // Enable nested scrolling for FlatList
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownListContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 999, // Ensure the dropdown appears on top of other components
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  datePicker: {
    marginVertical: 15,
  },
  loader: {
    marginVertical: 15,
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  classDescription: {
    fontSize: 14,
    color: '#555',
  },
  noClassesText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#999',
  },
});

export default App;
