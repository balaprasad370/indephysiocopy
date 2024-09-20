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

const Index = ({route, navigation}) => {
  const {parent_module_id} = route.params;
  const {isDark, setIsDark, path, clientId, userData} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const [assessments, setAssessments] = useState();
  const [readingMaterials, setReadingMaterials] = useState([]);
  const [flashCard, setFlashCard] = useState();
  const [modules, setModules] = useState();

  const [content, setContent] = useState([]);

  const {title} = route.params;

  useEffect(() => {
    navigation.setOptions({title});
  }, [title]);

  const getAllChapterContent = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const res = await axios({
        method: 'get',
        url: path + '/chapter/v1/admin/' + parent_module_id,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      setContent(res.data);
    } catch (error) {
      console.log('error', error.response);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllChapterContent();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item, index}) => (
    <QuizCard
      key={item.order_id}
      Title={item.flashcard_name || item.title || item.name || item.title_live}
      secondOption={
        item.flashcard_description || item.description || item.description_live
      }
      parent_module_id={parent_module_id}
      optionClick={
        item.read_id
          ? 'Reading Material'
          : item.flash_id
          ? 'Flash Card'
          : item.schedule_live_class_id
          ? 'Live class'
          : 'Quiz'
      }
      unique_id={item.read_id || item.flash_id || item.id}
      status={item.status}
      room_name={item.room_name}
    />
  );

  return (
    <>
      {content.length > 0 ? (
        <FlatList
          data={content}
          renderItem={renderItem}
          keyExtractor={item => item.order_id}
          style={style.selfLearnChapter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, fontWeight: '900'}}>
            There is no content
          </Text>
        </View>
      )}
    </>
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
