// import {
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useContext, useEffect, useState} from 'react';
// import SearchComponent from '../../Components/SearchComponent/Index';
// import {AppContext} from '../../theme/AppContext';
// import DarkTheme from '../../theme/Darktheme';
// import LighTheme from '../../theme/LighTheme';
// import color from '../../Constants/color';
// import QuizCard from '../../Components/QuizCard/Index';
// import ReadingMaterial from '../../Components/ReadingMaterial/Index';
// import {ROUTES} from '../../Constants/routes';
// import axios from 'axios';
// import storage from '../../Constants/storage';
// const Index = ({route}) => {
//   const {parent_module_id} = route.params;
//   const {isDark, setIsDark, path, clientId} = useContext(AppContext);

//   const style = isDark ? DarkTheme : LighTheme;

//   const [assessments, setAssessments] = useState();
//   const [readingMaterials, setReadingMaterials] = useState([]);

//   const getAssessments = async () => {
//     try {
//       const token = await storage.getStringAsync('token');

//       if (token) {
//         const response = await axios.get(`http://${path}:4000/assessments/0`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setAssessments(response.data[0]);
//       } else {
//         console.error('No token found');
//       }
//     } catch (err) {
//       console.error('Error fetching assessments:', err);
//     }
//   };

//   const [flashCard, setFlashCard] = useState();

//   const getFlashCard = async () => {
//     try {
//       const token = await storage.getStringAsync('token');

//       if (token) {
//         const response = await axios.get(
//           `http://${path}:4000/flashcard/${parent_module_id}`,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );
//         // Extract the relevant data from the response
//         const materials = response.data.map(item => ({
//           flash_id: item.flash_id,
//           title: item.flashcard_name,
//           description: item.flashcard_description,
//         }));

//         // console.log(response.data);
//         setFlashCard(materials);
//       } else {
//         console.error('No token found');
//       }
//     } catch (err) {
//       console.error('Error fetching flashcard:', err);
//     }
//   };

//   const [modules, setModules] = useState();

