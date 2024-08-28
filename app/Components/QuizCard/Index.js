// import {
//   Image,
//   TouchableOpacity,
//   View,
//   Text,
//   StyleSheet,
//   Modal,
// } from 'react-native';
// import React, {useState} from 'react';
// import {useNavigation} from '@react-navigation/native';
// import {ROUTES} from '../../Constants/routes';
// import CustomModal from './QuizModal';
// import color from '../../Constants/color';

// const Index = ({Title, secondOption, cardURL, optionClick, chapterId}) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const navigation = useNavigation();

//   const toggleModal = option => {
//     if (option === 'Quiz') {
//       setModalVisible(!modalVisible);
//     } else if (option === 'Reading') {
//       navigation.navigate(ROUTES.READING, {chapterId: chapterId});
//     } else if (option === 'Live') {
//       navigation.navigate('Meeting', {room: 'checkpaaras'});
//     } else if (option === 'Flash') {
//       navigation.navigate(ROUTES.FLASH, {chapterId: chapterId});
//     }
//   };

//   return (
//     <View style={styles.quizs}>
//       <TouchableOpacity
//         style={styles.quizBox}
//         onPress={() => toggleModal(optionClick)}>
//         <Image
//           style={styles.quizImage}
//           source={{uri: cardURL}}
//           resizeMode="cover"
//         />
//         <View style={styles.textContainer}>
//           <Text style={styles.quizTitle}>{Title}</Text>
//           <Text style={styles.quizSubtitle}>{secondOption}</Text>
//         </View>
//       </TouchableOpacity>

//       <CustomModal
//         modalVisible={modalVisible}
//         setModalVisible={setModalVisible}
//         toggleModal={toggleModal}
//       />
//     </View>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   quizs: {
//     flex: 1,
//     marginVertical: 8,
//   },
//   quizBox: {
//     width: '100%',
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#AAA',
//     backgroundColor: '#FFF',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 6,
//   },
//   quizImage: {
//     width: '100%',
//     height: 140,
//   },
//   textContainer: {
//     padding: 16,
//     backgroundColor: color.lightPrimary,
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//   },
//   quizTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textTransform: 'uppercase',
//     color: color.black,
//     marginBottom: 4,
//   },
//   quizSubtitle: {
//     fontSize: 14,
//     color: color.black,
//   },
// });
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import CustomModal from './QuizModal';
import color from '../../Constants/color';

const Index = ({Title, secondOption, cardURL, optionClick, chapterId}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const toggleModal = option => {
    if (option === 'Quiz') {
      setModalVisible(!modalVisible);
    } else if (option === 'Reading Material') {
      navigation.navigate(ROUTES.READING, {chapterId: chapterId});
    } else if (option === 'Live') {
      navigation.navigate('Meeting', {room: 'checkpaaras'});
    } else if (option === 'Flash Card') {
      navigation.navigate(ROUTES.FLASH, {chapterId: chapterId});
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.cardBox}
        onPress={() => toggleModal(optionClick)}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{optionClick}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{Title}</Text>
          <Text style={styles.cardSubtitle}>{secondOption}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.timeText}>10 - 11 AM</Text>
            <Text style={styles.personText}>4 Persons</Text>
          </View>
        </View>
      </TouchableOpacity>

      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        toggleModal={toggleModal}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  cardBox: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1f4f8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // elevation: 6,
  },
  statusContainer: {
    backgroundColor: color.lowPrimary,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  statusText: {
    color: color.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  textContainer: {
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#999999',
  },
  personText: {
    fontSize: 12,
    color: '#999999',
  },
});
