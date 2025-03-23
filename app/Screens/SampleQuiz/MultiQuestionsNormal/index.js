import React, {useMemo, useCallback, useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import Normal from './../Normal/index';
import TextNormal from '../TextNormal';
import TextImage from '../TextImage';
import TextAudio from '../TextAudio';
import Evaluate from '../Evaluate';
import ImageNormal from '../Image';
import AudioNormal from '../Audio';

const MultiQuestionsNormal = ({
  item,
  index,
  isVisited,
  selectedAnswer,
  onAnswerSelect,
  selectedAnswers,
}) => {
  // Memoize subQuestions array to prevent recreation on each render
  const subQuestions = useMemo(() => item?.subQuestions || [], [item]);

  useEffect(() => {
    onAnswerSelect(item.id, 'true');
  }, []); // Run only once on mount

  // Memoize onAnswerSelect callback for each subquestion
  const handleAnswerSelect = useCallback(
    (subQuestionId, answer) => {
      onAnswerSelect(subQuestionId, answer);
    },
    [onAnswerSelect],
  );

  const renderQuestion = useCallback(
    (subQuestion, subIndex) => {
      switch (subQuestion.type?.toLowerCase()) {
        case 'normal':
          return (
            <Normal
              key={subQuestion.id}
              item={subQuestion}
              index={subIndex}
              isVisited={isVisited}
              selectedAnswer={selectedAnswers[subQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
            />
          );

        case 'image':
          return (
            <ImageNormal
              key={subQuestion.id}
              item={subQuestion}
              index={subIndex}
              selectedAnswer={selectedAnswers[subQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswers={selectedAnswers}
            />
          );

        case 'audio':
          return (
            <AudioNormal
              key={subQuestion.id}
              item={subQuestion}
              index={subIndex}
              selectedAnswer={selectedAnswers[subQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswers={selectedAnswers}
            />
          );

        case 'textnormal':
          return (
            <TextNormal
              key={subQuestion.id}
              item={subQuestion}
              index={subIndex}
              selectedAnswer={selectedAnswers[subQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswers={selectedAnswers}
            />
          );

        case 'textimage':
          return (
            <TextImage
              key={subQuestion.id}
              item={subQuestion}
              index={subIndex}
              selectedAnswer={selectedAnswers[subQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswers={selectedAnswers}
            />
          );

        case 'textaudio':
          return (
            <TextAudio
              key={subQuestion.id}
              item={subQuestion}
              index={subIndex}
              selectedAnswer={selectedAnswers[subQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswers={selectedAnswers}
            />
          );

        case 'evaluate':
          return (
            <Evaluate
              key={subQuestion.id}
              item={subQuestion}
              index={subIndex}
              selectedAnswer={selectedAnswers[subQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswers={selectedAnswers}
            />
          );

        default:
          return (
            <View key={subQuestion.id}>
              <Text>No question type found</Text>
            </View>
          );
      }
    },
    [handleAnswerSelect, isVisited, selectedAnswers],
  );

  return (
    <ScrollView 
    contentContainerStyle={{paddingBottom: 80}}
    className="bg-white rounded-xl p-4">
      <View className="mb-8 flex-row items-start justify-start gap-2">
        <Text className="text-lg text-p1 font-bold uppercase tracking-wider">
          {index + 1} 
        </Text>
        <Text className="text-xl font-semibold text-gray-900">{item.question}</Text>
      </View>
      <View className="space-y-4">
        {subQuestions.map((subQuestion, subIndex) =>
          renderQuestion(subQuestion, subIndex),
        )}
      </View>
    </ScrollView>
  );
};

export default React.memo(MultiQuestionsNormal);