//   const getModules = async () => {
//     const token = await storage.getStringAsync('token');
//     if (token) {
//       try {
//         const response = await axios.get(`http://${path}:4000/modules`, {
//           params: {
//             client_id: clientId,
//             module_id: parent_module_id,
//           },
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const materials = response.data.data.map(item => ({
//           module_id: item.id,
//           title: item.name,
//           description: item.description,
//         }));
//         setModules(materials);
//       } catch (error) {
//         console.log('Error fetching data from modules', error.message);
//       }
//     }
//   };

//   const readingMaterial = async () => {
//     const token = await storage.getStringAsync('token');
//     if (token) {
//       try {
//         const response = await axios.get(
//           // `http://${path}:4000/reading/44`,
//           `http://${path}:4000/reading/${parent_module_id}`,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: 'Bearer ' + token,
//             },
//           },
//         );

//         // Extract the relevant data from the response
//         const materials = response.data.map(item => ({
//           read_id: item.read_id,
//           title: item.title,
//           description: item.description,
//         }));

//         // Store the extracted data in the state
//         setReadingMaterials(materials);
//       } catch (error) {
//         console.log('Error from reading material:', error);
//       }
//     }
//   };

//   useEffect(() => {
//     getModules();
//     readingMaterial();
//   }, []);

//   useEffect(() => {
//     getFlashCard();
//     getAssessments();
//   }, []);

//   return (
//     <ScrollView style={style.selfLearn} showsVerticalScrollIndicator={false}>
//       <View style={{}}></View>
//       <View style={styles.quizzes}>
//         <QuizCard
//           Title={`${assessments?.title}`}
//           secondOption={`${assessments?.description}`}
//           optionClick="Assessement"
//         />
//         {readingMaterials.map(material => (
//           <QuizCard
//             key={material.read_id}
//             Title={material.title}
//             secondOption="Articles"
//             parent_module_id={parent_module_id}
//             optionClick="Reading Material"
//             unique_id={material.read_id}
//           />
//         ))}
//         {flashCard &&
//           flashCard.map(material => (
//             <QuizCard
//               key={material.flash_id}
//               Title={`${material.title}`}
//               parent_module_id={parent_module_id}
//               secondOption={`${material.description}`}
//               optionClick="Flash Card"
//               unique_id={material.flash_id}
//             />
//           ))}
//         {modules &&
//           modules.map(material => (
//             <QuizCard
//               key={material.module_id}
//               Title={`${material.title}`}
//               parent_module_id={parent_module_id}
//               secondOption={`${material.description}`}
//               optionClick="Quiz"
//               unique_id={material.module_id}
//             />
//           ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   button: {
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   buttonClose: {
//     backgroundColor: '#2196F3',
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     width: 200,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   quizzes: {
//     display: 'flex',
//   },
//   quizsText: {
//     fontSize: 24,
//     color: color.black,
//     fontWeight: '500',
//   },
// });

// const data = [
//   {
//     chapter_id: 14,
//     client_id: 8,
//     flash_created_date: '2024-08-08T00:56:10.000Z',
//     flash_id: 8,
//     flash_modified_date: '2024-08-08T00:56:10.000Z',
//     flashcard_description: 'Greetings and Farewell',
//     flashcard_name: 'Introduction',
//     order_id: 2,
//   },
//   {
//     chapter_id: 14,
//     client_id: 8,
//     flash_created_date: '2024-08-08T00:56:57.000Z',
//     flash_id: 10,
//     flash_modified_date: '2024-08-08T00:56:57.000Z',
//     flashcard_description: 'short self inroduction',
//     flashcard_name: 'Introduction',
//     order_id: 4,
//   },
//   {
//     chapter_id: 14,
//     client_id: 8,
//     flash_created_date: '2024-08-08T00:56:58.000Z',
//     flash_id: 11,
//     flash_modified_date: '2024-08-08T00:56:58.000Z',
//     flashcard_description: "names of countries and it's citizens",
//     flashcard_name: 'Countries',
//     order_id: 7,
//   },
//   {
//     chapter_id: 14,
//     client_id: 8,
//     flash_created_date: '2024-08-08T00:56:59.000Z',
//     flash_id: 12,
//     flash_modified_date: '2024-08-08T00:56:59.000Z',
//     flashcard_description: 'Flashcard description',
//     flashcard_name: 'Flashcard title',
//     order_id: 10,
//   },
//   {
//     chapter_id: 14,
//     client_id: 8,
//     flash_created_date: '2024-08-17T09:26:54.000Z',
//     flash_id: 15,
//     flash_modified_date: '2024-08-17T09:26:54.000Z',
//     flashcard_description: 'Flashcard description',
//     flashcard_name: 'Flashcard title',
//     order_id: 22,
//   },
// ];
import {
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import SearchComponent from '../../Components/SearchComponent/Index';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import color from '../../Constants/color';
import QuizCard from '../../Components/QuizCard/Index';
import ReadingMaterial from '../../Components/ReadingMaterial/Index';
import {ROUTES} from '../../Constants/routes';
import axios from 'axios';
import storage from '../../Constants/storage';

const Index = ({route}) => {
  const {parent_module_id} = route.params;
  const {isDark, setIsDark, path, clientId, userData} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const [assessments, setAssessments] = useState();
  const [readingMaterials, setReadingMaterials] = useState([]);
  const [flashCard, setFlashCard] = useState();
  const [modules, setModules] = useState();

  const getAssessments = async () => {
    try {
      const token = await storage.getStringAsync('token');
      if (token) {
        const response = await axios.get(`http://${path}:4000/assessments/0`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setAssessments(response.data[0]);
      } else {
        console.error('No token found');
      }
    } catch (err) {
      console.error('Error fetching assessments:', err);
    }
  };

  const getFlashCard = async () => {
    try {
      const token = await storage.getStringAsync('token');
      if (token) {
        const response = await axios.get(
          `http://${path}:4000/flashcard/${parent_module_id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(response.data);
        const materials = response.data.map(item => ({
          flash_id: item.flash_id,
          title: item.flashcard_name,
          description: item.flashcard_description,
        }));
        setFlashCard(materials);
      } else {
        console.error('No token found');
      }
    } catch (err) {
      console.error('Error fetching flashcard:', err);
    }
  };

  const getModules = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(`http://${path}:4000/modules`, {
          params: {
            client_id: clientId,
            module_id: parent_module_id,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const materials = response.data.data.map(item => ({
          module_id: item.id,
          title: item.name,
          description: item.description,
        }));
        setModules(materials);
      } catch (error) {
        console.log('Error fetching data from modules', error.message);
      }
    }
  };

  const readingMaterial = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(
          `http://${path}:4000/reading/${parent_module_id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );

        const materials = response.data.map(item => ({
          read_id: item.read_id,
          title: item.title,
          description: item.description,
        }));
        setReadingMaterials(materials);
      } catch (error) {
        console.log('Error from reading material:', error);
      }
    }
  };

  const student_id = userData?.student_id;

  useEffect(() => {
    getModules();
    readingMaterial();
  }, []);

  useEffect(() => {
    getFlashCard();
    getAssessments();
  }, []);

  const renderItem = ({item}) => (
    <QuizCard
      Title={item.title}
      secondOption={item.description || 'Articles'}
      parent_module_id={parent_module_id}
      optionClick={
        item.read_id
          ? 'Reading Material'
          : item.flash_id
          ? 'Flash Card'
          : 'Quiz'
      }
      unique_id={item.read_id || item.flash_id || item.module_id}
    />
  );
  const combinedData = [
    ...(readingMaterials ?? []), // Provide an empty array if undefined
    ...(flashCard ?? []), // Provide an empty array if undefined
    ...(modules ?? []), // Provide an empty array if undefined
  ];

  return (
    <FlatList
      data={combinedData}
      renderItem={renderItem}
      keyExtractor={item => item.unique_id}
      style={style.selfLearn}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  quizzes: {
    display: 'flex',
  },
  quizsText: {
    fontSize: 24,
    color: color.black,
    fontWeight: '500',
  },
});
