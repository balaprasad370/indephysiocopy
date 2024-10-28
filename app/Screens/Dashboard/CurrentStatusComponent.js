import {StyleSheet, Text, TouchableOpacity, View, Animated} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import BookIcon from 'react-native-vector-icons/Foundation';
import color from '../../Constants/color';
import storage from '../../Constants/storage';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';

const CurrentStatusComponent = ({data}) => {
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

  const toggleModal = (option, order_id) => {
    console.log('hi', option);
    if (option == 'Quiz') {
      navigation.navigate(ROUTES.QUIZ, {
        module_id: data.id,
        title: data.title,
        order_id: order_id,
        chapter_id: data.chapter_id,
        unique_id: data.id,
      });
    } else if (option == 'Reading Material') {
      navigation.navigate(ROUTES.READING, {
        read_id: data.id,
        order_id: order_id,
        chapter_id: data.chapter_id,
        unique_id: data.id,
      });
    } else if (option == 'Flash Cards') {
      navigation.navigate(ROUTES.FLASH, {
        flash_id: data.id,
        order_id: order_id,
        chapter_id: data.chapter_id,
        unique_id: data.id,
      });
    } else if (option == 'Assessment') {
      navigation.navigate(ROUTES.ASSESSMENTS, {
        assessment_id: data.id,
        order_id: order_id,
        chapter_id: data.chapter_id,
        unique_id: data.id,
      });
    }
  };
  return (
    <Animated.View style={{opacity: animatedValue}}>
      <TouchableOpacity
        onPress={() => toggleModal(data && data.type, data.order_id)}
        style={{
          marginTop: 10,
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
            paddingHorizontal: 10,
            justifyContent: 'space-between',
          }}>
          <View
            style={{paddingHorizontal: 5, paddingVertical: 10, width: '80%'}}>
            <Text style={{color: 'white', fontSize: 16}}>
              {(() => {
                const text = ` ${data && data.level_name}, ${
                  data.chapter_name
                }`;
                return text.length > 32 ? text.slice(0, 32) + '...' : text;
              })()}
            </Text>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              {data && data.title
                ? data.title.length > 20
                  ? `${data.title.slice(0, 20)}...`
                  : data.title
                : ''}
            </Text>
          </View>
          <View
            style={{
              width: 2,
              backgroundColor: 'white',
              height: '100%',
            }}></View>
          <View style={{padding: 10, alignSelf: 'center'}}>
            <BookIcon name="book-bookmark" size={40} color={color.white} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CurrentStatusComponent;

const styles = StyleSheet.create({});
