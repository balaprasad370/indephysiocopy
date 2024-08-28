import {
  Alert,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import color from '../../Constants/color';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import {styles} from './QuizStyle';
import {TextInput} from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import AudioComponent from './AudioComponent';
import {AppContext} from '../../theme/AppContext';

const QuizModal = ({modalVisible, setModalVisible, toggleModal}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState([]);
  const closeModal = () => {
    Alert.alert(
      'Exit Quiz',
      'Are you sure you want to exit the quiz?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setSelectedOption(null);
            setQuestionIndex(0);
            setScore(0);
            setModalVisible(false);
          },
        },
      ],
      {cancelable: false},
    );
  };

  // Audio module Id - 58 -> Ongoing
  // Fill in the blanks module id - 126 -> Completed
  // Normal module id - 130 - > Completed
  // True false Module id - 72 - > Completed
  const getDetails = async () => {
    await axios
      .post('https://server.indephysio.com/questions/details', {
        module_id: 130,
      })
      .then(res => setQuestion(res.data))
      .catch(error => console.log('error', error));
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const handleNext = () => {
    if (questionIndex >= question.length - 1) {
      return;
    }

    if (sound) {
      sound.pause();
    }

    setIsPlaying(false);
    setQuestionIndex(prevIndex => prevIndex + 1);
  };
  // important if save in the database score for particular test after that score will be changed to zero
  const submitNow = () => {
    setSelectedOption(null);
    setQuestionIndex(0);
    if (sound) {
      sound.pause();
    }
    setIsPlaying(false);
    Alert.alert('Quiz Completed', `You have completed the quiz! ${score}`);
    setModalVisible(false);
  };
  const handlePrev = () => {
    if (questionIndex <= 0) {
      setSelectedOption(null);
      return;
    }
    if (sound) {
      sound.pause();
    }
    setQuestionIndex(prevIndex => prevIndex - 1);
    setIsPlaying(false);
    setSelectedOption(null);
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const handleOptionSelect = (option, optionKeys, correctAnswerIndex) => {
    const result = optionKeys.replace(/\D/g, '');
    setSelectedOption(option);
    if (result === correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const renderOptions = options => {
    const optionKeys = ['option1', 'option2', 'option3', 'option4'];

    return (
      <View style={styled.options}>
        {optionKeys.map((key, index) => {
          if (options[key] !== null) {
            const isSelected = selectedOption === options[key];
            return (
              <TouchableOpacity
                key={index}
                style={[styled.optionBtn, isSelected && styled.selectedOption]}
                onPress={() =>
                  handleOptionSelect(
                    options[key],
                    optionKeys[index],
                    options.correctAnswerIndex,
                  )
                }>
                <Text style={styled.optionText}>{options[key]}</Text>

                <View
                  style={
                    isSelected ? styled.selectOptionRound : styled.optionRound
                  }>
                  {isSelected && (
                    <Icon name="check" style={{fontSize: 16, color: 'white'}} />
                  )}
                </View>
              </TouchableOpacity>
            );
          }
          return null;
        })}
      </View>
    );
  };

  const [countdown, setCountdown] = useState(200);
  const endTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  const updateCountdown = useCallback(() => {
    if (!endTimeRef.current) return;

    const currentTime = Date.now();
    const remainingTime = Math.max(
      0,
      Math.floor((endTimeRef.current - currentTime) / 1000),
    );

    setCountdown(remainingTime);

    if (remainingTime === 0) {
      cancelAnimationFrame(animationFrameRef.current);
      setSelectedOption(null);
      setQuestionIndex(0);
      setModalVisible(false);
    } else {
      animationFrameRef.current = requestAnimationFrame(updateCountdown);
    }
  }, [setSelectedOption, setQuestionIndex, setModalVisible]);

  const startCountdown = () => {
    endTimeRef.current = Date.now() + 200 * 1000;
    animationFrameRef.current = requestAnimationFrame(updateCountdown);
  };

  if (modalVisible && !endTimeRef.current) {
    startCountdown();
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const [inputWidth, setInputWidth] = useState(50);

  const handleContentSizeChange = e => {
    const newWidth = Math.max(50, e.nativeEvent.contentSize.width);
    setInputWidth(newWidth);
  };

  const [inputValue, setInputValue] = useState('');

  const renderQuestionWithBlanks = (
    questionText,
    correctAnswerIndex,
    index,
  ) => {
    const parts = questionText.split('_');
    return (
      <>
        <Text style={styled.quiztitle}>{parts[0]}</Text>
        <TextInput
          style={{
            width: 90,
            marginLeft: 5,
            marginRight: 5,
            borderBottomWidth: 1,
            borderBlockColor: color.black,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: 14,
            textAlign: 'center',
          }}
          placeholder="type answer"
          onChangeText={text =>
            handleTextInput(text, correctAnswerIndex, index)
          }
          value={inputValue}
        />

        <Text style={[styled.quiztitle, {marginTop: 5}]}>
          {parts[parts.length - 1]}
        </Text>
      </>
    );
  };

  const [correctness, setCorrectness] = useState({});

  const handleTextInput = (input, answer, index) => {
    const normalizedInput = input.toLowerCase();
    const normalizedAnswer = answer.toLowerCase();

    const isCorrect = normalizedInput === normalizedAnswer;

    setInputValue(prevValues => ({
      ...prevValues,
      [index]: input,
    }));

    setCorrectness(prevCorrectness => {
      const prevIsCorrect = prevCorrectness[index] || false;

      if (isCorrect && !prevIsCorrect) {
        setScore(prevScore => {
          const newScore = prevScore + 1;
          console.log('score', newScore);
          return newScore;
        });
      } else if (!isCorrect && prevIsCorrect) {
        setScore(prevScore => {
          const newScore = prevScore - 1;
          console.log('score', newScore);
          return newScore;
        });
      }

      return {
        ...prevCorrectness,
        [index]: isCorrect,
      };
    });
  };

  const getTotalQuestionsCount = questions => {
    let count = 0;
    questions.forEach(question => {
      if (question.subQuestions && question.subQuestions.length > 0) {
        count += question.subQuestions.length;
      } else {
        count += 1;
      }
    });
    return count;
  };

  const [sound, setSound] = useState(null);
  const pauseAudio = () => {
    if (sound) {
      sound.pause();
      setIsPlaying(false);
    }
  };

  const totalQuestionsCount = getTotalQuestionsCount(question);
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styled.upperModal}>
            <View style={styled.upperInside}>
              <TouchableOpacity style={styled.leftIcon} onPress={closeModal}>
                <Icon
                  name="left"
                  style={{fontSize: 24, color: 'white', fontWeight: '700'}}
                />
              </TouchableOpacity>
              <Text style={styled.modalQuizText}>Language Quiz</Text>
            </View>
            <View>
              <Text style={styled.leftQuestion}>
                {minutes} min {seconds < 10 ? `0${seconds}` : seconds} sec
              </Text>
            </View>
          </View>
          <LinearGradient
            colors={[color.black, color.black, color.lowPrimary]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styled.completeStatus}
          />
          <View style={styled.quizContent}>
            <ScrollView>
              {question.slice(questionIndex, questionIndex + 1).map(item => (
                <View key={item.id}>
                  <Text style={styled.quizContentCount}>
                    Question {questionIndex + 1}/{totalQuestionsCount}
                    {/* Question {quesxftionIndex + 1}/{question.length} */}
                  </Text>
                  {item.imageURL && (
                    <Image
                      src={`https://server.indephysio.com/${item.imageURL}`}
                      style={{width: '100%', height: 200, marginBottom: 10}}
                    />
                  )}
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}>
                    {item.type === 'TextNormal' ? (
                      renderQuestionWithBlanks(
                        item.question,
                        item.correctAnswerIndex,
                        item.id,
                      )
                    ) : item.type === 'Audio' ? (
                      <>
                        <AudioComponent
                          isPlaying={isPlaying}
                          setIsPlaying={setIsPlaying}
                          sound={sound}
                          setSound={setSound}
                          pauseAudio={pauseAudio}
                          audioURL={item.audioURL}
                        />
                        {/* <Text>helo</Text> */}
                      </>
                    ) : (
                      <Text style={styled.quiztitle}>{item.question}</Text>
                    )}
                  </View>
                  {renderOptions(item)}
                  {item.subQuestions &&
                    item.subQuestions.map(subQuestion => (
                      <View key={subQuestion.id}>
                        {/* main content */}
                        {/* <Text style={styled.quiztitle}>
                        {subQuestion.question}
                      </Text> */}
                        <View
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                          }}>
                          {subQuestion.type === 'TextNormal' ? (
                            <>
                              {renderQuestionWithBlanks(
                                subQuestion.question,
                                subQuestion.correctAnswerIndex,
                                subQuestion.id,
                              )}
                            </>
                          ) : subQuestion.type === 'Audio' ? (
                            <>
                              <AudioComponent
                                isPlaying={isPlaying}
                                setIsPlaying={setIsPlaying}
                                sound={sound}
                                setSound={setSound}
                                pauseAudio={pauseAudio}
                                audioURL={subQuestion.audioURL}
                              />
                            </>
                          ) : (
                            <Text style={styled.quiztitle}>
                              {subQuestion.question}
                            </Text>
                          )}
                        </View>
                        {/* {subQuestion.type === 'TextNormal' ? (
                        <TextInput placeholder="type your answer" />
                      ) : null} */}
                        {renderOptions(subQuestion)}
                      </View>
                    ))}
                </View>
              ))}
            </ScrollView>
            {question.length >= 2 ? (
              <View style={styled.bottomButton}>
                <TouchableOpacity style={styled.nextBtn} onPress={handlePrev}>
                  <Text style={styled.nextBtnText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styled.nextBtn} onPress={handleNext}>
                  <Text style={styled.nextBtnText}>
                    Next
                    {/* {questionIndex < question.length - 1 ? 'Next' : 'Submit'} */}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View>
              <TouchableOpacity style={styled.submittBtn} onPress={submitNow}>
                <Text style={styled.nextBtnText}>Submit Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QuizModal;

const styled = StyleSheet.create({
  upperModal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3%',
  },

  upperInside: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: color.darkPrimary,
  },
  completeStatus: {
    width: '100%',
    height: 4,
    borderRadius: 10,
  },
  leftIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    backgroundColor: color.lowPrimary,
    borderRadius: 8,
  },
  modalQuizText: {
    fontSize: 20,
    marginLeft: 8,
    color: 'black',
    fontWeight: 'bold',
  },
  quizContent: {
    height: '90%',
    padding: '3%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  quizContentCount: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 8,
  },
  quiztitle: {
    fontSize: 17,
    textAlign: 'justify',
    color: 'black',
    fontWeight: '600',
  },
  linearBox: {
    padding: 10,
    borderRadius: 8,
  },
  bottomButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextBtn: {
    width: '45%',
    backgroundColor: color.darkPrimary,
    borderRadius: 10,
    padding: 8,
  },
  submittBtn: {
    marginTop: 8,
    backgroundColor: color.darkPrimary,
    borderRadius: 10,
    padding: 8,
  },
  nextBtnText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  optionRound: {
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'grey',
  },
  optionBtn: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '500',
    width: '94%',
  },
  options: {
    marginBottom: 15,
  },
  selectedOption: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    backgroundColor: color.lowPrimary,
  },
  selectOptionRound: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: color.darkPrimary,
    backgroundColor: color.darkPrimary,
  },
});
