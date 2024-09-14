import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import color from '../../Constants/color';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';

const {width, height} = Dimensions.get('window');

const Flashcard = ({question, answer, showAnswer, onCardPress}) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onCardPress}>
      <View
        style={[styles.card, showAnswer ? styles.cardBack : styles.cardFront]}>
        <Text style={showAnswer ? styles.answerText : styles.questionText}>
          {showAnswer ? answer : question}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Index = ({route}) => {
  const {flash_id} = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const {path, isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

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

  useEffect(() => {
    getFlashcardQuestions(flash_id);
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

  const {flash_question, flash_answer} = flashcards[currentIndex];

  return (
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
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={goToPreviousCard}
          style={[styles.button, currentIndex === 0 && styles.disabledButton]}
          disabled={currentIndex === 0}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
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
});
