import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Pressable,
  AppState,
  Alert,
  Modal,
} from 'react-native';
import axiosInstance from '../../utils/axiosInstance';
import Normal from './Normal';
import Animated, {
  FadeInDown,
  FadeOutDown,
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';
import storage from '../../Constants/storage';
import MultiQuestionsNormal from './MultiQuestionsNormal/index';
import {useNavigation} from '@react-navigation/native';
import ListQuestions from './ListQuestions/index';
import Evaluate from './Evaluate/index';
import TextNormal from './TextNormal/index';
import TextImage from './TextImage/index';
import TextAudio from './TextAudio/index';
import MultiQuestionsImage from './MultiQuestionsImage/index';
import MultiQuestionsAudio from './MultiQuestionsAudio/index';
import ImageNormal from './Image/index';
import AudioNormal from './Audio/index';
import TrueFalse from './TrueFalse/index';
import JumbledSentences from './JumbledSentences/index';
import Match from './Match/index';
import MatchAudio from './MatchAudio/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ROUTES} from './../../Constants/routes';

const SampleQuiz = ({route}) => {
  const navigation = useNavigation();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedanswers, setSelectedAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [listQuestionsStatus, setListQuestionsStatus] = useState(true);
  const [title, setTitle] = useState(route?.params?.title || 'Quiz');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [moduleId, setModuleId] = useState(
    route?.params?.module_id ? route?.params?.module_id : null,
  );

  // Save quiz state to storage
  const saveQuizState = async () => {
    try {
      console.log('selectedanswers', selectedanswers);

      await storage.setMapAsync('quiz_answers' + moduleId, selectedanswers);
      await storage.setMapAsync(
        'visited_questions' + moduleId,
        visitedQuestions,
      );
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      if (!storage) {
        throw new Error('Storage not initialized');
      }

      if (moduleId == null) {
        throw new Error('Module id is null');
      }

      const response = await axiosInstance.post(
        '/student/v4/questions/details',
        {
          module_id: moduleId,
        },
      );

      // console.log('response', response.data);

      if (!response?.data) {
        throw new Error('Invalid response data');
      }

      setQuizzes(response.data);

      // Load saved answers and visited questions from storage with error handling
      try {
        const savedAnswers = await storage.getMapAsync(
          'quiz_answers' + moduleId,
        );
        const savedVisitedQuestions = await storage.getMapAsync(
          'visited_questions' + moduleId,
        );
        setSelectedAnswers(savedAnswers || {});
        setVisitedQuestions(savedVisitedQuestions || []);
      } catch (storageError) {
        console.error('Error loading saved data:', storageError);
        setSelectedAnswers({});
        setVisitedQuestions([]);
      }

      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) {
      fetchQuizzes();
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  // Handle app state changes and blur events
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          nextAppState === 'background' ||
          nextAppState === 'inactive' ||
          nextAppState === 'blur'
        ) {
          await saveQuizState();
        }
      },
    );

    // Add blur event listener
    const blurSubscription = AppState.addEventListener('blur', async () => {
      await saveQuizState();
    });

    return () => {
      subscription.remove();
      blurSubscription.remove();
    };
  }, [selectedanswers, visitedQuestions, moduleId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // console.log("Screen is blur");
      saveQuizState();
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, selectedanswers, visitedQuestions, moduleId]);

  const handleAnswerSelect = useCallback(
    async (questionId, answer) => {
      try {
        // if (!questionId || answer === undefined) {
        //   console.error('Invalid answer selection params');
        //   return;
        // }

        // Create a new answers object
        const _selectedanswers = {...selectedanswers};

        // Only update if question and answer are provided
        // if (questionId && answer) {
        _selectedanswers[questionId] = answer;
        setSelectedAnswers(_selectedanswers);
        // }
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    },
    [selectedanswers],
  );

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quizzes.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, quizzes.length]);

  const handleSubmit = useCallback(async () => {
    // console.log(selectedanswers);

    try {
      setIsSubmitting(true);
      const result = await axiosInstance.post('/student/v4/quiz/submit', {
        module_id: moduleId,
        answers: selectedanswers,
      });

      console.log('result', result.data);

      // Remove storage data
      setSelectedAnswers({});
      setVisitedQuestions([]);

      await Promise.all([
        storage.removeItem('quiz_answers' + moduleId),
        storage.removeItem('visited_questions' + moduleId),
      ]);

      navigation.canGoBack()
        ? navigation.goBack()
        : navigation.navigate(ROUTES.SELF_LEARN);
    } catch (error) {
      console.error('Error submitting quiz:', error?.response?.data || error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedanswers, currentQuestion, moduleId]);

  const handleSubmitAlert = () => {
    setShowSubmitModal(true);
  };

  const currentQuestion = useMemo(
    () => quizzes[currentQuestionIndex],
    [quizzes, currentQuestionIndex],
  );

  useEffect(() => {
    const _visitedQuestions = [...visitedQuestions];
    if (
      quizzes[currentQuestionIndex]?.id &&
      !_visitedQuestions.includes(quizzes[currentQuestionIndex].id)
    ) {
      _visitedQuestions.push(quizzes[currentQuestionIndex].id);
      setVisitedQuestions(_visitedQuestions);
    }
  }, [visitedQuestions, currentQuestionIndex, quizzes]);

  const renderQuestion = useCallback(() => {
    if (!currentQuestion) return null;

    // console.log(selectedanswers);

    switch (currentQuestion.type?.toLowerCase()) {
      case 'normal':
        return (
          <Normal
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(currentQuestion.id, answer);
            }}
          />
        );

      //image
      case 'image':
        return (
          <ImageNormal
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
          />
        );

      //audio
      case 'audio':
        return (
          <AudioNormal
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
          />
        );

      //truefalse
      case 'truefalse':
        return (
          <TrueFalse
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
          />
        );

      //jumbledsentences
      case 'jumbledsentences':
        return (
          <JumbledSentences
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
          />
        );

      case 'match':
        return (
          <Match
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
          />
        );

      case 'matchaudio':
        return (
          <MatchAudio
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
            selectedAnswers={selectedanswers}
          />
        );

      //multiquestionsnormal
      case 'multiquestionsnormal':
        return (
          <MultiQuestionsNormal
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
            selectedAnswers={selectedanswers}
          />
        );

      case 'multiquestionsimage':
        return (
          <MultiQuestionsImage
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
            selectedAnswers={selectedanswers}
          />
        );

      case 'multiquestionsaudio':
        return (
          <MultiQuestionsAudio
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            isVisited={
              visitedQuestions.includes(currentQuestion.id) ||
              selectedanswers[currentQuestion.id]
            }
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
            selectedAnswers={selectedanswers}
          />
        );

      case 'evaluate':
        return (
          <Evaluate
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
            selectedAnswers={selectedanswers}
          />
        );

      case 'textnormal':
        return (
          <TextNormal
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
            selectedAnswers={selectedanswers}
          />
        );

      case 'textimage':
        return (
          <TextImage
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
            selectedAnswers={selectedanswers}
          />
        );
      case 'textaudio':
        return (
          <TextAudio
            key={currentQuestion.id}
            item={currentQuestion}
            index={currentQuestionIndex}
            selectedAnswer={selectedanswers[currentQuestion.id]}
            onAnswerSelect={(questionId, answer) => {
              handleAnswerSelect(questionId, answer);
            }}
            selectedAnswers={selectedanswers}
          />
        );

      default:
        return (
          <Text>
            Unknown quiz type: {currentQuestion.type || 'missing type'}
          </Text>
        );
    }
  }, [
    currentQuestion,
    currentQuestionIndex,
    selectedanswers,
    visitedQuestions,
    handleAnswerSelect,
  ]);

  const renderBackButton = () => {
    return (
      <View className="justify-center items-start bg-b50 w-full absolute top-0 p-2 shadow-sm z-10">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-b50 rounded-full shadow-md py-3 flex-row items-center px-3 py-1.5">
          <Ionicons name="arrow-back" size={24} color="#613BFF" />
          <Text className="text-p1 font-bold ml-2 text-base">Back</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-b50">
        <ActivityIndicator size="large" className="text-blue-600" />
        <Text className="text-p1 font-bold text-base">
          Fetching questions...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-b50">
        {renderBackButton()}
        <Text className="text-red-500 text-base font-medium px-4 text-center">
          Error: {error}
        </Text>
      </View>
    );
  }

  if (moduleId == null) {
    return (
      <View className="flex-1 justify-center items-center bg-b50">
        {renderBackButton()}
        <Text className="text-red-500 text-base font-medium px-6 text-center">
          The requested test cannot be accessed at this time
        </Text>
      </View>
    );
  }

  if (!quizzes.length) {
    return (
      <View className="flex-1 justify-center items-center bg-b50">
        {renderBackButton()}
        <Text className="text-gray-600 text-base font-medium px-6 text-center text-red-400 font-bold">
          There are no questions available for this quiz at the moment
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-b50 ">
      <StatusBar backgroundColor="#613BFF" />
      <View className="flex-row justify-between items-center rounded-xl p-4 bg-white shadow-lg mx-2 my-2">
        <View className=" mr-4">
          <Text className="text-2xl font-titleFont font-bold text-n0 mb-2">
            {title && title.length > 0
              ? title.length > 15
                ? title.slice(0, 15) + '...'
                : title
              : 'Quiz'}
          </Text>
          <Pressable
            android_ripple={{color: '#fff'}}
            hitSlop={20}
            className="bg-b50 px-4 py-2 rounded-lg shadow-sm "
            onPress={() => setListQuestionsStatus(true)}>
            <Text className="text-sm text-n0 font-medium font-regular">
              Question {currentQuestionIndex + 1} of {quizzes.length}
            </Text>
          </Pressable>
        </View>
        <TouchableOpacity
          onPress={handleSubmitAlert}
          className="bg-p1 px-6 py-3 rounded-lg shadow-md active:bg-b200 transform active:scale-95">
          <Text className="text-white font-semibold text-lg font-regular">
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      {/* <ScrollView
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-2 shadow-2xl"> */}
      <View className="pb-32  bg-white">{renderQuestion()}</View>
      {/* </ScrollView> */}

      <Animated.View
        className="absolute bottom-0 h-20 left-0 px-4 right-0 flex-row items-center justify-between bg-b50 overflow-hidden"
        entering={FadeInDown.duration(400)}
        exiting={FadeOutDown.duration(300)}>
        <Animated.View
          entering={SlideInLeft.duration(500)}
          exiting={SlideOutLeft.duration(400)}>
          <Pressable
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg shadow-md w-32 h-12 items-center ${
              currentQuestionIndex === 0 ? 'bg-n40' : 'bg-p1'
            }`}
            style={({pressed}) => [
              {
                transform: [{scale: pressed ? 0.95 : 1}],
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <Text className="text-white font-medium text-lg">Previous</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={SlideInRight.duration(500)}
          exiting={SlideOutRight.duration(400)}>
          <Pressable
            onPress={handleNext}
            disabled={currentQuestionIndex === quizzes.length - 1}
            className={`px-6 py-3 rounded-lg shadow-md w-32 h-12 items-center ${
              currentQuestionIndex === quizzes.length - 1 ? 'bg-n40' : 'bg-p1'
            }`}
            style={({pressed}) => [
              {
                transform: [{scale: pressed ? 0.95 : 1}],
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <Text className="text-white font-medium text-lg">Next</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>

      {/* bottom sheet */}

      {listQuestionsStatus && (
        <View className="absolute bottom-0 left-0 right-0 w-full h-full bg-black/10">
          <Pressable
            onPress={() => setListQuestionsStatus(false)}
            className="w-full h-full">
            <ListQuestions
              size={quizzes.length}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              selectedAnswers={selectedanswers}
              items={quizzes}
              setListQuestionsStatus={setListQuestionsStatus}
            />
          </Pressable>
        </View>
      )}

      {/* Submit Confirmation Modal */}
      <Modal
        visible={showSubmitModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubmitModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-4/5 shadow-lg">
            <Text className="text-xl font-bold text-n0 mb-4 text-center">
              Submit Quiz
            </Text>
            <Text className="text-base text-n0 mb-6 text-center">
              Are you sure you want to submit the quiz?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowSubmitModal(false)}
                className="bg-n40 px-6 py-3 rounded-lg shadow-md flex-1 mr-2">
                <Text className="text-n0 font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowSubmitModal(false);
                  handleSubmit();
                }}
                className="bg-p1 px-6 py-3 rounded-lg shadow-md flex-1 ml-2">
                <Text className="text-white font-semibold text-center">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isSubmitting && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 flex justify-center items-center">
          <View className="bg-white p-6 rounded-xl shadow-lg items-center">
            <ActivityIndicator size="large" color="#613BFF" />
            <Text className="text-p1 font-bold mt-4 text-base">
              Submitting your quiz...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default SampleQuiz;
