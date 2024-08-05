import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import SearchComponent from '../../Components/SearchComponent/Index';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import color from '../../Constants/color';
import QuizCard from '../../Components/QuizCard/Index';
import ReadingMaterial from '../../Components/ReadingMaterial/Index';
import {ROUTES} from '../../Constants/routes';
const Index = () => {
  const appContext = useContext(AppContext);

  const {isDark, setIsDark} = appContext;

  const style = isDark ? DarkTheme : LighTheme;
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
      <SearchComponent />
      <View style={{marginTop: 20}}>
        <Text style={style.selfHeading}>Welcome back</Text>
        <Text style={style.selfChapter}>Chapter 1</Text>
      </View>
      <View style={styles.quizzes}>
        <QuizCard
          Title="Assessment"
          secondOption="Day 1"
          cardURL={Assessement}
          optionClick="Assessement"
        />
        <QuizCard
          Title="Reading Material"
          secondOption="Articles"
          cardURL={ReadingMaterial}
          optionClick="Reading"
        />
        <QuizCard
          Title="Assessment"
          secondOption="Day 1"
          cardURL={Assessement}
          optionClick="Assessement"
        />
        <QuizCard
          Title="Assessment"
          secondOption="Day 1"
          cardURL={Assessement}
          optionClick="Assessement"
        />
        <QuizCard
          Title="Flash Cards"
          secondOption="Day 1"
          cardURL={FlashCard}
          optionClick="Flash"
        />
        <QuizCard
          Title="Quiz"
          secondOption="Welcome"
          cardURL={Quiz}
          optionClick="Quiz"
        />
        <QuizCard
          Title="Live Class"
          secondOption="Biology class"
          optionClick="Live"
          cardURL={LiveClass}
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
    marginTop: 22,
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
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  quizsText: {
    fontSize: 24,
    color: color.black,
    fontWeight: '500',
  },
});
