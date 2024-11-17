// import React, {useEffect, useState, useContext} from 'react';
// import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient'; // Add linear gradient
// import storage from '../../Constants/storage';
// import axios from 'axios';
// import {AppContext} from '../../theme/AppContext';
// import Icon from 'react-native-vector-icons/FontAwesome'; // For Trophy Icons
// import color from '../../Constants/color';

// const LeaderboardScreen = ({route}) => {
//   const {module_id} = route.params;
//   const {path, student_id} = useContext(AppContext);
// const [students, setStudents] = useState([]);

// useEffect(() => {
//   const fetchMarks = async () => {
//     const token = await storage.getStringAsync('token');
//     try {
//       const response = await axios.get(`${path}/student/leaderboard`, {
//         params: {module_id},
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + token,
//         },
//       });
//       console.log('result', response.data);
//       setStudents(response.data);
//     } catch (error) {
//       console.log('Error fetching marks:', error);
//     }
//   };

//   fetchMarks();
// }, [module_id]);

//   // Mock data for top 3 students
//   const mockData = [
//     {id: '1', name: 'Harmandeep Singh', marks: 9, avatar: '👩‍🎓'},
//     {id: '2', name: 'Krishna Murtthy', marks: 8, avatar: '👨‍🎓'},
//     {id: '3', name: 'Craig Gouse', marks: 7, avatar: '🧑‍🎓'},
//     {id: '4', name: 'Madeline Stone', marks: 2, avatar: '👩‍🎓'},
//     {id: '5', name: 'Andrew Mills', marks: 1, avatar: '👨‍🎓'},
//   ];

//   const renderStudent = ({item, index}) => (
//     <View style={styles.studentRow} key={index}>
//       <Text style={styles.rank}>{index + 1}</Text>
//       <Text style={styles.studentName}>{item.name}</Text>
//       <Text style={styles.marks}>{item.marks} Marks</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Top 3 Section */}
//       <LinearGradient
//         colors={[
//           color.darkPrimary,
//           color.darkPrimary,
//           color.lightPrimary,
//           color.darkPrimary,
//           color.darkPrimary,
//         ]}
//         style={styles.gradient}>
//         <View style={styles.top3Container}>
//           {/* 2nd Place */}
//           <View style={[styles.pillar]}>
//             <Icon
//               name="trophy"
//               size={40}
//               color={`${color.lightPrimary}`}
//               style={styles.trophyIcon}
//             />
//             <Text style={styles.name}>{mockData[1].name}</Text>
//             <Text style={styles.pillarRank}>2nd</Text>
//             <Text style={styles.marks}>{mockData[1].marks} Marks</Text>
//           </View>
//           {/* 1st Place (center and larger) */}
//           <View style={[styles.pillar, styles.firstPillar]}>
//             <Icon
//               name="trophy"
//               size={50}
//               color={`${color.darkPrimary}`}
//               style={styles.trophyIcon}
//             />
//             <Text style={styles.name}>{mockData[0].name}</Text>
//             <Text style={styles.pillarRank}>1st</Text>
//             <Text style={styles.marks}>{mockData[0].marks} Marks</Text>
//           </View>
//           {/* 3rd Place */}
//           <View style={styles.pillar}>
//             <Icon
//               name="trophy"
//               size={40}
//               color={`${color.lightPrimary}`}
//               style={styles.trophyIcon}
//             />
//             <Text style={styles.name}>{mockData[2].name}</Text>
//             <Text style={styles.pillarRank}>3rd</Text>
//             <Text style={styles.marks}>{mockData[2].marks} Marks</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       {/* Remaining Students */}
//       <FlatList
//         data={mockData.slice(3)} // Skip top 3
//         renderItem={renderStudent}
//         // keyExtractor={item => item.id}
//         contentContainerStyle={styles.flatListContent}
//       />
//     </View>
//   );
// };

// export default LeaderboardScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
//   gradient: {
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   top3Container: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'flex-end',
//   },
//   pillar: {
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 15,
//     width: '38%',
//     height: 160,
//     marginHorizontal: 10,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: {width: 0, height: 4},
//     shadowRadius: 10,
//   },
//   firstPillar: {
//     zIndex: 999,
//     height: 200,
//   },
//   trophyIcon: {
//     marginBottom: 10,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },
//   pillarRank: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#3C5D87',
//     marginVertical: 5,
//   },
//   marks: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#3C5D87',
//   },
//   studentRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 10,
//     elevation: 2,
//     marginVertical: 5,
//     marginHorizontal: 20,
//   },
//   rank: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   studentName: {
//     fontSize: 16,
//     color: '#3D3D3D',
//   },
//   flatListContent: {
//     paddingVertical: 20,
//   },
// });

import React, {useState, useEffect, useContext} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';

const LeaderboardScreen = ({route}) => {
  const {module_id} = route.params;
  const {path} = useContext(AppContext);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = await storage.getStringAsync('token');
      try {
        const response = await axios.get(`${path}/student/leaderboard`, {
          params: {module_id},
          headers: {Authorization: `Bearer ${token}`},
        });
        setStudents(response.data.result);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, [module_id]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#FF9800', '#FF5722']} style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Module: {module_id}</Text>
      </LinearGradient>

      {/* Top 3 Achievers */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.topThreeContainer}>
        {students.slice(0, 3).map((student, index) => (
          <View
            key={student.id}
            style={[styles.achieverCard, index === 0 && styles.firstPlaceCard]}>
            <Icon
              name="crown"
              size={index === 0 ? 50 : 40}
              color={index === 0 ? '#FFD700' : '#CD7F32'}
              style={styles.rankIcon}
            />
            <Text style={styles.achieverName}>
              {student.first_name} {student.last_name}
            </Text>
            <Text style={styles.achieverScore}>{student.marks} Points</Text>
            <Text style={styles.rankText}>
              {['1st', '2nd', '3rd'][index]} Place
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Full List */}
      <FlatList
        data={students.slice(3)}
        renderItem={({item, index}) => (
          <View style={styles.participantCard}>
            <View style={styles.rankCircle}>
              <Text style={styles.rankText}>{index + 4}</Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>
                {item.first_name} {item.last_name}
              </Text>
              <Text style={styles.participantScore}>{item.marks} Points</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    color: '#FFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  topThreeContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  achieverCard: {
    width: 150,
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 4,
  },
  firstPlaceCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
    transform: [{scale: 1.1}],
  },
  rankIcon: {
    marginBottom: 10,
  },
  achieverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  achieverScore: {
    fontSize: 14,
    color: '#FF9800',
  },
  rankText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  participantCard: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
  },
  rankCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantInfo: {
    marginLeft: 15,
  },
  rankText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  participantScore: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
});
