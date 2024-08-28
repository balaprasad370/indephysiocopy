import {
  Modal,
  ScrollView,
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
const Index = ({route}) => {
  const {chapterId} = route.params;
  const {isDark, setIsDark, path} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const [assessments, setAssessments] = useState();

  const getAssessements = async () => {
    try {
      const response = await axios.get(
        `http://${path}:4000/assessments/${chapterId}`,
      );
      setAssessments(response.data[0]);
    } catch (err) {
      console.error('Error fetching assessments:', err);
    }
  };

  const [flashCard, setFlashCard] = useState();

  const getFlashCard = async () => {
    try {
      const response = await axios.get(
        `http://${path}:4000/flashcard/${chapterId}`,
      );
      setFlashCard(response.data[0]);
    } catch (err) {
      console.error('Error fetching assessments:', err);
    }
  };

  useEffect(() => {
    getFlashCard();
    getAssessements();
  }, []);

  const Assessement =
    'https://img.freepik.com/free-vector/abstract-illustration-person-giving-feedback_52683-62410.jpg?t=st=1722599417~exp=1722603017~hmac=dcc7e1649302b8178155bbbe8c04a5cf43da13e9d9470b98fb43a09f6c397684&w=1060';
  const ReadingMaterial =
    'https://img.freepik.com/free-vector/study-abroad-concept-illustration_114360-7493.jpg?t=st=1722599457~exp=1722603057~hmac=2d6dd329b37fbf60aa493996fa246319e338bfa78c7fa0ef4904e14618b16b9f&w=1060';
  const FlashCard =
    'https://img.freepik.com/free-vector/modern-people-doing-cultural-activities_52683-42186.jpg?t=st=1722600084~exp=1722603684~hmac=9016ecac5129dd8efd2d5ea46eaf1140ee6241653fd3a0c67ea48d7bd77b4416&w=1800';
  const Quiz =
    'https://img.freepik.com/free-vector/flat-people-asking-questions-illustration_23-2148910626.jpg?t=st=1722600164~exp=1722603764~hmac=f25b5570b545fad7e80c593baa8bfe417a87cb2fe7e9828b26272589cf2551c5&w=1060';
  const LiveClass =
    'https://img.freepik.com/free-vector/webinar-concept-illustration_114360-4764.jpg?t=st=1722600187~exp=1722603787~hmac=49c8a2fca946a7539814bad7ce28e02bf4eda92df68525a46b6565e4c808f0ee&w=1800';
  return (
    <ScrollView style={style.selfLearn}>
      <View style={{}}>
        {/* <Text style={style.selfChapter}>Chapter Id - {chapterId}</Text> */}
      </View>
      <View style={styles.quizzes}>
        <QuizCard
          Title={`${assessments?.title}`}
          // Title="Assessment"
          secondOption={`${assessments?.description}`}
          cardURL={Assessement}
          optionClick="Assessement"
        />
        <QuizCard
          Title="Reading Material"
          secondOption="Articles"
          chapterId={chapterId}
          cardURL={ReadingMaterial}
          optionClick="Reading Material"
        />
        <QuizCard
          Title={`${flashCard?.flashcard_name}`}
          // Title="Flash Cards"
          chapterId={chapterId}
          secondOption={`${flashCard?.flashcard_description}`}
          // secondOption="Day 1"
          cardURL={FlashCard}
          optionClick="Flash Card"
        />
        <QuizCard
          Title="Quiz"
          secondOption="Welcome"
          cardURL={Quiz}
          optionClick="Quiz"
        />
      </View>
    </ScrollView>
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
