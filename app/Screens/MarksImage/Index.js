import React, {useRef, useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import ViewShot, {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native'; // Import LottieView
import logo from '../../assets/logo.png';
import color from '../../Constants/color';
import moment from 'moment';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';
import axiosInstance from './../../utils/axiosInstance/index';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import Celebration from '../../assets/lottie/celebration.json';

const Certificate = ({route}) => {
  const viewShotRef = useRef();
  const {
    module_id,
    title = 'German Language Quiz',
    description = '',
  } = route.params;
  const navigation = useNavigation();

  const {path, isDark, userData} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const [marks, setMarks] = useState(null);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState();
  const [studentAnswers, setStudentAnswers] = useState({});
  const [teacherAnswers, setTeacherAnswers] = useState({});
  const [question_name, setQuestionName] = useState({});
  const [showAllQuestions, setShowAllQuestions] = useState(true);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axiosInstance.get(`/student/score/${module_id}`);

        console.log('response', response.data);

        if (response.data?.status) {
          console.log('response.data?.result', response.data?.result);
          setMarks(response.data?.result?.marks);
          setDate(response.data?.result?.modified_date);
          setTotal(response.data?.result?.total);
        } else {
          console.log('response.data?.message', response.data?.message);
          setModalVisible(true); // Show modal when no data
        }
      } catch (error) {
        console.log('Error fetching marks:', error?.response?.data || error);
        Alert.alert('Error', error?.response?.data?.message || error?.message);
      }
    };

    fetchMarks();
  }, [module_id]);

  const fetchAttemptedQuestions = async () => {
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
      setStudentAnswers(studentAns);
      setTeacherAnswers(teacherAns);
      setQuestionName(response.data?.question_name);
    } catch (error) {
      console.log('Error fetching attempted questions:', error);
    }
  };

  useEffect(() => {
    fetchAttemptedQuestions();
    fetchAttempWithMarks();
  }, [module_id]);

  const fetchAttempWithMarks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/admin/v7/attempted-questions`,
        {
          params: {module_id},
        },
      );
      console.log('response fetchAttempWithMarks', response.data);
      setAttempts(response.data);
    } catch (error) {
      console.log('Error fetching attempted questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const captureAndShareScreenshot = () => {
    try {
      captureRef(viewShotRef, {
        format: 'png',
        quality: 0.9,
      }).then(uri => {
        Share.open({
          url: uri,
          type: 'image/png',
          message: `Challenge accepted! 🏆 I just scored on the German Language Quiz! Think you can beat me? Download MedUniverse and let's see who learns faster!
                    \n\n Get the app here: \n
                    📱 Android: https://play.google.com/store/apps/details?id=com.inde.physio \n
                    🍎 iOS: https://apps.apple.com/us/app/meduniverse/id6736482857`,
          subject: 'Challenge: Beat My Score!',
        });
      });
    } catch (error) {
      console.log('Error capturing and sharing screenshot:', error);
    }
  };

  const marksComponent = () => {
    return (
      <View
        style={[style.marksContainer, {marginTop: 20, position: 'relative'}]}>
        <ViewShot
          ref={viewShotRef}
          options={{format: 'png', quality: 0.9}}
          style={{
            width: '95%',
          }}>
          <LinearGradient
            colors={['#613BFF', '#ffffff', '#613BFF']} // Use primary color
            start={{x: 0, y: 0}}
            end={{x: 0.99, y: 0.9}}
            style={styles.certificateCard}>
            <View style={styles.border}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.certificateTitle}>🎉 Results Are In!</Text>
              <View style={styles.decorativeLine} />
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  color: '#613BFF',
                  fontWeight: 'bold',
                  fontFamily: 'serif',
                }}>
                {' '}
                {/* Use primary color */}
                Congratulations
              </Text>
              <Text style={styles.studentName}>
                {userData?.first_name} {userData?.last_name}
              </Text>

              <Text style={styles.descriptionText}>
                on successfully completing the
              </Text>
              <Text style={styles.examTitle}>{title}</Text>
              {description && (
                <Text style={styles.examDescription}>{description}</Text>
              )}

              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>Score:</Text>
                <Text style={styles.score}>
                  {marks !== null ? `${marks} / ${total}` : 'Loading...'}
                </Text>
              </View>
              <Text style={styles.date}>
                Date: {moment(date).format('DD MMMM, YYYY')}
              </Text>
            </View>
          </LinearGradient>
        </ViewShot>

        {/* Celebration Animation */}
        <LottieView
          source={Celebration} // Path to your Lottie animation
          autoPlay
          loop
          style={styles.topLeftlottieStyle}
          speed={0.5}
        />
        <LottieView
          source={Celebration} // Path to your Lottie animation
          autoPlay
          loop
          style={styles.topRightlottieStyle}
          speed={1}
        />
        <LottieView
          source={Celebration} // Path to your Lottie animation
          autoPlay
          loop
          style={styles.bottomLeftlottieStyle}
          speed={2}
        />
        <LottieView
          source={Celebration} // Path to your Lottie animation
          autoPlay
          loop
          style={styles.bottomRightlottieStyle}
          speed={1.5}
        />

        {/* {studentAnswers && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => setShowAllQuestions(true)}
            style={{
              width: '50%',
              borderBottomWidth: 1,
              borderBottomColor: color.grey,
              padding: 10,
              alignItems: 'center',
              backgroundColor: showAllQuestions
                ? 'rgba(0, 0, 0, 0.2)'
                : color.white,
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              All Questions
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 2,
              height: '100%',
              backgroundColor: color.grey,
            }}
          />
          <TouchableOpacity
            onPress={() => setShowAllQuestions(false)}
            style={{
              width: '50%',
              borderBottomWidth: 1,
              borderBottomColor: color.grey,
              padding: 10,
              alignItems: 'center',
              borderTopRightRadius: 10,
              backgroundColor: !showAllQuestions
                ? 'rgba(0, 0, 0, 0.2)'
                : color.white,
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Wrong Answers
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {studentAnswers && Object.keys(studentAnswers).length > 0 && (
        <View style={styles.answersContainer}>
          <Text style={styles.answersTitle}>Attempted Questions</Text>


          {studentAnswers &&
            Object.keys(studentAnswers).map(key => {
              const isCorrect = studentAnswers[key] === teacherAnswers[key];

              if (!showAllQuestions && isCorrect) {
                return null;
              }

              return (
                <View key={key} style={styles.answerCard}>
                  <Text style={styles.questionLabel}>
                    Question: {question_name[key]}
                  </Text>

                  <Text
                    style={[
                      styles.studentAnswer,
                      {color: isCorrect ? 'green' : 'red'},
                    ]}>
                    <Text
                      style={[
                        styles.answerType,
                        {color: isCorrect ? 'green' : 'red'},
                      ]}>
                      Student Answer:
                    </Text>{' '}
                    {studentAnswers[key]}
                  </Text>


                  <Text style={styles.teacherAnswer}>
                    <Text style={styles.answerType}>Teacher Answer: </Text>
                    {teacherAnswers[key] || 'Not available'}
                  </Text>
                </View>
              );
            })}
        </View>
      )} */}
      </View>
    );
  };

  const renderAttemptItem = ({item, index}, totalAttempts) => {
    const attemptDate = moment(item.created_date).format('DD MMM, YYYY');
    const scorePercentage = (item.marks / item.total) * 100;
    const scoreColor =
      scorePercentage >= 70
        ? '#4CAF50'
        : scorePercentage >= 50
        ? '#FF9800'
        : '#F44336';

    // Array of light pastel colors for alternating attempt cards
    const cardColors = ['#F0F8FF', '#F0FFF0', '#FFF0F5', '#F5F5DC', '#E6E6FA'];
    const cardColor = cardColors[index % cardColors.length];

    return (
      <TouchableOpacity
        style={[styles.attemptCard, {backgroundColor: cardColor}]}
        onPress={() =>
          navigation.navigate(ROUTES.MARKS_DETAILS, {
            attempt_id: item.attempt_id,
            module_id: item.module_id,
          })
        }>
        <View style={styles.attemptHeader}>
          <Text style={styles.attemptNumber}>
            Attempt #{attempts.length - index}
          </Text>
          <Text style={styles.attemptDate}>{attemptDate}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={[styles.scoreCircle, {backgroundColor: '#FFFFFF'}]}>
            <Text style={[styles.scoreValue, {color: scoreColor}]}>
              {item.marks}
            </Text>
            <Text style={styles.scoreTotal}>/{item.total}</Text>
          </View>

          <View style={styles.scoreDetails}>
            <Text style={styles.scorePercentage}>
              {scorePercentage.toFixed(0)}%
            </Text>
            <View
              style={[
                styles.scoreBar,
                {width: '100%', backgroundColor: '#E8E8E8'},
              ]}>
              <View
                style={[
                  styles.scoreProgress,
                  {
                    width: `${scorePercentage}%`,
                    backgroundColor: scoreColor,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.viewDetailsButton, {backgroundColor: '#8A6BFF'}]}
          onPress={() =>
            navigation.navigate(ROUTES.MARKS_DETAILS, {
              attempt_id: item.attempt_id,
              module_id: item.module_id,
            })
          }>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <ScrollView style={{flex: 1, backgroundColor: '#FFF'}}>
        <View className="relative pb-8">
          <View className="absolute w-full top-0 left-0 right-0">
            <Image
              source={topBgBackground}
              className="w-full h-[200px] -mt-24"
            />
          </View>
          <PageTitle pageName={'Results'} />
        </View>

        {marksComponent()}

        {/* Share Button */}
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.shareButton}>
          <TouchableOpacity
            hitSlop={{x: 25, y: 15}}
            onPress={captureAndShareScreenshot}>
            <Text style={styles.shareText}>Share & Challenge Friends</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Attempt History Section */}
        <View style={styles.attemptsContainer}>
          <Text style={styles.attemptsTitle}>Attempt History</Text>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#613BFF" />
              <Text style={styles.loadingText}>Loading attempts...</Text>
            </View>
          ) : attempts && attempts.length > 0 ? (
            <FlatList
              data={attempts}
              renderItem={({item, index}) =>
                renderAttemptItem({item, index}, attempts.length)
              }
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.attemptsList}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.noAttemptsContainer}>
              <Text style={styles.noAttemptsText}>No attempts found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal for No Data */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>No data available.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Certificate;

