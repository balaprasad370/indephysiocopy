import {Text, TouchableOpacity,Pressable, ActivityIndicator} from 'react-native';
import React from 'react';

const CommonButtonAuth = ({handleData, buttonTitle, className, loading}) => {
  return (
    <Pressable
      className={`py-4 px-6 bg-p1 rounded-xl justify-center items-center ${className}`}
      hitSlop={{x: 25, y: 15}}
      onPress={handleData}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : ( 
        <Text className="text-lg font-semibold text-white">{buttonTitle}</Text>
      )}
    </Pressable>
  );
};

export default CommonButtonAuth;
