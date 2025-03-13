import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useFocusEffect} from '@react-navigation/native';

const RenderMatch = ({
  matchData,
  item,
  setScore,
  score,
  combinedData,
  setCombinedData,
}) => {
  const [matchQuestionLeftIds, setMatchQuestionLeftIds] = useState(
    item.matchQuestionLeft.split(',').map(id => id.trim()),
  );
  const [matchQuestionRightIds, setMatchQuestionRightIds] = useState(
    item.matchQuestionRight.split(',').map(id => id.trim()),
  );
  const [matchAnswerLeftIds, setMatchAnswerLeftIds] = useState(
    item.matchAnswerLeft.split(',').map(id => id.trim()),
  );
  const [matchAnswerRightIds, setMatchAnswerRightIds] = useState(
    item.matchAnswerRight.split(',').map(id => id.trim()),
  );

  const [answersLeft, setAnswersLeft] = useState([]);
  const [answersRight, setAnswersRight] = useState([]);
  const [dataLeftSide, setDataLeftSide] = useState([]);
  const [dataRightSide, setDataRightSide] = useState([]);
  const [AnswerForMatch, setAnswerForMatch] = useState(0);

  const matchFunction = async () => {
    const _leftData = [];
    const _rightData = [];

    for (const x of matchQuestionLeftIds) {
      for (const findElement of matchData) {
        if (findElement.match_id === x.trim()) {
          _leftData.push({
            leftData: findElement?.match_data.trim(),
            leftId: x,
          });
        }
      }
    }

    for (const x of matchQuestionRightIds) {
      for (const findElement of matchData) {
        if (findElement.match_id === x.trim()) {
          _rightData.push({
            rightData: findElement?.match_data.trim(),
            rightId: x,
          });
        }
      }
    }

    setDataLeftSide(_leftData);
    setDataRightSide(_rightData);

    const _leftDataAnswers = [];
    const _rightDataAnswers = [];

    for (const x of matchAnswerLeftIds) {
      for (const findElement of matchData) {
        if (findElement.match_id === x.trim()) {
          _leftDataAnswers.push({
            leftData: findElement?.match_data.trim(),
            leftId: x,
          });
        }
      }
    }

    for (const x of matchAnswerRightIds) {
      for (const findElement of matchData) {
        if (findElement.match_id === x.trim()) {
          _rightDataAnswers.push({
            rightData: findElement?.match_data.trim(),
            rightId: x,
          });
        }
      }
    }

    setAnswersLeft(_leftDataAnswers);
    setAnswersRight(_rightDataAnswers);
  };

  useEffect(() => {
    if (
      matchQuestionLeftIds.length > 0 &&
      matchQuestionRightIds.length > 0 &&
      matchData.length > 0
    ) {
      matchFunction();
    }
  }, [matchData, item]);

  useEffect(() => {
    if (!Array.isArray(dataLeftSide) || !Array.isArray(dataRightSide)) {
      console.error('Invalid data format for matching game.');
      return;
    }

    const answers = {};
    answersLeft.forEach((item, index) => {
      answers[item.leftData] = answersRight[index]?.rightData;
    });

    const userAnswers = {};
    dataLeftSide.forEach((item, index) => {
      userAnswers[item.leftData] = dataRightSide[index]?.rightData || null;
    });

    const allMatched = Object.keys(answers).every(
      key => answers[key] === userAnswers[key],
    );

    setAnswerForMatch(allMatched ? 1 : 0);
  }, [dataLeftSide, dataRightSide, answersLeft, answersRight]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setScore(prevScore => prevScore + AnswerForMatch);
        setAnswerForMatch(0);
      };
    }, [AnswerForMatch]),
  );

  const handleLeftDragEnd = ({data}) => setDataLeftSide(data);
  const handleRightDragEnd = ({data}) => setDataRightSide(data);

  return (
    <ScrollView>
      <View style={styles.matchContainer}>
        <View style={styles.inlineContainer}>
          <DraggableFlatList
            data={dataLeftSide}
            renderItem={({item, drag}) => (
              <TouchableOpacity
                onLongPress={() => {
                  drag();
                  Vibration.vibrate(30);
                }}
                style={styles.leftContainer}>
                <Text style={styles.matchText}>{item.leftData}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.leftId}
            onDragEnd={({data}) => handleLeftDragEnd({data})}
          />
        </View>
        <View style={styles.inlineContainer}>
          <DraggableFlatList
            data={dataRightSide}
            renderItem={({item, drag}) => (
              <TouchableOpacity
                onLongPress={() => {
                  drag();
                  Vibration.vibrate(30);
                }}
                style={styles.rightContainer}>
                <Text style={styles.matchText}>{item.rightData}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.rightId}
            onDragEnd={({data}) => handleRightDragEnd({data})}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default RenderMatch;

const styles = StyleSheet.create({
  matchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
  },
  inlineContainer: {
    width: '48%',
    marginBottom: 10,
  },
  leftContainer: {
    marginRight: 5,
    borderWidth: 1,
    padding: 10,
  },
  rightContainer: {
    marginLeft: 5,
    borderWidth: 1,
    padding: 10,
  },
  matchText: {
    fontSize: 16,
  },
});
