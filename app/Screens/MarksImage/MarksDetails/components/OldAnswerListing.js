import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import storage from '../../../../Constants/storage';
import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import color from '../../../../Constants/color';
import {AppContext} from '../../../../theme/AppContext';
import topBgBackground from '../../../../assets/top-bg-shape2.png';
import PageTitle from '../../../../ui/PageTitle';

const OldAnswerListing = ({module_id}) => {
  const path = 'https://mobile.indephysio.com';
  const {isDark} = useContext(AppContext);

  const [studentAnswers, setStudentAnswers] = useState({});
  const [teacherAnswers, setTeacherAnswers] = useState({});
  const [question_name, setQuestionName] = useState({});
  const [showAllQuestions, setShowAllQuestions] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttemptedQuestions();
  }, []);

  const fetchAttemptedQuestions = async () => {
    setLoading(true);
    setError(null);
    const token = await storage.getStringAsync('token');

    try {
      const response = await axios.get(`${path}/admin/v4/submitAnswers`, {
        params: {module_id},
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
      const studentAns = response.data?.student_answers;
      const teacherAns = response.data?.teacher_answers;
      setStudentAnswers(studentAns || {});
      setTeacherAnswers(teacherAns || {});
      setQuestionName(response.data?.question_name || {});

      if (!studentAns || Object.keys(studentAns).length === 0) {
        setError('No answers data available for this module');
      }
    } catch (error) {
      console.log('Error fetching attempted questions:', error);
      setError('Failed to load answers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1">
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image source={topBgBackground} className="w-full h-[200px] -mt-24" />
        </View>
        <PageTitle pageName={'Attempt Details'} />
      </View>
      <View className={`p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {loading ? (
          <View className="flex items-center justify-center py-10">
            <ActivityIndicator size="large" color="#613BFF" />
            <Text
              className={`text-lg mt-4 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              Loading answers...
            </Text>
          </View>
        ) : error ? (
          <View
            className={`p-5 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-md mt-4 items-center justify-center`}>
            <Text
              className={`text-lg font-medium ${
                isDark ? 'text-red-400' : 'text-red-500'
              }`}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={fetchAttemptedQuestions}
              className="mt-4 bg-indigo-600 py-2 px-4 rounded-md">
              <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {studentAnswers && Object.keys(studentAnswers).length > 0 ? (
              <>
                <View className="flex-row justify-between mt-2 w-full rounded-t-lg overflow-hidden">
                  <TouchableOpacity
                    onPress={() => setShowAllQuestions(true)}
                    className={`w-1/2 border-b p-3 items-center ${
                      isDark
                        ? showAllQuestions
                          ? 'bg-gray-700'
                          : 'bg-gray-800'
                        : showAllQuestions
                        ? 'bg-indigo-100'
                        : 'bg-white'
                    }`}>
                    <Text
                      className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                      All Questions
                    </Text>
                  </TouchableOpacity>
                  <View
                    className={`w-0.5 h-full ${
                      isDark ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  />
                  <TouchableOpacity
                    onPress={() => setShowAllQuestions(false)}
                    className={`w-1/2 border-b p-3 items-center ${
                      isDark
                        ? !showAllQuestions
                          ? 'bg-gray-700'
                          : 'bg-gray-800'
                        : !showAllQuestions
                        ? 'bg-indigo-100'
                        : 'bg-white'
                    }`}>
                    <Text
                      className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                      Wrong Answers
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  className={`p-5 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  } rounded-lg shadow-md mt-4`}>
                  <Text
                    className={`text-xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                    Attempted Questions
                  </Text>

                  {Object.keys(studentAnswers).map(key => {
                    const isCorrect =
                      studentAnswers[key] === teacherAnswers[key];

                    if (!showAllQuestions && isCorrect) {
                      return null;
                    }

                    return (
                      <View
                        key={key}
                        className={`${
                          isDark ? 'bg-gray-700' : 'bg-gray-50'
                        } p-4 rounded-lg mb-4 border ${
                          isDark
                            ? 'border-gray-600'
                            : isCorrect
                            ? 'border-green-200'
                            : 'border-red-200'
                        }`}>
                        <Text
                          className={`text-base font-semibold mb-2 ${
                            isDark ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                          Question: {question_name[key]}
                        </Text>

                        <Text
                          className={`text-base mb-2 ${
                            isCorrect
                              ? isDark
                                ? 'text-green-400'
                                : 'text-green-600'
                              : isDark
                              ? 'text-red-400'
                              : 'text-red-600'
                          }`}>
                          <Text
                            className={`font-medium ${
                              isCorrect
                                ? isDark
                                  ? 'text-green-400'
                                  : 'text-green-600'
                                : isDark
                                ? 'text-red-400'
                                : 'text-red-600'
                            }`}>
                            Student Answer:
                          </Text>{' '}
                          {studentAnswers[key]}
                        </Text>

                        <Text
                          className={`text-base ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                          <Text className="font-medium">Teacher Answer: </Text>
                          {teacherAnswers[key] || 'Not available'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : (
              <View
                className={`p-8 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow-md mt-4 items-center`}>
                <Text
                  className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                  No Data Available
                </Text>
                <Text
                  className={`text-base text-center ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  There are no answers available for this module yet.
                </Text>
                <TouchableOpacity
                  onPress={fetchAttemptedQuestions}
                  className="mt-6 bg-indigo-600 py-2.5 px-6 rounded-md">
                  <Text className="text-white font-medium">Refresh</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};
export default OldAnswerListing;
