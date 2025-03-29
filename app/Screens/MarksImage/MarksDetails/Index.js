import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import axiosInstance from '../../../utils/axiosInstance';
import moment from 'moment';
import {AppContext} from '../../../theme/AppContext';
import DarkTheme from '../../../theme/Darktheme';
import LighTheme from '../../../theme/LighTheme';
import PageTitle from '../../../ui/PageTitle';
import topBgBackground from '../../../assets/top-bg-shape2.png';
import OldAnswerListing from './components/OldAnswerListing';

const Index = () => {
  const route = useRoute();
  const {attempt_id, module_id} = route.params;

  // const module_id = 4985;
  // const attempt_id = 48;

  const {isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const [loading, setLoading] = useState(true);
  const [attemptData, setAttemptData] = useState(null);
  const [answersData, setAnswersData] = useState([]);
  const [currentTab, setCurrentTab] = useState('All Questions');

  useEffect(() => {
    if (attempt_id) {
      getAttemptDetails();
      fetchAttemptDetails();
    }
  }, []);

  const getAttemptDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/student/attempts/metadata/${attempt_id}/${module_id}`,
      );

      setAttemptData(response.data?.result);
    } catch (error) {
      console.error('Error fetching attempt details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttemptDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/student/attempts', {
        module_id,
        attempt_id,
      });
      console.log('response', response.data?.result);
      if (response.data && response.data.result) {
        setAnswersData(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching attempt details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!attempt_id) {
    return <OldAnswerListing module_id={module_id} />;
  }

  const calculatePercentage = (marks, total) => {
    return Math.round((marks / total) * 100);
  };

  const getGradeColor = percentage => {
    if (percentage >= 90) return '#4CAF50'; // A - Green
    if (percentage >= 80) return '#8BC34A'; // B - Light Green
    if (percentage >= 70) return '#CDDC39'; // C - Lime
    if (percentage >= 60) return '#FFC107'; // D - Amber
    return '#F44336'; // F - Red
  };

  const getBorderColor = percentage => {
    if (percentage >= 85) return 'border-green-100';
    if (percentage >= 70) return 'border-blue-100';
    if (percentage >= 50) return 'border-yellow-100';
    return 'border-red-100';
  };

  const getGradeLabel = percentage => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Very Good';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const filteredAnswers =
    currentTab === 'Wrong Answers' && answersData?.length > 0
      ? answersData.filter(answer => answer.scored_marks < answer.total_marks)
      : answersData;

  const renderAnswerItem = ({item: answer, index}) => {
    if (answer?.type === 'Evaluate') {
      return (
        <View
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3 p-4">
          <Text className="text-sm font-semibold text-gray-800 mb-3">
            {index + 1}. {answer?.question}
          </Text>
          <View className="mb-2">
            <Text className="text-sm font-medium text-gray-600 mb-1">
              Your Answer:
            </Text>
            <View className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <Text className="text-sm">
                {answer?.student_answer_text || 'Not Attempted'}
              </Text>
            </View>
          </View>

          {answer?.feedback && (
            <View className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <Text className="text-xs text-gray-700 leading-5">
                <Text className="font-bold text-blue-700">Feedback: </Text>
                {answer.feedback}
              </Text>
            </View>
          )}

          <View className="mt-3 bg-green-50 p-3 rounded-lg border border-green-100">
            <Text className="text-sm font-medium text-gray-600 mb-1">
              Marks:
            </Text>
            <Text className="text-sm font-medium text-gray-600">
              {answer?.scored_marks}/{answer?.total_marks}
            </Text>
          </View>
        </View>
      );
    }

    if (answer?.type?.toLowerCase() === 'jumbledsentences') {
      return (
        <View
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3 p-3">
          <Text className="text-sm font-medium text-gray-800 mb-2">
            {index + 1}. {answer?.question}
          </Text>
          <View className="flex-column justify-start items-start mb-1 w-full my-2">
            <Text className="text-sm text-gray-600 flex-shrink-0 mr-2 mb-2">
              Your Answer:
            </Text>
            <View className="flex-column justify-between  rounded-lg p-3 border border-gray-100 items-center mb-1 w-full">
              {answer?.student_answer_jumbled?.length > 0 &&
                answer.student_answer_jumbled.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row bg-b50 rounded-lg w-full p-3 border border-gray-100 justify-between items-center mb-2">
                    <Text
                      key={index}
                      className="text-sm font-medium text-gray-600">
                      {typeof item === 'string' ? item.trim() : item}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
          <View className="flex-column justify-between items-start mb-1 w-full">
            <Text className="text-sm text-gray-600 flex-shrink-0 mr-2 mb-2">
              Correct Answer:
            </Text>
            <View className="flex-column justify-between  rounded-lg p-3 border border-gray-100 items-center mb-1 w-full">
              {answer?.correct_answer_jumbled?.length > 0 &&
                answer.correct_answer_jumbled.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row bg-b50 rounded-lg w-full p-3 border border-gray-100 justify-between items-center mb-2">
                    <Text
                      key={index}
                      className="text-sm font-medium text-gray-600">
                      {typeof item === 'string' ? item.trim() : item}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
          <View
            className={`mt-3 
        ${
          answer?.scored_marks < answer?.total_marks
            ? 'bg-red-50 p-3 rounded-lg border border-red-100'
            : 'bg-green-50 p-3 rounded-lg border border-green-100'
        }`}>
            <Text className="text-sm font-medium text-gray-600 mb-1">
              Marks:
            </Text>
            <Text className="text-sm font-medium text-gray-600">
              {answer?.scored_marks}/{answer?.total_marks}
            </Text>
          </View>
          {answer?.feedback && (
            <View className="mt-2 bg-gray-50 p-2 rounded">
              <Text className="text-xs text-gray-700">
                <Text className="font-medium">Feedback: </Text>
                {answer.feedback}
              </Text>
            </View>
          )}
        </View>
      );
    }
    if (answer?.type?.toLowerCase() === 'match') {
      return (
        <View
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3 p-3">
          <Text className="text-sm font-medium text-gray-800 mb-2">
            {index + 1}. {answer?.question}
          </Text>
          <View className="flex-column justify-start items-start mb-1 w-full my-2">
            <Text className="text-sm text-gray-600 flex-shrink-0 mr-2 mb-2">
              Your Answer:
            </Text>
            <View className="flex-column justify-between rounded-lg p-3 border border-gray-100 items-center mb-1 w-full">
              {answer?.student_answer_match_left?.length > 0 &&
                answer?.student_answer_match_right?.length > 0 &&
                answer.student_answer_match_left.map((leftItem, idx) => (
                  <View
                    key={idx}
                    className="flex-row bg-b50 rounded-lg w-full p-3 border border-gray-100 justify-between items-center mb-2">
                    <Text className="text-sm font-medium text-gray-600 flex-1">
                      {typeof leftItem === 'string'
                        ? leftItem.trim()
                        : leftItem}
                    </Text>
                    <View className="w-8 items-center">
                      <Text className="text-sm font-medium text-gray-600">
                        →
                      </Text>
                    </View>
                    <Text className="text-sm font-medium text-gray-600 flex-1 text-right">
                      {typeof answer.student_answer_match_right[idx] ===
                      'string'
                        ? answer.student_answer_match_right[idx].trim()
                        : answer.student_answer_match_right[idx]}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
          <View className="flex-column justify-between items-start mb-1 w-full">
            <Text className="text-sm text-gray-600 flex-shrink-0 mr-2 mb-2">
              Correct Answer:
            </Text>
            <View className="flex-column justify-between rounded-lg p-3 border border-gray-100 items-center mb-1 w-full">
              {answer?.correct_answer_match_left?.length > 0 &&
                answer?.correct_answer_match_right?.length > 0 &&
                answer.correct_answer_match_left.map((leftItem, idx) => (
                  <View
                    key={idx}
                    className="flex-row bg-b50 rounded-lg w-full p-3 border border-gray-100 justify-between items-center mb-2">
                    <Text className="text-sm font-medium text-gray-600 flex-1">
                      {typeof leftItem === 'string'
                        ? leftItem.trim()
                        : leftItem}
                    </Text>
                    <View className="w-8 items-center">
                      <Text className="text-sm font-medium text-gray-600">
                        →
                      </Text>
                    </View>
                    <Text className="text-sm font-medium text-gray-600 flex-1 text-right">
                      {typeof answer.correct_answer_match_right[idx] ===
                      'string'
                        ? answer.correct_answer_match_right[idx].trim()
                        : answer.correct_answer_match_right[idx]}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
          <View
            className={`mt-3 
        ${
          answer?.scored_marks < answer?.total_marks
            ? 'bg-red-50 p-3 rounded-lg border border-red-100'
            : 'bg-green-50 p-3 rounded-lg border border-green-100'
        }`}>
            <Text className="text-sm font-medium text-gray-600 mb-1">
              Marks:
            </Text>
            <Text className="text-sm font-medium text-gray-600">
              {answer?.scored_marks}/{answer?.total_marks}
            </Text>
          </View>
          {answer?.feedback && (
            <View className="mt-2 bg-gray-50 p-2 rounded">
              <Text className="text-xs text-gray-700">
                <Text className="font-medium">Feedback: </Text>
                {answer.feedback}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View
        key={index}
        className="bg-white border border-gray-200 rounded-lg shadow-sm mb-3 p-3">
        <Text className="text-sm font-medium text-gray-800 mb-2">
          {index + 1}. {answer?.question}
        </Text>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm text-gray-600 flex-shrink-0 mr-2">
            Your Answer:
          </Text>
          <Text
            className={`text-sm font-medium text-right flex-1 ${
              answer?.scored_marks < answer?.total_marks
                ? 'text-red-500'
                : 'text-green-500'
            }`}
            numberOfLines={2}
            ellipsizeMode="tail">
            {answer?.student_answer_text || 'Not Attempted'}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-sm text-gray-600 flex-shrink-0 mr-2">
            Correct Answer:
          </Text>
          <Text
            className="text-sm font-medium text-green-500 text-right flex-1"
            numberOfLines={2}
            ellipsizeMode="tail">
            {answer?.correct_answer_text || 'N/A'}
          </Text>
        </View>
        <View
          className={`mt-3 
        ${
          answer?.scored_marks < answer?.total_marks
            ? 'bg-red-50 p-3 rounded-lg border border-red-100'
            : 'bg-green-50 p-3 rounded-lg border border-green-100'
        }`}>
          <Text className="text-sm font-medium text-gray-600 mb-1">Marks:</Text>
          <Text className="text-sm font-medium text-gray-600">
            {answer?.scored_marks}/{answer?.total_marks}
          </Text>
        </View>
        {answer?.feedback && (
          <View className="mt-2 bg-gray-50 p-2 rounded">
            <Text className="text-xs text-gray-700">
              <Text className="font-medium">Feedback: </Text>
              {answer.feedback}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyList = () => (
    <View className="items-center justify-center py-8">
      <Text className="text-gray-500">
        {currentTab === 'Wrong Answers'
          ? 'No wrong answers found!'
          : 'No answers available'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="relative pb-4">
          <View className="absolute w-full top-0 left-0 right-0">
            <Image
              source={topBgBackground}
              className="w-full h-[200px] -mt-24"
            />
          </View>
          <PageTitle pageName={'Marks Details'} />
        </View>

        {loading ? (
          <View className="p-4 items-center justify-center mt-8">
            <ActivityIndicator size="small" color="#613BFF" />
            <Text className="mt-2 text-sm text-gray-500">Loading...</Text>
          </View>
        ) : (
          <View className="flex-1 px-3 py-2">
            {attemptData && (
              <View className="mb-4">
                <View className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <View className="p-2">
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-base font-bold text-gray-800">
                          #{attemptData?.attempt_id}
                        </Text>
                        <Text
                          className="text-xs text-gray-600 mt-1"
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {attemptData?.module_name}
                        </Text>
                      </View>
                      <View className="bg-blue-50 px-2 py-0.5 rounded-full">
                        <Text className="text-blue-800 font-medium text-xs">
                          {moment(attemptData?.attempt_date).format(
                            'MMM DD, YYYY',
                          )}
                        </Text>
                      </View>
                    </View>

                    <View className="items-center mb-3">
                      <View
                        className={`w-24 h-24 rounded-full border-6 ${getBorderColor(
                          calculatePercentage(
                            attemptData?.marks,
                            attemptData?.total,
                          ),
                        )} items-center justify-center mb-1`}>
                        <Text className="text-2xl font-bold text-[#613BFF]">
                          {calculatePercentage(
                            attemptData?.marks,
                            attemptData?.total,
                          )}
                          %
                        </Text>
                      </View>
                      <Text className="text-base font-bold text-gray-800">
                        {attemptData?.marks}/{attemptData?.total}
                      </Text>
                      <Text
                        className="text-sm font-medium"
                        style={{
                          color: getGradeColor(
                            calculatePercentage(
                              attemptData?.marks,
                              attemptData?.total,
                            ),
                          ),
                        }}>
                        {getGradeLabel(
                          calculatePercentage(
                            attemptData?.marks,
                            attemptData?.total,
                          ),
                        )}
                      </Text>
                    </View>

                    {attemptData?.module_description && (
                      <View className="px-2 mb-2">
                        <Text
                          className="text-xs text-gray-500 text-center"
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {attemptData.module_description}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="h-1.5 w-full bg-gray-200">
                    <View
                      className="h-full"
                      style={{
                        width: `${calculatePercentage(
                          attemptData?.marks,
                          attemptData?.total,
                        )}%`,
                        backgroundColor: getGradeColor(
                          calculatePercentage(
                            attemptData?.marks,
                            attemptData?.total,
                          ),
                        ),
                      }}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Tab Navigation */}
            <View className="flex-row mb-4 border-b border-gray-200">
              <TouchableOpacity
                onPress={() => setCurrentTab('All Questions')}
                className={`flex-1 py-2 ${
                  currentTab === 'All Questions'
                    ? 'border-b-2 border-[#613BFF] bg-blue-50'
                    : ''
                }`}>
                <Text
                  className={`text-center font-medium ${
                    currentTab === 'All Questions'
                      ? 'text-[#613BFF]'
                      : 'text-gray-600'
                  }`}>
                  All Questions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentTab('Wrong Answers')}
                className={`flex-1 py-2 ${
                  currentTab === 'Wrong Answers'
                    ? 'border-b-2 border-[#613BFF] bg-blue-50'
                    : ''
                }`}>
                <Text
                  className={`text-center font-medium ${
                    currentTab === 'Wrong Answers'
                      ? 'text-[#613BFF]'
                      : 'text-gray-600'
                  }`}>
                  Wrong Answers
                </Text>
              </TouchableOpacity>
            </View>

            {/* Questions List using FlatList for optimization */}
            <FlatList
              data={filteredAnswers}
              renderItem={renderAnswerItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={renderEmptyList}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={5}
              removeClippedSubviews={true}
              scrollEnabled={false}
              nestedScrollEnabled={true}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
