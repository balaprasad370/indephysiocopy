import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import plan from '../../assets/plan.png';
import referral from '../../assets/referral.png';
import scale from '../../utils/utils';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';

const index = ({
  locked,
  courseTitle,
  toggleModal,
  middleCourseCard,
  bottomCourseCard,
  plane,
  refer,
}) => {
  const navigation = useNavigation();

  const handleScreen = () => {
    if (courseTitle === 'Referral Portal') {
      Linking.openURL('https://portal.indephysio.com/app');
    }
    if(courseTitle === 'Not Registered'){
      Linking.openURL('https://portal.indephysio.com/dashboard');
    }
  };

  return (
    <TouchableOpacity
      className="p-4 rounded-xl bg-b50 border border-p1 shadow-md mx-2"
      onPress={handleScreen}>
      <View className="relative p-4 rounded-xl">
        {locked && (
          <View className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Icon name="lock" className="text-white text-4xl" />
          </View>
        )}
        <Text className="text-xl font-semibold text-gray-900 text-center">{courseTitle}</Text>
        <Text className={`mt-2 text-center ${!locked ? 'text-gray-700' : 'text-gray-500'}`}>
          {middleCourseCard}
        </Text>
        {plane && (
          <View className="flex items-center justify-center mt-2">
            <Image source={plan} style={{width: scale(65), height: scale(65)}} resizeMode="contain" />
          </View>
        )}
        {refer && (
          <View className="flex items-center justify-center mt-2">
            <Image source={referral} style={{width: scale(65), height: scale(65)}} resizeMode="contain" />
          </View>
        )}
        <TouchableOpacity
          onPress={handleScreen}
          className={`mt-2 p-2 rounded-lg ${courseTitle === 'Not Registered' ? 'bg-blue-600' : 'bg-gray-100'}`}>
          <Text className={`text-center ${courseTitle === 'Not Registered' ? 'text-white' : 'text-gray-800'}`}>
            {courseTitle === 'Not Registered' ? 'Subscribe Now' : bottomCourseCard}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default index;
