import {
  Alert,
  Animated,
  AppState,
  Button,
  FlatList,
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
import axios, {all} from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import IconTimer from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../../Components/QuizCard/QuizStyle';
import {TextInput} from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import AudioComponent from '../../Components/QuizCard/AudioComponent';
import scale, {consoleLog} from '../../utils/utils';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import storage from '../../Constants/storage';
import VoiceComponent from './VoiceComponent';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import DraggableFlatList from 'react-native-draggable-flatlist';
import RenderMatch from './RenderMatch';
import JumbledSentence from './JumbledSentence';
import JumbledWords from './JumbledWords';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

const Index = ({route}) => {
  const {
    module_id,
    title,
    order_id,
    chapter_id,
    unique_id,
    level_id,
    previousAnswers,
    currentQuestionIndex,
  } = route.params;

  // console.log(module_id, title, order_id, chapter_id, unique_id, level_id);
  const {path, grandScore, setGrandScore, userData, student_id, isDark} =
    useContext(AppContext);
  const navigation = useNavigation();

  const style = isDark ? DarkTheme : LighTheme;

  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    animatedValue.addListener(({value}) => {
      //   console.log('Animated Value:', value);
    });
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [animatedValue]);

  const [newScale, setNewScale] = useState(1);

  const onPinchEvent = event => {
    console.log('event', event.nativeEvent.scale);
    setNewScale(event.nativeEvent.scale);
  };

  const onPinchStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setNewScale(1); // Reset to original scale when gesture ends
    }
  };

  const objectAnswers = previousAnswers ? JSON.parse(previousAnswers) : {};

  const [appState, setAppState] = useState(AppState.currentState);
  const [combinedData, setCombinedData] = useState([]);
  const [answerData, setAnswerData] = useState([]);
  const [studentAnswer, setStudentAnswer] = useState([]);

  const [allCombinedData, setAllCombinedData] = useState(
    previousAnswers ? objectAnswers : {},
  );

  const handleSetCombinedData = (index, data, item) => {
    const questionIds = data.map(item => item.questionId);
    const matchAnswerSingle = item.matchAnswerSingle
      .split(',')
      .map(id => id.trim());

    setAnswerData(prevState => ({
      ...prevState,
      [index]: matchAnswerSingle,
    }));
    setStudentAnswer(prevState => ({
      ...prevState,
      [index]: questionIds,
    }));

    setAllCombinedData(prevState => ({
      ...prevState,
      [index]: data,
    }));
  };

  const [questionIndex, setQuestionIndex] = useState(
    previousAnswers ? currentQuestionIndex - 1 : 0,
  );

  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(0);
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

  const [correctAnswers, setCorrectAnswers] = useState({});
  const [questionType, setQuestionType] = useState('');

  const getDetails = async () => {
    try {
      const token = await storage.getStringAsync('token');

      const response = await axios.post(
        `${path}/student/v3/questions/details`,
        {
          // module_id: 114,
          module_id: module_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setQuestionType(response.data[0].type);
      const correctAnswerIndices = {};
      response.data.forEach(item => {
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
      setQuestion(response.data);
    } catch (error) {
      console.log('Error fetching details:', error);
    }
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
    // Show confirmation alert before proceeding
    Alert.alert(
      'Confirm Submission',
      'Are you sure you want to submit your marks?',
      [
        {
          text: 'No', // If "No" is pressed, do nothing
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes', // If "Yes" is pressed, proceed with submitNow logic
          onPress: async () => {
            const token = await storage.getStringAsync('token');
            setSelectedOption(null);
            setQuestionIndex(0);

            if (sound) {
              sound.pause();
            }

            const newScore = score === 0 ? 0 : score;
            try {
              // Save the marks using POST request
              await axios.post(
                `${path}/student/saveMarks`,
                {
                  student_id: student_id,
                  module_id: module_id,
                  marks: newScore,
                  total: totalQuestionMarks,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              // After marks are saved successfully, delete the quiz data
              await axios.delete(`${path}/admin/v3/deleteQuizData`, {
                data: {
                  module_id: module_id,
                },
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              const studentAnswers = JSON.stringify(selectedOptions);

              const newInputValue = JSON.stringify(inputValue);

              let finalStudentAnswers =
                questionType === 'JumbledSentences'
                  ? JSON.stringify(studentAnswer)
                  : studentAnswers == '{}'
                  ? newInputValue
                  : studentAnswers;

              let teacherAnswers =
                questionType === 'JumbledSentences'
                  ? JSON.stringify(answerData)
                  : JSON.stringify(correctAnswers);

              let quizType = questionType === 'JumbledSentences' ? 1 : 0;
              // return;
              if (
                questionType !== 'Record' &&
                questionType !== 'Speaking' &&
                questionType !== 'Match' &&
                questionType !== 'JumbledWords'
              ) {
                await axios.post(
                  `${path}/admin/v4/studentAnswers`,
                  {
                    module_id: module_id,
                    student_answers: finalStudentAnswers,
                    teacher_answers: teacherAnswers,
                    type: quizType,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
              }

              // Reset states and navigate back
              setScore(0);
              setIsPlaying(false);
              setCompleted(1);
              setIsAttempted(false);
              navigation.goBack();
              console.log('Marks saved successfully');
            } catch (error) {
              console.log('Error saving marks:', error.response);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handlePrev = () => {
    if (questionIndex <= 0) {
      // setSelectedOptions({});
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

  const createLinearArray = objectAnswers => {
    const keys = Object.keys(objectAnswers)
      .map(Number)
      .sort((a, b) => a - b);
    if (keys.length === 0) return [];

    const minKey = keys[0];
    const result = [];

    for (let i = 0; i < keys.length; i++) {
      const index = keys[i] - minKey;
      result.push(index);
    }

    return result;
  };

  const linearArray = createLinearArray(objectAnswers);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isAttempted, setIsAttempted] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState(
    linearArray.length > 0 ? linearArray : [],
  );
  const [finalScore, setFinalScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(
    previousAnswers ? objectAnswers : {},
  );

  // console.log('selectedOptions', selectedOptions);
  // console.log('attemptedQuestions', attemptedQuestions);
  // console.log('questionIndex', questionIndex);
  // console.log('previousAnswers', previousAnswers);

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
    if (!attemptedQuestions.includes(id)) {
      setAttemptedQuestions(prev => [...prev, questionIndex]);
    }
    // setAttemptedQuestions(prev => [...prev, questionIndex]);
  };

  // const handleOptionSelect = (
  //   selectedIndex,
  //   optionKey,
  //   correctAnswerIndex,
  //   number,
  //   id,
  // ) => {
  //   setSelectedOptions(prevState => ({
  //     ...prevState,
  //     [id]: selectedIndex,
  //   }));
  //   if (!attemptedQuestions.includes(id)) {
  //     setAttemptedQuestions(prev => [...prev, id]);
  //   }
  // };

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
                hitSlop={{x: 25, y: 15}}
                key={index}
                style={[
                  styled.optionBtn,
                  isSelected && styled.selectedOption,
                  {opacity: animatedValue},
                ]}
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
    const labels = [options.option1, options.option2];
    const correctAnswerIndex = options.correctAnswerIndex;

    return (
      <View style={styled.options}>
        {labels.map((label, index) => {
          const isSelected = selectedOptions[id] === index + 1;
          return (
            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              key={index}
              style={[styled.optionBtn, isSelected && styled.selectedOption]}
              onPress={() => handleOptionTrueSelect(index + 1, id)}>
              <Text style={styled.optionText}>{label}</Text>
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

  const [matchData, setMatchData] = useState([]);

  const fetchMatchData = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.post(
        `${path}/student/v3/questions/match-details`,
        {
          moduleId: module_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMatchData(response.data);
    } catch (error) {
      console.log('Error fetching match data:', error);
    }
  };

  useEffect(() => {
    fetchMatchData();
  }, [module_id]);

  const [inputWidth, setInputWidth] = useState(50);

  const handleContentSizeChange = e => {
    const newWidth = Math.max(50, e.nativeEvent.contentSize.width);
    setInputWidth(newWidth);
  };

  const [inputValue, setInputValue] = useState('');
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
  const renderQuestionWithBlanksQuestion = (
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
          {parts.length > 1 ? (
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

              {/* Render the remaining part of the question after the blank */}
              <Text
                style={[
                  styled.quiztitle,
                  {flexShrink: 1, marginTop: scale(4)},
                ]}>
                {parts.slice(1).join('_')} {/* Rejoin remaining parts */}
              </Text>
            </>
          ) : (
            <>
              {/* If no underscore, show entire question with TextInput after it */}
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
    const normalizedAnswer = answer ? answer.toLowerCase() : '';

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
  const getTotalQuestionsCountMarks = questions => {
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
            ? 'green'
            : 'white',
          borderColor: 'black',
          borderWidth: 1,
        }}
      />
    ));
  };

  const renderImage = useCallback(
    url => (
      <>
        <PinchGestureHandler
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchStateChange}>
          <Image
            source={{uri: `https://d2c9u2e33z36pz.cloudfront.net/${url}`}}
            style={{
              width: '100%',
              height: 200,
              marginBottom: 10,
            }}
            resizeMode="contain"
          />
        </PinchGestureHandler>
      </>
    ),
    [],
  );

  const renderQuestionContent = useCallback(
    (item, index) => {
      switch (item.type) {
        case 'TextNormal':
        case 'TextImage':
        case 'MultiQuestionsImage':
        case 'TextAudio':
          return (
            <>
              {item.subQuestions.length > 1 ? (
                <>
                  {renderQuestionWithBlanks(
                    item.question,
                    item.correctAnswerIndex,
                    item.id,
                    item.type,
                    item.audioURL,
                    questionIndex,
                  )}
                  {item.imageURL && renderImage(item.imageURL)}
                </>
              ) : (
                <>
                  {renderQuestionWithBlanksQuestion(
                    item.question,
                    item.correctAnswerIndex,
                    item.id,
                    item.type,
                    item.audioURL,
                    questionIndex,
                  )}
                  {item.imageURL && renderImage(item.imageURL)}
                </>
              )}
            </>
          );

        case 'Match':
          return (
            <>
              <Text selectable={true} style={styled.quiztitle}>
                Q: {questionIndex + 1} {item.question}
              </Text>
              <RenderMatch
                matchData={matchData}
                item={item}
                setScore={setScore}
                score={score}
                combinedData={combinedData}
                setCombinedData={setCombinedData}
              />
            </>
          );
        case 'JumbledSentences':
          return (
            <>
              <Text selectable={true} style={styled.quiztitle}>
                Q: {questionIndex + 1} {item.question}
              </Text>
              <JumbledSentence
                matchData={matchData}
                item={item}
                setScore={setScore}
                score={score}
                // combinedData={combinedData}
                // setCombinedData={setCombinedData}
                combinedData={allCombinedData[item.id] || []} // Pass stored combined data or empty array
                setCombinedData={data =>
                  handleSetCombinedData(item.id, data, item)
                } // Update combined data in parent
                setAnswerData={setAnswerData}
              />
            </>
          );
        case 'Audio':
        case 'MultiQuestionsAudio':
          return (
            <>
              <Text selectable={true} style={styled.quiztitle}>
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
              <Text selectable={true} style={styled.quiztitle}>
                Q{questionIndex + 1}) {item.question}
              </Text>
              {/* <Text>{item.type}</Text> */}
              {item.imageURL && renderImage(item.imageURL)}
              {renderTrueFalse(item, item.id)}
            </>
          );
        case 'Record':
          return (
            <>
              <Text selectable={true} style={styled.quiztitle}>
                Q{questionIndex + 1}) {item.question}
              </Text>
              <VoiceComponent
                item={item.question}
                score={score}
                setScore={setScore}
              />
            </>
          );
        default:
          return (
            <>
              <Text selectable={true} style={styled.quiztitle}>
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
            <Text selectable={true} style={styled.quiztitle}>
              {subQuestion.question}
            </Text>
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
            <Text selectable={true} style={styled.quiztitle}>
              {subQuestion.question}
            </Text>
            {subQuestion.imageURL && renderImage(subQuestion.imageURL)}
          </>
        )}

        {renderOptions(subQuestion, questionIndex, subQuestion.id)}
      </View>
    ),
    [isPlaying, setIsPlaying, sound, setSound, pauseAudio, questionIndex],
  );

  const truncateTitle = (title, wordLimit) => {
    const words = title.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return title;
  };

  const totalQuestionsCount = getTotalQuestionsCount(question);
  const totalQuestionMarks = getTotalQuestionsCountMarks(question);

  // const isSelectedOptionsEmpty = () => {
  //   console.log('Selected Options:', selectedOptions);
  //   return Object.keys(selectedOptions).length === 0;
  // };

  // useEffect(() => {
  //   const isEmpty = isSelectedOptionsEmpty();
  //   console.log('Is selectedOptions empty?', isEmpty);
  // }, [selectedOptions]);

  const savedQuiz = async () => {
    const finalAnswers =
      Object.keys(selectedOptions).length === 0
        ? allCombinedData
        : selectedOptions;

    try {
      // Prepare the quiz data you want to send to the backend
      let quizData = {
        module_id: module_id,
        completed: completed,
        level: level_id,
        chapter: chapter_id,
        answers: JSON.stringify(finalAnswers), // Always stringify the latest selectedOptions
        score: score,
        currentQuestionIndex: questionIndex + 1,
        totalQuestions: totalQuestionsCount,
      };
      const token = await storage.getStringAsync('token');
      const response = await axios.post(
        `${path}/student/v3/saveQuizData`,
        quizData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Quiz data saved successfully:', response.data);
    } catch (error) {
      console.log('Error saving quiz state:', error);
    }
  };

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (
        // appState.match(/active/) && // If the app was active
        // nextAppState === 'inactive' ||
        nextAppState === 'background' // And is going to background or inactive
      ) {
        savedQuiz(); // Call the function to save quiz state
      }
      setAppState(nextAppState); // Update the app state
    };

    // Add event listener for app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Clean up the event listener when the component unmounts
    return () => {
      subscription.remove();
    };
  }, [appState, selectedOptions, score, questionIndex, totalQuestionsCount]);
  return (
    <View style={style.quizScreen}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={style.upperModal}>
            <View style={styled.upperInside}>
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
                style={{}}
                onPress={closeModal}>
                <Icon
                  name="left"
                  style={{fontSize: 20, color: 'black', fontWeight: 'bold'}}
                />
              </TouchableOpacity>
              <Text style={style.modalQuizText}>{truncateTitle(title, 3)}</Text>
            </View>
          </View>
          <LinearGradient
            colors={[color.black, color.black, color.lowPrimary]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styled.completeStatus}
          />
          <View style={styled.quizContent}>
            <FlatList
              data={question.slice(questionIndex, questionIndex + 1)} // Slice the data as before
              keyExtractor={item => item.id.toString()} // Use item.id as the key
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
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
              )}
            />
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
    </View>
  );
};

export default Index;

const styled = StyleSheet.create({
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
