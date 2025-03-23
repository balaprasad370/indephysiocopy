import React, {useCallback, useMemo, useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList, Dimensions} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const ITEM_SIZE = Math.min(SCREEN_WIDTH / 6, 80); // Responsive item size
const ITEM_MARGIN = Math.min(SCREEN_WIDTH * 0.01, 8); // Responsive margin

const ListQuestions = ({
  size,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  selectedAnswers,
  items,
  setListQuestionsStatus,
}) => {
  const bottomSheetRef = useRef(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  useEffect(() => {
    const questions = items.map(item => ({
      id: item.id,
      isAnswered: selectedAnswers[item.id] ? true : false,
    }));
    setQuestions(questions);
  }, [items, selectedAnswers]);

  const snapPoints = useMemo(() => [
    `${Math.min(25, SCREEN_HEIGHT * 0.25)}%`,
    `${Math.min(30, SCREEN_HEIGHT * 0.5)}%`
  ], []);

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setCurrentQuestionIndex(currentQuestionIndex);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex]);

  const renderItem = ({item, index}) => (
    <Pressable
      onPress={() => {
        setCurrentQuestionIndex(index);
        // setListQuestionsStatus(false);
        // bottomSheetRef.current?.close();
      }}
      style={[
        styles.questionItem,
        {
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          margin: ITEM_MARGIN,
          borderRadius: 50,
          backgroundColor: currentQuestionIndex === index
            ? '#613BFF' // bg-p1
            : questions[index]?.isAnswered
            ? '#22c55e' // bg-green-500
            : '#f3f4f6' // bg-gray-100
        }
      ]}>
      <Text 
        style={[
          styles.questionText,
          {
            color: currentQuestionIndex === index || questions[index]?.isAnswered
              ? '#ffffff'
              : '#374151'
          }
        ]}>
        {index + 1}
      </Text>
    </Pressable>
  );

  const ListHeaderComponent = () => (
    <View className='flex-row justify-between items-center w-full p-4 rounded-lg'>
      <Text className='text-2xl font-bold text-gray-800'>Questions List</Text>
      <Text className='text-red-500 text-lg font-bold'>Close</Text>
    </View>
  );

  const numColumns = Math.floor((SCREEN_WIDTH - 10) / (ITEM_SIZE + ITEM_MARGIN * 2));

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        index={1}
        snapPoints={snapPoints}>
        <BottomSheetFlatList
          ListHeaderComponent={ListHeaderComponent}
          data={[...Array(size)]}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          columnWrapperStyle={styles.columnWrapper}
          style={{backgroundColor: 'white'}}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: Math.min(SCREEN_WIDTH * 0.02, 12),
  },
  columnWrapper: {
    justifyContent: 'start',
  },
  questionItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  questionText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.04, 18),
    fontWeight: '500',
  }
});

export default ListQuestions;
