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

const RenderMatch = ({
  matchData,
  item,
  setScore,
  score,
  combinedData,
  setCombinedData,
}) => {
  const {path} = useContext(AppContext);
  const matchAnswerLeftIds = item.matchAnswerLeft
    .split(',')
    .map(id => id.trim());

  const matchAnswerRightIds = item.matchAnswerRight
    .split(',')
    .map(id => id.trim());

  const matchQuestionLeftIds = item.matchQuestionLeft
    .split(',')
    .map(id => id.trim());
  const matchQuestionRightIds = item.matchQuestionRight
    .split(',')
    .map(id => id.trim());

  const [answerData, setAnswerData] = useState([]);

  useEffect(() => {
    matchFunction();
  }, [matchData, item]);

  const matchFunction = async () => {
    const token = await storage.getStringAsync('token');

    try {
      const response = await axios.post(
        `${path}/admin/v4/matchFunction`,
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
    let allMatched = true;

    updatedData.forEach((item, index) => {
      const correctLeftMatch = matchData.find(
        match => match.match_id == matchAnswerLeftIds[index],
      )?.match_data;
      const correctRightMatch = matchData.find(
        match => match.match_id == matchAnswerRightIds[index],
      )?.match_data;

      // If any match doesn't align, set allMatched to false
      if (
        item.leftMatch !== correctLeftMatch ||
        item.rightMatch !== correctRightMatch
      ) {
        allMatched = false;
      }
    });
    setScore(allMatched ? score + 1 : score);
  };

  // console.log(combinedData);

  const handleLeftDragEnd = ({data}) => {
    const updatedData = data.map((item, index) => ({
      ...item,
      rightMatch: combinedData[index].rightMatch, // Retain the right side as it is
    }));
    setCombinedData(updatedData);
    checkForCorrectAnswers(updatedData);
  };

  const handleRightDragEnd = ({data}) => {
    const updatedData = data.map((item, index) => ({
      ...item,
      leftMatch: combinedData[index].leftMatch, // Retain the left side as it is
    }));
    setCombinedData(updatedData); // Update state with new right order
    checkForCorrectAnswers(updatedData);
  };

  return (
    <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
      <View style={styles.matchContainer}>
        <View style={styles.inlineContainer}>
          <DraggableFlatList
            data={combinedData}
            renderItem={({item, drag}) => (
              <TouchableOpacity
                onLongPress={drag} // Allow dragging only the left match
                style={styles.leftContainer}>
                <Text style={styles.matchText}>{item.leftMatch}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.leftId} // Use leftId as unique identifier
            onDragEnd={({data}) => handleLeftDragEnd({data})} // Handle drag end for left
          />
        </View>

        <View style={styles.inlineContainer}>
          <DraggableFlatList
            data={combinedData}
            renderItem={({item, drag}) => (
              <TouchableOpacity
                onLongPress={drag} // Allow dragging only the right match
                style={styles.rightContainer}>
                <Text style={styles.matchText}>{item.rightMatch}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.rightId} // Use rightId as unique identifier
            onDragEnd={({data}) => handleRightDragEnd({data})} // Handle drag end for right
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default RenderMatch;

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
    width: '48%',
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
