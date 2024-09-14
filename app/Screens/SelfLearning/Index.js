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
  const {isDark, setIsDark, path, clientId, userData, student_id} =
    useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const [assessments, setAssessments] = useState();
  const [readingMaterials, setReadingMaterials] = useState([]);
  const [flashCard, setFlashCard] = useState();
  const [modules, setModules] = useState();

  const getAssessments = async () => {
    try {
      const token = await storage.getStringAsync('token');
      if (token) {
        const response = await axios.get(`${path}/assessments/0`, {
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
          `${path}/flashcard/${parent_module_id}`,
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
        const response = await axios.get(`${path}/modules`, {
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
          `${path}/reading/${parent_module_id}`,
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
      style={style.selfLearnChapter}
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
