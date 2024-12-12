import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import color from '../../Constants/color';
import storage from '../../Constants/storage';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';

const JumbledSentence = ({
  matchData,
  item,
  setScore,
  score,
  combinedData,
  setCombinedData,
  setAnswerData,
}) => {
  const {path} = useContext(AppContext);
  const matchQuestionSingle = item.matchQuestionSingle
    .split(',')
    .map(id => id.trim());
  const matchAnswerSingle = item.matchAnswerSingle
    .split(',')
    .map(id => id.trim());

  useEffect(() => {
    if (combinedData.length === 0) {
      jumbledSentenceFunction();
    }
  }, [matchData, item]);

  const jumbledSentenceFunction = async () => {
    const token = await storage.getStringAsync('token');

    try {
      const response = await axios.post(
        `${path}/admin/v4/jumbledSentence`,
        {
          matchData: matchData,
          item: item,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCombinedData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkForCorrectAnswers = updatedData => {
    let allCorrect = false;

    const result = updatedData.map((item, index) => {
      const correctAnswer = matchData.find(
        match => match.match_id == matchAnswerSingle[index],
      )?.match_data;

      return {question: item.questionMatch, answer: correctAnswer};
    });

    const isCorrect = result.every(item => item.question === item.answer);
    if (isCorrect) {
      allCorrect = true;
    }
    return isCorrect;
  };
  const handleDragEnd = ({data}) => {
    const updatedData = data.map((item, index) => ({
      ...item,
      answerMatch: combinedData[index].answerMatch,
    }));
    setCombinedData(updatedData);

    const isCorrect = checkForCorrectAnswers(updatedData);
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
      <View style={styles.matchContainer}>
        <View style={styles.inlineContainer}>
            <DraggableFlatList
            data={combinedData}
            renderItem={({item, drag}) => (
              <TouchableOpacity onPress={drag} style={styles.rightContainer}>
                <Text style={styles.matchText}>{item.questionMatch}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.questionId}
            onDragEnd={({data}) => handleDragEnd({data})}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default JumbledSentence;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  matchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
  },
  inlineContainer: {
    width: '99%',
    marginBottom: 10,
  },
  leftContainer: {
    marginRight: 5,
    height: 60,
    marginBottom: 5,
    borderWidth: 1,
    padding: 5,
  },
  rightContainer: {
    marginLeft: 5,
    marginBottom: 5,
    borderWidth: 1,
    padding: 5,
    height: 60,
  },
  matchText: {
    fontSize: 18,
    color: color.black,
  },
});