const styles = StyleSheet.create({
  certificateCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    marginTop: 10,
  },
  border: {
    borderColor: '#d4af37',
    borderWidth: 4,
    padding: 10,
    borderRadius: 10,
    position: 'relative',
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#613BFF', // Use primary color
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'sans-serif-medium',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  certificateTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    textTransform: 'uppercase',
    marginBottom: 10,
    fontFamily: 'serif',
  },

  examDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    fontFamily: 'sans-serif',
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    fontFamily: 'sans-serif',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'serif',
    textTransform: 'capitalize',
  },
  answersContainer: {
    width: '95%',
    marginTop: 10,
    padding: 10,
    backgroundColor: color.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  answersTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#613BFF', // Use primary color
  },
  answerCard: {
    marginBottom: 20,
    padding: 15,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  questionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentAnswer: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  scoreSection: {
    backgroundColor: '#f0f5ff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#cce0ff',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    fontFamily: 'sans-serif',
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#613BFF', // Use primary color
    fontFamily: 'serif',
  },
  teacherAnswer: {
    fontSize: 16,
    color: color.black,
    marginTop: 5,
  },
  answerType: {
    fontWeight: 'bold',
    color: color.black,
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: '#613BFF', // Use primary color
    padding: 15,
    borderRadius: 30,
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signatureSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  signatureLine: {
    width: 150,
    height: 1,
    backgroundColor: '#000',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 14,
    color: '#555',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    marginBottom: 20,
    color: '#fff',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#613BFF', // Use primary color
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  topLeftlottieStyle: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 0,
    left: 0,
  },
  topRightlottieStyle: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 0,
    right: 0,
  },
  bottomLeftlottieStyle: {
    position: 'absolute',
    width: 200,
    height: 200,
    bottom: 0,
    left: 0,
  },
  bottomRightlottieStyle: {
    position: 'absolute',
    width: 200,
    height: 200,
    bottom: 0,
    right: 0,
  },
  // New styles for attempts history
  attemptsContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: 15,
  },
  attemptsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#613BFF',
    textAlign: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  attemptsList: {
    paddingVertical: 5,
  },
  attemptCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  attemptNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  attemptDate: {
    fontSize: 14,
    color: '#666',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scoreTotal: {
    fontSize: 16,
    color: '#666',
  },
  scoreDetails: {
    flex: 1,
    marginLeft: 15,
  },
  scorePercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  viewDetailsButton: {
    backgroundColor: '#613BFF',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  viewDetailsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loaderContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noAttemptsContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAttemptsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#613BFF',
  },
});
