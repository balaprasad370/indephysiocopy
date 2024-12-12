import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from '../../theme/AppContext';
import axios from 'axios';
import storage from '../../Constants/storage';
import {ROUTES} from '../../Constants/routes';
import {useNavigation} from '@react-navigation/native';

const StudentAccess = () => {
  const [allStudents, setAllStudents] = useState([]); // Store all students
  const [filteredStudents, setFilteredStudents] = useState([]); // Store filtered results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {path} = useContext(AppContext);
  const [disableButton, setDisableButton] = useState(false);
  const [studentId, setStudentId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gender: 'all',
    ageRange: null,
    germanLevel: 'all',
    qualification: 'all',
    status: 'all',
  });

  // Fetch all students
  const fetchAllStudents = async () => {
    const token = await storage.getStringAsync('token');
    try {
      setLoading(true);
      const response = await axios.get(`${path}/api/v1/students`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAllStudents(response.data.students);
        setFilteredStudents(response.data.students); // Initially show all students
      }
    } catch (error) {
      setError('Failed to fetch students');
      // console.log('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of all students
  useEffect(() => {
    fetchAllStudents();
  }, []);

  // Apply filters locally
  const applyFilters = () => {
    let result = [...allStudents];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(student => {
        const fullName =
          `${student.first_name} ${student.last_name}`.toLowerCase();
        const username = (student.username || '').toLowerCase();
        const city = (student.city || '').toLowerCase();
        const state = (student.state || '').toLowerCase();

        return (
          fullName.includes(query) ||
          username.includes(query) ||
          city.includes(query) ||
          state.includes(query) ||
          String(student.age).includes(query) ||
          (student.gender || '').toLowerCase().includes(query)
        );
      });
    }

    // Apply gender filter
    if (filters.gender !== 'all') {
      result = result.filter(student => student.gender === filters.gender);
    }

    // Apply age range filter
    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange;
      result = result.filter(
        student => student.age >= minAge && student.age <= maxAge,
      );
    }

    // Apply German level filter
    if (filters.germanLevel !== 'all') {
      result = result.filter(student => student.level === filters.germanLevel);
    }

    // Apply qualification filter
    if (filters.qualification !== 'all') {
      result = result.filter(
        student => student.highest_qualification === filters.qualification,
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(
        student => student.document_status === filters.status,
      );
    }

    setFilteredStudents(result);
  };


  const getNewToken = async (student_id) => {
    const token = await storage.getStringAsync('token');

      const response = await axios.post(`${path}/v1/grantaccess`,{
        student_id: student_id,
      },  { headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // console.log("response",response.data);
  if(response.data.status){
    return response.data.token

  }else{
    return null;
  }
 }

  const navigation = useNavigation();

  const toggleAccess = async student_id => {
    try {
      setDisableButton(true);
      setStudentId(student_id);
      const newToken = await getNewToken(student_id);

      // Save the new token in storage
      await storage.setStringAsync('token', newToken);
      await storage.setStringAsync('isAdmin', 'true');

      // console.log("newToken",newToken);
      
      setTimeout(() => {
        navigation.navigate(ROUTES.DASHBOARD);
        setDisableButton(false);
      }, 1000);
      // Optionally, log the success
      // console.log('New token has been set:', newToken);
    } catch (error) {
      // console.log('Error while setting the token:', error);
    }
  };

  // Handle search and filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      applyFilters();
    }, 300); // Debounce for better performance

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, allStudents]);

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const renderItem = ({item}) => (
   
    <View style={styles.studentItem}>
      <View style={styles.leftContainer}>
        <Image
          source={
            item.profile_pic
              ? {
                  uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.profile_pic}`,
                }
              : {uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
          }
          style={styles.profilePic}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.name}>
            {item.first_name + " " + item.last_name}
          </Text>
        </View>
      </View>
      <TouchableOpacity
      disabled={disableButton}
        style={[styles.accessButton, {backgroundColor: disableButton && studentId === item.student_id ? '#ccc' : '#4CAF50'}]}
        onPress={() => toggleAccess(item.student_id)}>
        <Text style={styles.accessButtonText}>{disableButton && studentId === item.student_id ? 'Loading...' : 'Grant Access'}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        keyExtractor={item => item.student_id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No students found</Text>
        }
      />
    </View>
  );
};

export default StudentAccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 16,
  },
  studentItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  accessButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  accessButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
