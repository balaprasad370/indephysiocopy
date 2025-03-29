import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Pressable,
  SafeAreaView,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tts from 'react-native-tts';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Recordings from './components/Recordings';
import axiosInstance from '../../Components/axiosInstance';

const {width, height} = Dimensions.get('window');

const LanguageSelector = ({visible, onSelect, onClose, title}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            width: width * 0.85,
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 20,
              textAlign: 'center',
              color: '#1F2937',
            }}>
            {title}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: '#613BFF',
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
            }}
            onPress={() => onSelect('english')}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 16,
              }}>
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#613BFF',
              padding: 15,
              borderRadius: 12,
            }}
            onPress={() => onSelect('german')}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: 16,
              }}>
              German
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginTop: 15,
              padding: 10,
            }}
            onPress={onClose}>
            <Text
              style={{
                color: '#6B7280',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Flashcard = React.memo(
  ({
    question,
    answer,
    showAnswer,
    onCardPress,
    frontLanguage,
    backLanguage,
  }) => {
    const spin = useSharedValue(0);

    // Calculate responsive card dimensions
    const cardWidth = width * 0.9;
    const cardHeight = Math.min(height * 0.5, 300); // Cap height but keep it responsive

    useEffect(() => {
      spin.value = withTiming(showAnswer ? 180 : 0, {duration: 500});
    }, [showAnswer, question, answer, frontLanguage, backLanguage, spin]);

    const frontAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {rotateY: `${interpolate(spin.value, [0, 180], [0, 180])}deg`},
      ],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }));

    const backAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {rotateY: `${interpolate(spin.value, [0, 180], [180, 360])}deg`},
      ],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }));

    const cardShadowStyle = Platform.select({
      ios: {
        shadowColor: '#613BFF',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    });

    const iconSize = Math.max(Math.min(width * 0.06, 24), 18); // Responsive icon size with min/max bounds
    const fontSize = Math.max(Math.min(width * 0.045, 18), 14); // Responsive font size with min/max bounds

    return (
      <Pressable
        activeOpacity={0.9}
        style={{
          width: cardWidth,
          height: cardHeight,
          marginHorizontal: width * 0.05,
        }}
        onPress={onCardPress}>
        <Animated.View style={[frontAnimatedStyle, {flex: 1}]}>
          <View
            className="flex-1 rounded-3xl justify-center items-center bg-white"
            style={[cardShadowStyle, {padding: width * 0.05}]}>
            <ScrollView
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: height * 0.05,
                paddingHorizontal: width * 0.05,
              }}
              showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize * 1.2,
                  fontWeight: '500',
                  color: '#1F2937',
                }}>
                {question}
              </Text>

              <Text className="text-n1 text-center text-sm font-medium py-2">
                Tap to flip
              </Text>
            </ScrollView>
            <View
              style={{
                position: 'absolute',
                bottom: height * 0.02,
                right: width * 0.04,
              }}>
              <TouchableOpacity
                className="rounded-full bg-p1/20"
                style={{padding: width * 0.015}}
                onPress={onCardPress}>
                <Icon name="rotate-right" size={iconSize} color="#613BFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[backAnimatedStyle, {flex: 1}]}>
          <View
            className="flex-1 rounded-3xl justify-center items-center bg-p1"
            style={[cardShadowStyle, {padding: width * 0.05}]}>
            <ScrollView
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: height * 0.05,
                paddingHorizontal: width * 0.05,
              }}
              showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize * 1.2,
                  fontWeight: '500',
                  color: '#ffffff',
                }}>
                {answer}
              </Text>
            </ScrollView>
            <View
              style={{
                position: 'absolute',
                bottom: height * 0.02,
                right: width * 0.04,
              }}>
              <TouchableOpacity
                className="rounded-full bg-white/20"
                style={{padding: width * 0.015}}
                onPress={onCardPress}>
                <Icon name="rotate-right" size={iconSize} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    );
  },
);

