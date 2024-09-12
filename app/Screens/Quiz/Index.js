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

import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import IconTimer from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../../Components/QuizCard/QuizStyle';
import {TextInput} from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import AudioComponent from '../../Components/QuizCard/AudioComponent';
import scale from '../../utils/utils';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import storage from '../../Constants/storage';

const Index = ({route}) => {
  const {module_id, title} = route.params;
  const {path, grandScore, setGrandScore, userData} = useContext(AppContext);
  const navigation = useNavigation();

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
            if (sound) {
              sound.pause();
            }
            setScore(0);
            navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  // const [correctAnswers, setCorrectAnswers] = useState([]);
  // Audio module Id - 58 -> Ongoing
  // Fill in the blanks module id - 126 -> Completed
  // Normal module id - 130 - > Completed
  // True false Module id - 72 - > Completed

  const [correctAnswers, setCorrectAnswers] = useState({});

  const getDetails = async () => {
    await axios
      .post(`http://${path}:4000/questions/details`, {
        module_id: 279,
      })
      .then(res => {
        const correctAnswerIndices = {};
        res.data.forEach(item => {
          if (item.subQuestions && item.subQuestions.length > 0) {
            item.subQuestions.forEach(subQuestion => {
              correctAnswerIndices[subQuestion.id] =
                subQuestion.correctAnswerIndex;
            });
          } else {
            correctAnswerIndices[item.id] = item.correctAnswerIndex;
          }
        });
        console.log('Correct Answer Indices:', correctAnswerIndices);
        setCorrectAnswers(correctAnswerIndices);
        setQuestion(res.data);
      })
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    getDetails();
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const handleNext = () => {
    if (questionIndex >= question.length - 1) {
      return;
    }

    if (sound) {
      sound.pause();
    }
    console.log('Score', score);
    setSelectedOption(null);
    setIsPlaying(false);
    setIsAttempted(false);
    setQuestionIndex(prevIndex => prevIndex + 1);
  };
  const submitNow = async () => {
    const token = await storage.getStringAsync('token');
    setSelectedOption(null);
    setQuestionIndex(0);

    if (sound) {
      sound.pause();
    }
    const newScore = score == 0 ? 0 : score;
    try {
      await axios.post(
        `http://${path}:4000/student/saveMarks`,
        {
          student_id: userData?.student_id,
          module_id: module_id,
          marks: newScore,
          total: question.length,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setScore(0);
      setIsPlaying(false);
      setIsAttempted(false);
      navigation.goBack();
      console.log('Marks saved successfully');
    } catch (error) {
      console.log('Error saving marks:', error.message);
    }
  };

  const handlePrev = () => {
    if (questionIndex <= 0) {
      setSelectedOption(null);
      setSelectedOptions(null);
      return;
    }
    if (sound) {
      sound.pause();
    }

    setQuestionIndex(prevIndex => prevIndex - 1);
    setIsPlaying(false);
    setIsAttempted(false);
    setSelectedOption(null);
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const [isAttempted, setIsAttempted] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // Object to store selected options for each question/subquestion

  const handleOptionSelect = (
    selectedIndex,
    optionKey,
    correctAnswerIndex,
    number,
    id,
  ) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [id]: selectedIndex,
    }));
    setAttemptedQuestions(prev => [...prev, questionIndex]);
  };

  const handleOptionTrueSelect = (selectedIndex, questionNumber) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionNumber]: selectedIndex,
    }));
    setAttemptedQuestions(prev => [...prev, questionIndex]);
  };
  useEffect(() => {
    if (
      Object.keys(correctAnswers).length > 0 &&
      Object.keys(selectedOptions).length > 0
    ) {
      let score = 0;
      Object.keys(selectedOptions).forEach(id => {
        if (selectedOptions[id] == correctAnswers[id]) {
          score += 1;
        }
      });

      setScore(score);
      console.log(`Score updated: ${score}`);
    }
  }, [selectedOptions, correctAnswers]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const renderOptions = (options, number, id) => {
    const optionKeys = ['option1', 'option2', 'option3', 'option4'];

    return (
      <View style={styled.options}>
        {optionKeys.map((key, index) => {
          if (options[key] !== null && options[key] !== '.') {
            const isSelected = selectedOptions[id] === index + 1;
            return (
              <TouchableOpacity
                key={index}
                style={[styled.optionBtn, isSelected && styled.selectedOption]}
                onPress={() =>
                  handleOptionSelect(
                    index + 1,
                    optionKeys[index],
                    options.correctAnswerIndex,
                    number,
                    id,
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

  const renderTrueFalse = (options, id) => {
    const labels = ['True', 'False']; // Labels for the true/false options
    const correctAnswerIndex = options.correctAnswerIndex; // Assuming the correct answer index is either 1 or 2

    return (
      <View style={styled.options}>
        {labels.map((label, index) => {
          const isSelected = selectedOptions[id] === index + 1; // Check if the selected option matches the index (1 for True, 2 for False)
          return (
            <TouchableOpacity
              key={index}
              style={[styled.optionBtn, isSelected && styled.selectedOption]}
              onPress={() => handleOptionTrueSelect(index + 1, id)}>
              <Text style={styled.optionText}>{label}</Text>
              {/* Display True or False */}
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
    } else {
      animationFrameRef.current = requestAnimationFrame(updateCountdown);
    }
  }, [setSelectedOption, setQuestionIndex]);

  const startCountdown = () => {
    endTimeRef.current = Date.now() + 200 * 1000;
    animationFrameRef.current = requestAnimationFrame(updateCountdown);
  };

  if (!endTimeRef.current) {
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

  // const renderQuestionWithBlanks = (
  //   questionText,
  //   correctAnswerIndex,
  //   index,
  //   type,
  //   audioURL,
  //   quesIndex,
  // ) => {
  //   const parts = questionText.split('_');
  //   return (
  //     <>
  //       <Text>{questionText}</Text>
  //       <Text style={styled.quiztitle}>
  //         Q{quesIndex}) {parts[0]}
  //       </Text>
  //       {parts.length > 1 && (
  //         <>
  //           <TextInput
  //             style={{
  //               marginLeft: scale(4),
  //               marginRight: scale(4),
  //               borderBottomWidth: scale(1),
  //               borderBlockColor: color.black,
  //               paddingLeft: scale(4),
  //               paddingRight: scale(4),
  //               fontSize: 14,
  //               textAlign: 'center',
  //             }}
  //             placeholder="type answer"
  //             onChangeText={text =>
  //               handleTextInput(text, correctAnswerIndex, index)
  //             }
  //             value={inputValue}
  //           />
  //           <Text style={[styled.quiztitle, {marginTop: scale(4)}]}>
  //             {parts[parts.length - 1]}
  //           </Text>
  //           {type === 'TextAudio' && (
  //             <AudioComponent
  //               isPlaying={isPlaying}
  //               setIsPlaying={setIsPlaying}
  //               sound={sound}
  //               setSound={setSound}
  //               pauseAudio={pauseAudio}
  //               audioURL={audioURL}
  //             />
  //           )}
  //         </>
  //       )}
  //     </>
  //   );
  // };
  const renderQuestionWithBlanks = (
    questionText,
    correctAnswerIndex,
    questionId,
    questionType,
    audioURL,
    quesIndex,
  ) => {
    const parts = questionText.split('_');

    return (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            width: '100%',
          }}>
          <Text style={[styled.quiztitle, {flexShrink: 1}]}>
            Q{quesIndex}) {parts[0]}
          </Text>

          {parts.length > 1 && (
            <>
              <TextInput
                style={{
                  marginLeft: scale(4),
                  marginRight: scale(4),
                  borderBottomWidth: scale(1),
                  borderColor: color.black,
                  paddingLeft: scale(4),
                  width: 100,
                  paddingRight: scale(4),
                  fontSize: 14,
                  textAlign: 'center',
                }}
                placeholder="Type answer"
                onChangeText={text =>
                  handleTextInput(text, correctAnswerIndex, questionId)
                }
                value={inputValue[questionId] || ''}
              />

              <Text
                style={[
                  styled.quiztitle,
                  {flexShrink: 1, marginTop: scale(4)},
                ]}>
                {parts.slice(1)}
              </Text>
            </>
          )}
        </View>

        {questionType === 'TextAudio' && (
          <AudioComponent
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            sound={sound}
            setSound={setSound}
            pauseAudio={pauseAudio}
            audioURL={audioURL}
          />
        )}
      </View>
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
          return newScore;
        });
      } else if (!isCorrect && prevIsCorrect) {
        setScore(prevScore => {
          const newScore = prevScore - 1;
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
      if (
        question.subQuestion &&
        question.subQuestions &&
        question.subQuestions.length > 0
      ) {
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
  const renderQuestionStatus = () => {
    return question.map((_, index) => (
      <View
        key={index}
        style={{
          width: 9,
          margin: 4,
          height: 9,
          borderRadius: 8,
          backgroundColor: attemptedQuestions.includes(index)
            ? 'grey'
            : 'white',
          borderColor: 'black',
          borderWidth: 1,
        }}
      />
    ));
  };

  const renderImage = useCallback(
    url => (
      <Image
        source={{uri: `https://d2c9u2e33z36pz.cloudfront.net/${url}`}}
        style={{
          width: '100%',
          height: 200,
          marginBottom: 10,
        }}
        resizeMode="contain"
      />
    ),
    [],
  );

  const renderQuestionContent = useCallback(
    item => {
      switch (item.type) {
        case 'TextNormal':
        case 'TextImage':
        case 'TextAudio':
          return (
            <>
              {renderQuestionWithBlanks(
                item.question,
                item.correctAnswerIndex,
                item.id,
                item.type,
                item.audioURL,
                questionIndex + 1,
              )}
              {item.imageURL && renderImage(item.imageURL)}
            </>
          );

        case 'Audio':
        case 'MultiQuestionsAudio':
          return (
            <>
              <Text style={styled.quiztitle}>
                Q: {questionIndex + 1} {item.question}
              </Text>
              <AudioComponent
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                sound={sound}
                setSound={setSound}
                pauseAudio={pauseAudio}
                audioURL={item.audioURL}
              />
              {renderOptions(item, questionIndex, item.id)}
            </>
          );

        case 'TrueFalse':
          return (
            <>
              <Text style={styled.quiztitle}>
                Q{questionIndex + 1}) {item.question}
              </Text>
              <Text>{item.id}</Text>
              {item.imageURL && renderImage(item.imageURL)}
              {renderTrueFalse(item, item.id)}
            </>
          );
        case 'Record':
          return (
            <>
              <Text style={styled.quiztitle}>
                Q{questionIndex + 1}) {item.question}
              </Text>
              <Text>Helo</Text>
            </>
          );
        default:
          return (
            <>
              <Text style={styled.quiztitle}>
                Q{questionIndex + 1}) {item.question}
              </Text>
              {item.imageURL && renderImage(item.imageURL)}
              {renderOptions(item, questionIndex, item.id)}
            </>
          );
      }
    },
    [questionIndex, isPlaying, setIsPlaying, sound, setSound, pauseAudio],
  );

  const renderSubQuestions = useCallback(
    subQuestion => (
      <View key={subQuestion.id} style={styled.subQuestionContainer}>
        {/* <Text style={styled.quiztitle}>{subQuestion.question}</Text> */}

        {(subQuestion.type === 'TextImage' ||
          subQuestion.type === 'TextNormal' ||
          subQuestion.type === 'TextAudio' ||
          subQuestion.type === 'Text') && (
          <>
            {renderQuestionWithBlanks(
              subQuestion.question,
              subQuestion.correctAnswerIndex,
              subQuestion.id,
              subQuestion.type,
              subQuestion.audioURL,
              questionIndex + 1,
            )}
            {subQuestion.imageURL && renderImage(subQuestion.imageURL)}
          </>
        )}

        {subQuestion.type === 'Audio' && (
          <>
            <Text style={styled.quiztitle}>{subQuestion.question}</Text>
            {subQuestion.imageURL && renderImage(subQuestion.imageURL)}
            <AudioComponent
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              sound={sound}
              setSound={setSound}
              pauseAudio={pauseAudio}
              audioURL={subQuestion.audioURL}
            />
          </>
        )}

        {(subQuestion.type === 'Image' ||
          subQuestion.type === 'Normal' ||
          subQuestion.type === 'TrueFalse') && (
          <>
            <Text style={styled.quiztitle}>{subQuestion.question}</Text>
            {subQuestion.imageURL && renderImage(subQuestion.imageURL)}
          </>
        )}

        {renderOptions(subQuestion, questionIndex, subQuestion.id)}
      </View>
    ),
    [isPlaying, setIsPlaying, sound, setSound, pauseAudio, questionIndex],
  );

  const totalQuestionsCount = getTotalQuestionsCount(question);
  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styled.upperModal}>
            <View style={styled.upperInside}>
              <TouchableOpacity style={{}} onPress={closeModal}>
                <Icon
                  name="left"
                  style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}
                />
              </TouchableOpacity>
              <Text style={styled.modalQuizText}>{title}</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <IconTimer
                name="timer"
                style={{
                  fontSize: 20,
                  marginRight: 8,
                  color: color.darkPrimary,
                  fontWeight: 'bold',
                }}
              />
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
              {question.slice(questionIndex, questionIndex + 1).map(item => {
                return (
                  <View key={item.id}>
                    <Text style={styled.quizContentCount}>
                      Question {questionIndex + 1}/{totalQuestionsCount}
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}>
                      {renderQuestionStatus()}
                    </View>

                    <View style={styled.questionContainer}>
                      {renderQuestionContent(item)}
                    </View>

                    {item.subQuestions &&
                      item.subQuestions.map(renderSubQuestions)}
                  </View>
                );
              })}
            </ScrollView>
            {question.length >= 2 ? (
              <View style={styled.bottomButton}>
                <TouchableOpacity
                  style={
                    questionIndex === 0 ? styled.nextBtnLeft : styled.nextBtn
                  }
                  onPress={handlePrev}>
                  <Text style={styled.nextBtnText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity
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
              <TouchableOpacity style={styled.submittBtn} onPress={submitNow}>
                <Text style={styled.nextBtnText}>Submit Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;

const styled = StyleSheet.create({
  upperModal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(12),
  },

  upperInside: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftQuestion: {
    fontSize: scale(12),
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
    padding: scale(11),
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
    marginRight: scale(2),
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
