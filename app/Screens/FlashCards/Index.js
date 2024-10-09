import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import color from '../../Constants/color';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tts from 'react-native-tts';
import {Animated} from 'react-native';

const av = new Animated.Value(0);

const {width, height} = Dimensions.get('window');

const Flashcard = ({question, answer, showAnswer, onCardPress, onSpeak}) => {
  return (
    <TouchableOpacity
      hitSlop={{x: 25, y: 15}}
      style={styles.cardContainer}
      onPress={onCardPress}>
      <View
        style={[styles.card, showAnswer ? styles.cardBack : styles.cardFront]}>
        <Text style={showAnswer ? styles.answerText : styles.questionText}>
          {showAnswer ? answer : question}
        </Text>
        {!showAnswer ? (
          <TouchableOpacity style={styles.speakerIcon} onPress={onSpeak}>
            <Icon name="volume-up" size={36} color={color.black} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const Index = ({route}) => {
  const {flash_id, order_id, chapter_id, unique_id} = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(0);

  const {path, isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const navigation = useNavigation();

  const getFlashcardQuestions = async flash_id => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(
          `${path}/flashcard/questions/${flash_id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );
        setFlashcards(response.data);
      } catch (err) {
        console.error('Error fetching flashcard questions:', err);
      }
    }
  };

  const submitFlashcardCompletion = async () => {
    const token = await storage.getStringAsync('token'); // Assuming token is stored

    // setCompleted(1);

    Alert.alert(
      'Submit Completion',
      'Are you sure you want to submit your flashcard completion?',
      [
        {
          text: 'No',
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await axios.post(
                `${path}/student/flashcardresults`,
                {
                  flash_id,
                  completed: 1,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Attach token
                  },
                },
              );
              navigation.goBack();
              // Alert.alert('Success', response.data.msg); // Show success alert
            } catch (error) {
              console.error('Error submitting flashcard:', error);
              Alert.alert(
                'Error',
                'There was a problem submitting the flashcard.',
              );
            }
          },
        },
      ],
      {cancelable: false}, // Prevent dismissing by clicking outside
    );
  };

  useEffect(() => {
    getFlashcardQuestions(flash_id);

    // Register TTS event listeners and store them in variables to remove later
    const startListener = Tts.addEventListener('tts-start', () => {});
    const progressListener = Tts.addEventListener('tts-progress', () => {});
    const finishListener = Tts.addEventListener('tts-finish', () => {});
    const cancelListener = Tts.addEventListener('tts-cancel', () => {});

    return () => {
      // Clean up listeners when the component unmounts
      startListener.remove();
      progressListener.remove();
      finishListener.remove();
      cancelListener.remove();
    };
  }, []);

  const swipeCard = () => {
    setShowAnswer(!showAnswer);
  };

  const goToNextCard = () => {
    setShowAnswer(false);
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
  };

  const goToPreviousCard = () => {
    setShowAnswer(false);
    setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  if (flashcards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.counterText}>Loading flashcards...</Text>
      </View>
    );
  }

  const speakAnswer = () => {
    const {flash_question} = flashcards[currentIndex];
    Tts.speak(flash_question, {
      androidParams: {
        language: 'de-DE',
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.5,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
      // iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
      rate: 0.5,
    });
  };

  const {flash_question, flash_answer} = flashcards[currentIndex];

  return (
    <SafeAreaView style={style.flashCardcontainer}>
      <View style={style.flashCardcontainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {flashcards.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                {width: `${((currentIndex + 1) / flashcards.length) * 100}%`},
              ]}
            />
          </View>
        </View>

        <Flashcard
          question={flash_question}
          answer={flash_answer}
          showAnswer={showAnswer}
          onCardPress={swipeCard}
          onSpeak={speakAnswer}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            hitSlop={{x: 25, y: 15}}
            onPress={goToPreviousCard}
            style={[styles.button, currentIndex === 0 && styles.disabledButton]}
            disabled={currentIndex === 0}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={{x: 25, y: 15}}
            onPress={goToNextCard}
            style={[
              styles.button,
              currentIndex === flashcards.length - 1 && styles.disabledButton,
            ]}
            disabled={currentIndex === flashcards.length - 1}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => submitFlashcardCompletion()}
        style={{
          backgroundColor: color.lightPrimary,
          paddingVertical: 17,
          paddingHorizontal: 18,
          borderRadius: 9,
          width: '95%',
          display: 'flex',
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <Text style={{fontSize: 18, color: 'black', textAlign: 'center'}}>
          Marks as read
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.9,
    height: height * 0.4,
    marginBottom: 30,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardFront: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  cardBack: {
    backgroundColor: color.lightPrimary,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  answerText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#111',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: color.darkPrimary,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  progressContainer: {
    width: '80%',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: color.darkPrimary,
  },
  speakerIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
});
