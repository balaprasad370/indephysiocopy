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
} from 'react-native';
import ViewShot,{captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../assets/logo.png';
import color from '../../Constants/color';

const Certificate = ({route}) => {
  const viewShotRef = useRef();
  const {module_id} = route.params;

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

  useEffect(() => {
    const fetchMarks = async () => {
      const token = await storage.getStringAsync('token');
      try {
        const response = await axios.get(`${path}/student/score`, {
          params: {
            module_id,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setMarks(response.data?.result?.marks);
        setDate(response.data?.result?.modified_date);
        setTotal(response.data?.result?.total);
      } catch (error) {
        console.log('Error fetching marks:', error);
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
  }, [module_id]);

  const captureAndShareScreenshot = () => {
 
    try {
    captureRef(viewShotRef, {
      format: 'png',
      quality: 0.9,
    }).then(uri => {

      Share.open({
        url: uri,
        type: 'image/png',
          message: `Hey, I just completed the German Language Quiz and earned my certificate! 🎓 I’d love for you to join me—install MedUniverse now and start your learning journey today!
                  \n\n Download here: \n
                  📱 Android : https://play.google.com/store/apps/details?id=com.inde.physio \n
                  🍎 iOS : https://apps.apple.com/us/app/meduniverse/id6736482857`,
        subject: 'Results',
      });
    });
  } catch (error) {
    console.log('Error capturing and sharing screenshot:', error);
  }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <ScrollView style={{flex: 1, backgroundColor: '#FFF'}}>
        <View style={style.marksContainer}>
          <ViewShot ref={viewShotRef} options={{format: 'png', quality: 0.9}} style={{
            width: '95%',
          }}>
            <LinearGradient
              colors={['#2A89C6', '#3397CB', '#0C5CB4']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.certificateCard}>
              <View style={styles.border}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.certificateTitle}>
                🎉 Results Are In!
                </Text>
                <View style={styles.decorativeLine} />
                <Text style={{fontSize: 20 , textAlign: 'center', color: '#0056b3', fontWeight: 'bold', fontFamily: 'serif'}}>
                Congratulations
                </Text>
                <Text style={styles.studentName}>
                  {userData?.first_name} {userData?.last_name}
                  </Text>
         
                <Text style={styles.descriptionText}>
                  on successfully completing the
                </Text>
                <Text style={styles.examTitle}>German Language Quiz Exam </Text>

                <View style={styles.scoreSection}>
                  <Text style={styles.scoreLabel}>Score:</Text>
                  <Text style={styles.score}>
                    {marks !== null ? `${marks} / ${total}` : 'Loading...'}
                  </Text>
                </View>
                <Text style={styles.date}>
                  Date: {new Date(date).toLocaleDateString()}
                </Text>

                {/* <View style={styles.signatureSection}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureText}>Authorized Signature</Text>
                </View> */}
              </View>
            </LinearGradient>
          </ViewShot>

          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareButton}
            hitSlop={{x: 25, y: 15}}
            onPress={captureAndShareScreenshot}>
            <Text style={styles.shareText}>Share Certificate</Text>
          </TouchableOpacity>
          {studentAnswers && (
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

              {/* Conditionally Render All Questions or Wrong Answers */}
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

                      {/* Student Answer */}
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

                      {/* Teacher Answer */}
                      <Text style={styles.teacherAnswer}>
                        <Text style={styles.answerType}>Teacher Answer: </Text>
                        {teacherAnswers[key] || 'Not available'}
                      </Text>
                    </View>
                  );
                })}
            </View>
          )}
        </View>
      </ScrollView>
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
    // maxWidth: 400,
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
    color: '#0056b3',
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

    color: '#0056b3',
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
    color: '#0056b3',
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
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 30,
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
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
});
