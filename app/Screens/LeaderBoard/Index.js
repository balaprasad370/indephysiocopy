import React, {useEffect, useState, useContext} from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Add linear gradient
import storage from '../../Constants/storage';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import Icon from 'react-native-vector-icons/FontAwesome'; // For Trophy Icons
import color from '../../Constants/color';

const LeaderboardScreen = ({route}) => {
  const {module_id} = route.params;
  const {path, student_id} = useContext(AppContext);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      const token = await storage.getStringAsync('token');
      try {
        const response = await axios.get(`${path}/student/leaderboard`, {
          params: {module_id},
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    };

    fetchMarks();
  }, [module_id]);

  // Mock data for top 3 students
  const mockData = [
    {id: '1', name: 'Harmandeep Singh', marks: 9, avatar: '👩‍🎓'},
    {id: '2', name: 'Krishna Murtthy', marks: 8, avatar: '👨‍🎓'},
    {id: '3', name: 'Craig Gouse', marks: 7, avatar: '🧑‍🎓'},
    {id: '4', name: 'Madeline Stone', marks: 2, avatar: '👩‍🎓'},
    {id: '5', name: 'Andrew Mills', marks: 1, avatar: '👨‍🎓'},
  ];

  const renderStudent = ({item, index}) => (
    <View style={styles.studentRow}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.studentName}>{item.name}</Text>
      <Text style={styles.marks}>{item.marks} Marks</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top 3 Section */}
      <LinearGradient
        colors={[
          color.darkPrimary,
          color.darkPrimary,
          color.lightPrimary,
          color.darkPrimary,
          color.darkPrimary,
        ]}
        style={styles.gradient}>
        <View style={styles.top3Container}>
          {/* 2nd Place */}
          <View style={[styles.pillar]}>
            <Icon
              name="trophy"
              size={40}
              color={`${color.lightPrimary}`}
              style={styles.trophyIcon}
            />
            <Text style={styles.name}>{mockData[1].name}</Text>
            <Text style={styles.pillarRank}>2nd</Text>
            <Text style={styles.marks}>{mockData[1].marks} Marks</Text>
          </View>
          {/* 1st Place (center and larger) */}
          <View style={[styles.pillar, styles.firstPillar]}>
            <Icon
              name="trophy"
              size={50}
              color={`${color.darkPrimary}`}
              style={styles.trophyIcon}
            />
            <Text style={styles.name}>{mockData[0].name}</Text>
            <Text style={styles.pillarRank}>1st</Text>
            <Text style={styles.marks}>{mockData[0].marks} Marks</Text>
          </View>
          {/* 3rd Place */}
          <View style={styles.pillar}>
            <Icon
              name="trophy"
              size={40}
              color={`${color.lightPrimary}`}
              style={styles.trophyIcon}
            />
            <Text style={styles.name}>{mockData[2].name}</Text>
            <Text style={styles.pillarRank}>3rd</Text>
            <Text style={styles.marks}>{mockData[2].marks} Marks</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Remaining Students */}
      <FlatList
        data={mockData.slice(3)} // Skip top 3
        renderItem={renderStudent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  gradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  top3Container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  pillar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '38%',
    height: 160,
    marginHorizontal: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
  },
  firstPillar: {
    zIndex: 999,
    height: 200,
  },
  trophyIcon: {
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  pillarRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C5D87',
    marginVertical: 5,
  },
  marks: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C5D87',
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentName: {
    fontSize: 16,
    color: '#3D3D3D',
  },
  flatListContent: {
    paddingVertical: 20,
  },
});
