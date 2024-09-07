// import React, {useState, useEffect, useContext} from 'react';
// import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import axios from 'axios';
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from 'react-native-reanimated';
// import color from '../../Constants/color';
// import Icon from 'react-native-vector-icons/AntDesign';
// import {AppContext} from '../../theme/AppContext';
// import storage from '../../Constants/storage';

// const Flashcard = ({question, answer, flipCard, flipped, rotateY}) => {
//   const animatedFrontStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{rotateY: `${rotateY.value}deg`}],
//     };
//   });

//   const animatedBackStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{rotateY: `${rotateY.value + 180}deg`}],
//     };
//   });

//   return (
//     <TouchableOpacity onPress={flipCard} style={styles.cardContainer}>
//       <Animated.View style={[styles.card, styles.front, animatedFrontStyle]}>
//         <Text style={styles.questionText}>{question}</Text>
//       </Animated.View>
//       <Animated.View style={[styles.card, styles.back, animatedBackStyle]}>
//         <Text style={styles.answerText}>{answer}</Text>
//       </Animated.View>
//     </TouchableOpacity>
//   );
// };

// const Index = ({route}) => {
//   const {flash_id} = route.params;
//   const [flashcards, setFlashcards] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [flipped, setFlipped] = useState(false);
//   const rotateY = useSharedValue(0);

//   const {path} = useContext(AppContext);

//   const getFlashcardQuestions = async flash_id => {
//     const token = await storage.getStringAsync('token');
//     if (token) {
//       try {
//         const response = await axios.get(
//           `http://${path}:4000/flashcard/questions/${flash_id}`,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: 'Bearer ' + token,
//             },
//           },
//         );
//         setFlashcards(response.data);
//       } catch (err) {
//         console.error('Error fetching flashcard questions:', err);
//       }
//     }
//   };

//   useEffect(() => {
//     getFlashcardQuestions(flash_id);
//   }, []);

//   const flipCard = () => {
//     setFlipped(prev => !prev);
//     rotateY.value = withTiming(flipped ? 0 : 180, {duration: 500});
//   };

//   const goToNextCard = () => {
//     setFlipped(false);
//     rotateY.value = withTiming(0, {duration: 0}); // Reset rotation when moving to the next card
//     setCurrentIndex(prev => (prev + 1) % flashcards.length);
//   };

//   const goToPreviousCard = () => {
//     setFlipped(false);
//     rotateY.value = withTiming(0, {duration: 0}); // Reset rotation when moving to the previous card
//     setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
//   };

//   if (flashcards.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.counterText}>Loading flashcards...</Text>
//       </View>
//     );
//   }

//   const {flash_question, flash_answer} = flashcards[currentIndex];

//   return (
//     <View style={styles.container}>
//       <Flashcard
//         question={flash_question}
//         answer={flash_answer}
//         flipCard={flipCard}
//         flipped={flipped}
//         rotateY={rotateY}
//       />
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress={goToPreviousCard}
//           style={[styles.button, currentIndex === 0 && styles.disabledButton]}
//           disabled={currentIndex === 0}>
//           <Icon name="arrowleft" style={styles.buttonText} />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.count}>
//             {currentIndex + 1} / {flashcards.length}
//           </Text>
//         </View>
//         <TouchableOpacity
//           onPress={goToNextCard}
//           style={[
//             styles.button,
//             currentIndex === flashcards.length - 1 && styles.disabledButton,
//           ]}
//           disabled={currentIndex === flashcards.length - 1}>
//           <Icon name="arrowright" style={styles.buttonText} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 16,
//     // justifyContent: 'center',
//     alignItems: 'center',
//   },
//   counterText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   cardContainer: {
//     width: '95%',
//     height: 300,
//     perspective: 1000,
//     marginBottom: 20,
//   },
//   card: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//     backgroundColor: '#f1f4f8',
//     backfaceVisibility: 'hidden',
//     shadowColor: 'grey',
//     // shadowOpacity: 0.1,
//     // shadowRadius: 10,
//     // elevation: 10,
//   },
//   front: {
//     backgroundColor: '#f1f4f8',
//     padding: 10,
//   },
//   back: {
//     backgroundColor: color.lowPrimary,
//     transform: [{rotateY: '180deg'}],
//   },
//   questionText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//   },
//   answerText: {
//     fontSize: 16,
//     color: '#fff',
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   button: {
//     padding: 10,
//     marginHorizontal: 10,
//     backgroundColor: color.lowPrimary,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 26,
//   },
//   disabledButton: {
//     backgroundColor: 'grey',
//   },
//   count: {
//     fontSize: 18,
//   },
// });

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

  const {path} = useContext(AppContext);

  const getFlashcardQuestions = async flash_id => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(
          `http://${path}:4000/flashcard/questions/${flash_id}`,
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
    <View style={styles.container}>
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
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
