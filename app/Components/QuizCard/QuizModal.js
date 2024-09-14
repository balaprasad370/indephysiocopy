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
import scale from '../../utils/utils';

const QuizModal = ({
  modalVisible,
  setModalVisible,
  toggleModal,
  module_id,
  quizModal,
  title,
}) => {
  const {path, grandScore, setGrandScore} = useContext(AppContext);

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
      .post(`${path}/questions/details`, {
        module_id: module_id,
      })
      .then(res => {
        console.log(res.data);
        setQuestion(res.data);
      })

      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    if (quizModal) {
      console.log('called');
      getDetails();
    }
  }, [quizModal]);

  const [isPlaying, setIsPlaying] = useState(false);
  const handleNext = () => {
    if (questionIndex >= question.length - 1) {
      return;
    }

    if (sound) {
      sound.pause();
    }
    setSelectedOption(null);
    setIsPlaying(false);
    setQuestionIndex(prevIndex => prevIndex + 1);
  };
  // important if save in the database score for particular test after that score will be changed to zero
  const submitNow = () => {
    // setSelectedOption(null);
    // setQuestionIndex(0);
    if (sound) {
      sound.pause();
    }

    setGrandScore(score);
    setScore(0);

    setIsPlaying(false);
    Alert.alert(
      'Quiz Completed',
      `You have completed the quiz! ${score}  ${grandScore}`,
    );
    // setModalVisible(false);
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
    console.log(selectedOption);
    if (result === correctAnswerIndex) {
      setScore(score => score + 1);
      console.log(grandScore, score);
    }
  };

  const [selectedIndex, setSelectedIndex] = useState(null);

  const renderOptions = options => {
    const optionKeys = ['option1', 'option2', 'option3', 'option4'];

    return (
      <View style={styled.options}>
        {optionKeys.map((key, index) => {
          if (options[key] !== null) {
            const isSelected = selectedOption === options[key];
            return (
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
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
                <Text></Text>
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
            // width: 90,
            marginLeft: scale(4),
            marginRight: scale(4),
            borderBottomWidth: scale(1),
            borderBlockColor: color.black,
            paddingLeft: scale(4),
            paddingRight: scale(4),
            fontSize: 14,
            textAlign: 'center',
          }}
          placeholder="type answer"
          onChangeText={text =>
            handleTextInput(text, correctAnswerIndex, index)
          }
          value={inputValue}
        />

        <Text style={[styled.quiztitle, {marginTop: scale(4)}]}>
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
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
                style={styled.leftIcon}
                onPress={closeModal}>
                <Icon
                  name="left"
                  style={{fontSize: 24, color: 'white', fontWeight: '700'}}
                />
              </TouchableOpacity>
              <Text style={styled.modalQuizText}>{title}</Text>
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
            <ScrollView showsVerticalScrollIndicator={false}>
              {question.slice(questionIndex, questionIndex + 1).map(item => (
                <View key={item.id}>
                  <Text style={styled.quizContentCount}>
                    Question {questionIndex + 1}/{totalQuestionsCount}
                    {/* Question {quesxftionIndex + 1}/{question.length} */}
                  </Text>
                  <Text>
                    {item.id}
                    {module_id}
                  </Text>
                  {item.imageURL && (
                    <>
                      <Image
                        // https://d2c9u2e33z36pz.cloudfront.net/
                        src={`https://d2c9u2e33z36pz.cloudfront.net/${item.imageURL}`}
                        style={{width: '100%', height: 200, marginBottom: 10}}
                      />
                    </>
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

                        {renderOptions(subQuestion)}
                      </View>
                    ))}
                </View>
              ))}
            </ScrollView>
            {question.length >= 2 ? (
              <View style={styled.bottomButton}>
                <TouchableOpacity
                  hitSlop={{x: 25, y: 15}}
                  style={
                    questionIndex === 0 ? styled.nextBtnLeft : styled.nextBtn
                  }
                  onPress={handlePrev}>
                  <Text style={styled.nextBtnText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={{x: 25, y: 15}}
                  style={
                    questionIndex + 1 === totalQuestionsCount
                      ? styled.nextBtnLeft
                      : styled.nextBtn
                  }
                  onPress={handleNext}>
                  <Text style={styled.nextBtnText}>Next</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View>
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
                style={styled.submittBtn}
                onPress={submitNow}>
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
    fontSize: scale(14),
    fontWeight: '600',
    color: color.darkPrimary,
  },
  completeStatus: {
    width: '100%',
    height: scale(2),
    borderRadius: scale(10),
  },
  leftIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(28),
    height: scale(28),
    backgroundColor: color.lowPrimary,
    borderRadius: scale(8),
  },
  modalQuizText: {
    fontSize: scale(18),
    marginLeft: scale(7),
    color: 'black',
    fontWeight: 'bold',
  },
  quizContent: {
    height: '92%',
    padding: '3%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  quizContentCount: {
    fontSize: scale(13),
    fontWeight: '400',
    marginBottom: scale(6),
  },
  quiztitle: {
    fontSize: scale(14),
    textAlign: 'justify',
    color: 'black',
    fontWeight: '500',
  },
  linearBox: {
    padding: scale(8),
    borderRadius: scale(8),
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
    borderRadius: scale(10),
    padding: scale(6),
  },
  nextBtnLeft: {
    width: '45%',
    backgroundColor: color.grey,
    borderRadius: scale(10),
    padding: scale(6),
  },
  submittBtn: {
    marginTop: scale(8),
    backgroundColor: color.darkPrimary,
    borderRadius: scale(10),
    padding: scale(6),
  },
  nextBtnText: {
    fontSize: scale(16),
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },
  optionRound: {
    width: scale(21),
    height: scale(21),
    borderRadius: scale(50),
    borderWidth: 1,
    borderColor: 'grey',
  },
  optionBtn: {
    marginTop: scale(10),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: scale(10),
    paddingLeft: scale(8),
    paddingRight: scale(8),
    paddingBottom: scale(10),
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: scale(8),
  },
  optionText: {
    fontSize: scale(15),
    fontWeight: '500',
    width: '94%',
  },
  options: {
    marginBottom: scale(12),
  },
  selectedOption: {
    marginTop: scale(10),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: scale(10),
    paddingLeft: scale(8),
    paddingRight: scale(8),
    paddingBottom: scale(10),
    borderWidth: 1,
    borderColor: color.grey,
    borderRadius: scale(8),
    backgroundColor: color.lowPrimary,
  },
  selectOptionRound: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(21),
    height: scale(21),
    borderRadius: scale(50),
    borderWidth: 1,
    borderColor: color.darkPrimary,
    backgroundColor: color.darkPrimary,
  },
});

const data = [
  {
    audioURL: null,
    correctAnswerIndex: null,
    id: 492,
    imageCredits: 'cornelson',
    imageURL: 'uploads/1719883034SCR-20240702-luvk.png',
    jumbledAnswerOrder: null,
    jumbledQuestionOrder: null,
    moduleId: 77,
    option1: null,
    option2: null,
    option3: null,
    option4: null,
    question: 'Welches Wort ist richtig?',
    questionCreatedDate: '0000-00-00 00:00:00',
    questionModifiedDate: '0000-00-00 00:00:00',
    subQuestions: [[Object], [Object], [Object], [Object], [Object]],
    type: 'MultiQuestionsImage',
  },
];