const Index = ({route}) => {
  const {flash_id} = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const flatListRef = React.useRef(null);
  const [frontLanguageModalVisible, setFrontLanguageModalVisible] =
    useState(false);
  const [backLanguageModalVisible, setBackLanguageModalVisible] =
    useState(false);
  const [frontLanguage, setFrontLanguage] = useState('');
  const [backLanguage, setBackLanguage] = useState('');
  const [languageSetupComplete, setLanguageSetupComplete] = useState(false);
  const [recordingsModalVisible, setRecordingsModalVisible] = useState(false);

  const {path} = useContext(AppContext);
  const navigation = useNavigation();
  const fontSize = Math.max(Math.min(width * 0.045, 18), 14); // Responsive font size

  const initTTS = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await Tts.setDefaultLanguage('de-DE');
      } else {
        await Tts.setDefaultLanguage('de-DE');
        await Tts.setDefaultVoice('de-de-x-deb-local');
      }

      // Set other TTS properties
      await Tts.setDefaultRate(0.5);
      await Tts.setDefaultPitch(1.0);

      // Initialize with a silent speak to make TTS ready
      await Tts.speak('', {
        rate: 0.5,
        pitch: 1.0,
        volume: 0, // Silent
      });
    } catch (err) {
      console.log('TTS initialization error:', err);
    }
  }, []);

  useEffect(() => {
    initTTS();
  }, [initTTS]);

  const getFlashcardQuestions = useCallback(async () => {
    try {
      const {data} = await axiosInstance.get(
        `/v2/flashcard/questions/${flash_id}`,
      );
      // console.log('data', data);
      setFlashcards(data);

      // Show language selector when flashcards are loaded
      if (data.length > 0 && !languageSetupComplete) {
        // setFrontLanguageModalVisible(true);
      }
    } catch (err) {
      console.log('Error fetching flashcard questions:', err);
      Alert.alert('Error', 'Failed to load flashcards');
    }
  }, [flash_id, path, languageSetupComplete]);

  useEffect(() => {
    if (frontLanguage && backLanguage) {
      updateLanguages();
    }
  }, [frontLanguage, backLanguage]);

  useEffect(() => {
    getFlashcardLanguages();
  }, [flash_id]);

  const getFlashcardLanguages = async () => {
    try {
      // console.log('fhvbsdhf');

      const response = await axiosInstance.get(
        `/v7/flashcard/languages/${flash_id}`,
      );
      // console.log(response.data);
      if (response.data.status) {
        setFrontLanguage(response.data.data.front_language);
        setBackLanguage(response.data.data.back_language);
        setFrontLanguageModalVisible(false);
        setBackLanguageModalVisible(false);
        setLanguageSetupComplete(true);
      } else {
        setFrontLanguageModalVisible(true);
        setBackLanguageModalVisible(true);
        setLanguageSetupComplete(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLanguages = useCallback(async () => {
    // console.log(frontLanguage, backLanguage);

    try {
      const response = await axiosInstance.post(
        `/v7/flashcard/update-languages`,
        {
          flash_id,
          front_language: frontLanguage,
          back_language: backLanguage,
        },
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [frontLanguage, backLanguage]);

  const submitFlashcardCompletion = useCallback(async () => {
    Alert.alert(
      'Complete Flashcards',
      'Are you sure you want to mark these flashcards as complete?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Complete',
          onPress: async () => {
            try {
              const token = await storage.getStringAsync('token');
              if (!token) throw new Error('No token found');

              await axiosInstance.post(`/v7/flashcard/results`, {
                flash_id,
                completed: 1,
              });
              navigation.goBack();
            } catch (error) {
              console.log('Error submitting flashcard:', error);
              Alert.alert(
                'Error',
                'There was a problem completing the flashcards.',
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
  }, [flash_id, path, navigation]);

  useEffect(() => {
    getFlashcardQuestions();

    const ttsListeners = [
      Tts.addEventListener('tts-start', () => {}),
      Tts.addEventListener('tts-progress', () => {}),
      Tts.addEventListener('tts-finish', () => {}),
      Tts.addEventListener('tts-cancel', () => {}),
    ];

    return () => {
      ttsListeners.forEach(listener => listener.remove());
      Tts.stop();
    };
  }, [getFlashcardQuestions]);

  const swipeCard = useCallback(() => {
    setShowAnswer(prev => !prev);
  }, []);

  const goToNextCard = useCallback(() => {
    if (currentIndex >= flashcards.length - 1) return;

    setShowAnswer(false);
    setCurrentIndex(prev => prev + 1);
    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  }, [currentIndex, flashcards.length]);

  const goToPreviousCard = useCallback(() => {
    if (currentIndex <= 0) return;

    setShowAnswer(false);
    setCurrentIndex(prev => prev - 1);
    flatListRef.current?.scrollToIndex({
      index: currentIndex - 1,
      animated: true,
    });
  }, [currentIndex]);

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems?.[0]) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
      setShowAnswer(false);
    }
  }, []);

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 50,
    }),
    [],
  );

  const speakText = useCallback((text, language) => {
    const languageCode = language === 'english' ? 'en-US' : 'de-DE';
    const voiceId =
      language === 'english'
        ? Platform.OS === 'android'
          ? 'en-us-x-sfg-local'
          : 'en-US'
        : Platform.OS === 'android'
        ? 'de-de-x-deb-local'
        : 'de-DE';

    const ttsOptions = Platform.select({
      ios: {
        language: languageCode,
        pitch: 1.0,
        rate: 0.5,
      },
      android: {
        language: languageCode,
        voice: voiceId,
        pitch: 1.0,
        rate: 0.5,
        // androidParams: {
        //   KEY_PARAM_PAN: -1,
        //   KEY_PARAM_VOLUME: 0.5,
        // },
      },
    });

    Tts.stop();

    // Set language before speaking
    Tts.setDefaultLanguage(languageCode)
      .then(() => {
        if (Platform.OS === 'android') {
          return Tts.setDefaultVoice(voiceId);
        }
        return Promise.resolve();
      })
      .then(() => {
        Tts.speak(text, ttsOptions);
      })
      .catch(err => {
        console.log('TTS language error:', err);
        // Fallback to speak anyway
        Tts.speak(text, ttsOptions);
      });
  }, []);

  const handleFrontLanguageSelect = useCallback(language => {
    setFrontLanguage(language);
    setFrontLanguageModalVisible(false);

    // After selecting front language, ask for back language
    setBackLanguageModalVisible(true);
  }, []);

  const handleBackLanguageSelect = useCallback(language => {
    setBackLanguage(language);
    setBackLanguageModalVisible(false);
    setLanguageSetupComplete(true);
  }, []);

  const handleChangeFrontLanguage = useCallback(() => {
    setFrontLanguageModalVisible(true);
  }, []);

  const handleChangeBackLanguage = useCallback(() => {
    setBackLanguageModalVisible(true);
  }, []);

  const renderItem = useCallback(
    ({item, index}) => (
      <Flashcard
        question={item.flash_question}
        answer={item.flash_answer}
        showAnswer={showAnswer && currentIndex === index}
        onCardPress={swipeCard}
        frontLanguage={frontLanguage}
        backLanguage={backLanguage}
      />
    ),
    [currentIndex, showAnswer, swipeCard, frontLanguage, backLanguage],
  );

  const onScroll = useCallback(
    event => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(offsetX / width);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex],
  );

  const openRecordingsModal = useCallback(() => {
    setRecordingsModalVisible(true);
  }, []);

  const closeRecordingsModal = useCallback(() => {
    setRecordingsModalVisible(false);
  }, []);

  const getCurrentFlashcard = useCallback(() => {
    return flashcards[currentIndex] || null;
  }, [flashcards, currentIndex]);

  const getCurrentSideData = useCallback(() => {
    const currentCard = getCurrentFlashcard();
    if (!currentCard) return null;

    // console.log('currentCard fdbsdfbsdfg', currentCard);

    return {
      text: showAnswer ? currentCard.flash_answer : currentCard.flash_question,
      language: showAnswer ? backLanguage : frontLanguage,
      side: showAnswer ? 'back' : 'front',
      is_front: currentCard.is_front,
      flash_question_id: currentCard.flash_question_id,
      front_recordings: (() => {
        try {
          return typeof currentCard?.front_recordings === 'string'
            ? JSON.parse(currentCard.front_recordings)
            : currentCard?.front_recordings || [];
        } catch (error) {
          console.error('Error parsing recordings:', error);
          return [];
        }
      })(),
      back_recordings: (() => {
        try {
          return typeof currentCard?.back_recordings === 'string'
            ? JSON.parse(currentCard.back_recordings)
            : currentCard?.back_recordings || [];
        } catch (error) {
          console.error('Error parsing recordings:', error);
          return [];
        }
      })(),
    };
  }, [
    getCurrentFlashcard,
    showAnswer,
    frontLanguage,
    backLanguage,
    flashcards,
  ]);

  const updateRecordings = (newRecordingsUpdate, is_front) => {
    // console.log('flashcards', flashcards[currentIndex]);

    // console.log('newRecordingsUpdate', newRecordingsUpdate);
    // console.log('is_front', is_front);

    const updatedFlashcards = [...flashcards];
    updatedFlashcards[currentIndex][
      is_front ? 'front_recordings' : 'back_recordings'
    ] = newRecordingsUpdate;
    setFlashcards(updatedFlashcards);

    // console.log('flashcards', flashcards[currentIndex]);

    // console.log('updatedFlashcards', updatedFlashcards);
  };

  if (!flashcards.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text
          style={{
            fontSize: Math.max(width * 0.04, 16),
            fontWeight: '500',
            color: '#4B5563',
          }}>
          Loading flashcards...
        </Text>
      </View>
    );
  }

  const buttonShadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  });

  // Responsive sizing
  const progressBarWidth = width * 0.85;
  const buttonHeight = Math.max(height * 0.06, 48);
  const buttonFontSize = Math.max(width * 0.035, 14);
  const completionButtonFontSize = Math.max(width * 0.04, 16);
  const progressTextSize = Math.max(width * 0.04, 16);
  const iconSize = Math.max(Math.min(width * 0.06, 24), 18); // Responsive icon size

  const currentCard = getCurrentFlashcard();
  const currentText = showAnswer
    ? currentCard?.flash_answer
    : currentCard?.flash_question;
  const currentLanguage = showAnswer ? backLanguage : frontLanguage;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <LanguageSelector
        visible={frontLanguageModalVisible}
        onSelect={handleFrontLanguageSelect}
        onClose={() => setFrontLanguageModalVisible(false)}
        title="Select Front Card Language for All Flashcards"
      />

      <LanguageSelector
        visible={backLanguageModalVisible}
        onSelect={handleBackLanguageSelect}
        onClose={() => setBackLanguageModalVisible(false)}
        title="Select Back Card Language for All Flashcards"
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: width * 0.05,
          paddingTop: height * 0.02,
          paddingBottom: height * 0.01,
        }}>
        <TouchableOpacity
          className="rounded-full bg-p1/10"
          style={{padding: width * 0.015}}
          onPress={handleChangeFrontLanguage}>
          <Text
            style={{
              color: '#613BFF',
              fontWeight: '600',
              fontSize: fontSize * 0.8,
              paddingHorizontal: 8,
            }}>
            Front: {frontLanguage === 'english' ? 'EN' : 'DE'}
          </Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            className="rounded-full bg-p1/10"
            style={{padding: width * 0.015, marginRight: 10}}
            onPress={handleChangeBackLanguage}>
            <Text
              style={{
                color: '#613BFF',
                fontWeight: '600',
                fontSize: fontSize * 0.8,
                paddingHorizontal: 8,
              }}>
              Back: {backLanguage === 'english' ? 'EN' : 'DE'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Record Button */}

      <View className="flex-row justify-end items-center px-5">
        {/* <TouchableOpacity
          onPress={openRecordingsModal}
          style={{
            alignSelf: 'center',
            backgroundColor: '#613BFF',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 3,
              },
              android: {
                elevation: 5,
              },
            }),
          }}>
          <Icon name="mic" size={20} color="#FFFFFF" style={{marginRight: 8}} />
          <Text style={{color: '#FFFFFF', fontWeight: '600', fontSize: 16}}>
            Pronounce
          </Text>
        </TouchableOpacity> */}

        {currentText && (
          <TouchableOpacity
            className="rounded-full bg-p1/20 flex-row items-center"
            style={{paddingHorizontal: 20, paddingVertical: 10}}
            onPress={() => speakText(currentText, currentLanguage)}>
            <Icon name="volume-up" size={iconSize} color="#613BFF" />
            <Text style={{color: '#613BFF', fontWeight: '600', fontSize: 16}}>
              Speak
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 items-center" style={{paddingTop: height * 0.01}}>
        <View style={{width: progressBarWidth, marginBottom: height * 0.03}}>
          <Text
            style={{
              fontSize: progressTextSize,
              fontWeight: '600',
              color: '#1F2937',
              textAlign: 'center',
              marginBottom: height * 0.01,
            }}>
            Card {currentIndex + 1} of {flashcards.length}
          </Text>
          <View
            style={{
              height: height * 0.01,
              backgroundColor: '#E5E7EB',
              borderRadius: 9999,
              overflow: 'hidden',
            }}>
            <View
              style={{
                height: '100%',
                backgroundColor: '#613BFF',
                width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
              }}
            />
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={flashcards}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
          onScroll={onScroll}
          removeClippedSubviews={true}
          maxToRenderPerBatch={3}
          windowSize={3}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={1}
        />
      </View>

      <Recordings
        isVisible={recordingsModalVisible}
        onClose={closeRecordingsModal}
        currentFlashcard={getCurrentFlashcard()}
        currentSideData={getCurrentSideData()}
        flash_id={flash_id}
        updateRecordings={updateRecordings}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: height * 0.03,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: progressBarWidth,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: height * 0.02,
          }}>
          <TouchableOpacity
            onPress={goToPreviousCard}
            style={{
              height: buttonHeight,
              paddingHorizontal: width * 0.05,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              marginRight: width * 0.03,
              backgroundColor: currentIndex === 0 ? '#E5E7EB' : '#613BFF',
            }}
            disabled={currentIndex === 0}>
            <Text
              style={{
                fontSize: buttonFontSize,
                fontWeight: '600',
                color: currentIndex === 0 ? '#6B7280' : '#FFFFFF',
              }}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextCard}
            style={{
              height: buttonHeight,
              paddingHorizontal: width * 0.05,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              backgroundColor:
                currentIndex === flashcards.length - 1 ? '#E5E7EB' : '#613BFF',
            }}
            disabled={currentIndex === flashcards.length - 1}>
            <Text
              style={{
                fontSize: buttonFontSize,
                fontWeight: '600',
                color:
                  currentIndex === flashcards.length - 1
                    ? '#6B7280'
                    : '#FFFFFF',
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={submitFlashcardCompletion}
          style={{
            backgroundColor: '#FFFFFF',
            height: buttonHeight,
            paddingHorizontal: width * 0.04,
            marginHorizontal: width * 0.075,
            marginBottom: height * 0.02,
            borderRadius: 16,
            justifyContent: 'center',
            ...buttonShadowStyle,
          }}>
          <Text
            style={{
              fontSize: completionButtonFontSize,
              fontWeight: '700',
              color: '#613BFF',
              textAlign: 'center',
            }}>
            Mark as Completed
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(Index);
