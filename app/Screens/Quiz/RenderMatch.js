import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
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



    const answers = new Map();

    for(let i = 0; i < matchAnswerLeftIds.length; i++){
        answers.set(matchAnswerLeftIds[i], matchAnswerRightIds[i]);
    }

    // console.log("answers",answers);

   

  const [answerData, setAnswerData] = useState([]);

  useEffect(() => {
    // console.log('itemss', item);
    matchFunction();
  }, [matchData, item]);

  const matchFunction = async () => {
    console.log("matchData",matchData.length);
    console.log("item",item);
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
      console.log("response",response.data);
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

      if (
        item.leftMatch !== correctLeftMatch ||
        item.rightMatch !== correctRightMatch
      ) {
        allMatched = false;
      }
    });
    console.log("updatedData",updatedData);
    
    setScore(allMatched ? score + 1 : score);
  };

  const handleLeftDragEnd = ({data}) => {
    const updatedData = data.map((item, index) => ({
      ...item,
      rightMatch: combinedData[index].rightMatch,
    }));
    setCombinedData(updatedData);
    checkForCorrectAnswers(updatedData);
  };

  const handleRightDragEnd = ({data}) => {
    const updatedData = data.map((item, index) => ({
      ...item,
      leftMatch: combinedData[index].leftMatch,
    }));
    setCombinedData(updatedData);
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
                  onLongPress={drag}
      
                  style={styles.leftContainer}>
                  <Text style={styles.matchText}>{item.leftMatch}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={item => item.leftId}
            onDragEnd={({data}) => handleLeftDragEnd({data})}
          />
        </View>

        <View style={styles.inlineContainer}>
          <DraggableFlatList
            data={combinedData}
            renderItem={({item, drag}) => (
              <TouchableOpacity
                onLongPress={drag}
      
                style={styles.rightContainer}>
                <Text style={styles.matchText}>{item.rightMatch}</Text>
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
    height: 'fit-content',
    marginBottom: 5,
    borderWidth: 1,
    padding: 5,
  },
  rightContainer: {
    marginLeft: 5,
    marginBottom: 5,
    borderWidth: 1,
    padding: 5,
    height: 'fit-content',
  },
  matchText: {
    fontSize: 18,
    color: color.black,
  },
});
