import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import axios from 'axios';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import color from '../../Constants/color';
import Icon from 'react-native-vector-icons/AntDesign';
import {AppContext} from '../../theme/AppContext';

const Flashcard = ({question, answer, flipCard, flipped, rotateY}) => {
  const animatedFrontStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateY: `${rotateY.value}deg`}],
    };
  });

  const animatedBackStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateY: `${rotateY.value + 180}deg`}],
    };
  });

  return (
    <TouchableOpacity onPress={flipCard} style={styles.cardContainer}>
      <Animated.View style={[styles.card, styles.front, animatedFrontStyle]}>
        <Text style={styles.questionText}>{question}</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.back, animatedBackStyle]}>
        <Text style={styles.answerText}>{answer}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const Index = ({route}) => {
  const {chapterId} = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const rotateY = useSharedValue(0);

  const {path} = useContext(AppContext);

  const getFlashcardQuestions = async chapterId => {
    try {
      const response = await axios.get(
        `http://${path}:4000/flashcard/questions/${chapterId}`,
      );
      setFlashcards(response.data);
    } catch (err) {
      console.error('Error fetching flashcard questions:', err);
    }
  };

  useEffect(() => {
    getFlashcardQuestions(chapterId);
  }, []);

  const flipCard = () => {
    setFlipped(prev => !prev);
    rotateY.value = withTiming(flipped ? 0 : 180, {duration: 500});
  };

  const goToNextCard = () => {
    setFlipped(false);
    rotateY.value = withTiming(0, {duration: 0}); // Reset rotation when moving to the next card
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
  };

  const goToPreviousCard = () => {
    setFlipped(false);
    rotateY.value = withTiming(0, {duration: 0}); // Reset rotation when moving to the previous card
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
    <View style={styles.container}>
      <Flashcard
        question={flash_question}
        answer={flash_answer}
        flipCard={flipCard}
        flipped={flipped}
        rotateY={rotateY}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={goToPreviousCard}
          style={[styles.button, currentIndex === 0 && styles.disabledButton]}
          disabled={currentIndex === 0}>
          <Icon name="arrowleft" style={styles.buttonText} />
        </TouchableOpacity>
        <View>
          <Text style={styles.count}>
            {currentIndex + 1} / {flashcards.length}
          </Text>
        </View>
        <TouchableOpacity
          onPress={goToNextCard}
          style={[
            styles.button,
            currentIndex === flashcards.length - 1 && styles.disabledButton,
          ]}
          disabled={currentIndex === flashcards.length - 1}>
          <Icon name="arrowright" style={styles.buttonText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    width: '95%',
    height: 300,
    perspective: 1000,
    marginBottom: 20,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f1f4f8',
    backfaceVisibility: 'hidden',
    shadowColor: 'grey',
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 10,
  },
  front: {
    backgroundColor: '#f1f4f8',
    padding: 10,
  },
  back: {
    backgroundColor: color.lowPrimary,
    transform: [{rotateY: '180deg'}],
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  answerText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: color.lowPrimary,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 26,
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  count: {
    fontSize: 18,
  },
});
