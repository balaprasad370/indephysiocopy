import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const LineAfterBtn = ({lineBefore, secondBtn, route, className}) => {
  const navigation = useNavigation();

  return (
    <View className="flex flex-row justify-center items-center mb-4 mt-2">
      <Text className="text-lg mr-2 text-n50">{lineBefore}</Text>
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        onPress={() => navigation.navigate(route)}>
        <Text className={`text-lg font-semibold text-p1 ${className}`}>{secondBtn}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LineAfterBtn;
