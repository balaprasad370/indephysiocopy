import {StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import BookIcon from 'react-native-vector-icons/Foundation';
import color from '../../Constants/color';
import storage from '../../Constants/storage';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';

const LastComponent = () => {
  const {path} = useContext(AppContext);

  const navigation = useNavigation();

  const [quizData, setQuizData] = useState(null); // Add state for storing quiz data

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

  const getlastQuiz = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.get(`${path}/admin/v3/lastQuizData`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizData(response.data[0]); // Save the quiz data from the response
    } catch (error) {
      console.log('Error in getting last Quiz', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getlastQuiz();
    });
    return unsubscribe;
  }, [navigation]);

  if (!quizData) {
    return null;
  }

  return (
    <Animated.View style={{opacity: animatedValue}}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(ROUTES.QUIZ, {
            module_id: quizData.module_id,
            title: quizData.chapter_name,
            order_id: 1,
            chapter_id: quizData.chapter,
            unique_id: quizData.module_id,
            level_id: quizData.level,
            previousAnswers: quizData.answers,
            currentQuestionIndex: quizData.currentQuestionIndex,
          });
        }}
        style={{
          marginTop: 20,
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
          borderBottomEndRadius: 15,
          backgroundColor: color.lowPrimary,
          paddingBottom: 8,
          borderBottomEndRadius: 20,
          borderBottomStartRadius: 20,
        }}>
        <View
          style={{
            display: 'flex',
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: color.darkPrimary,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View style={{padding: 10}}>
            <Text style={{color: 'white', fontSize: 16}}>
              {(() => {
                const text = `Level: ${quizData.level_name}, Chapter: ${quizData.chapter_name}`;
                return text.length > 32 ? text.slice(0, 32) + '...' : text;
              })()}
            </Text>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              Quiz Attempted: {quizData.currentQuestionIndex}/
              {quizData.totalQuestions}
            </Text>
          </View>
          <View
            style={{
              width: 2,
              backgroundColor: 'white',
              height: '100%',
            }}></View>
          <View style={{padding: 10}}>
            <BookIcon name="book-bookmark" size={40} color={color.white} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default LastComponent;

const styles = StyleSheet.create({});
