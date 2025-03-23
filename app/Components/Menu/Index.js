import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {Image} from 'react-native';
import color from '../../Constants/color';
import liveclassTrue from '../../assets/colorlive.png';
import darkDoc from '../../assets/darkdoc.png';

const Index = ({name, iconImage, lock, isLocked, ROUTE, data}) => {
  const navigation = useNavigation();

  const changeRoute = (option, data) => {
    if (option === 'Quiz') {
      setModalVisible(!modalVisible);
    } else if (option === 'Self learn') {
      navigation.navigate('Self Learn');
    } else if (option === 'Live') {
      navigation.navigate(ROUTES.LIVE_CLASS);
    } else if (option === 'Documents') {
      navigation.navigate(ROUTES.DOCUMENTS);
    }
  };

  return (
    <TouchableOpacity
      hitSlop={{x: 25, y: 15}}
      onPress={() => changeRoute(`${ROUTE}`, data)}
      className="mt-4 mb-2 flex justify-center items-center">
      <View
        className={`flex justify-center items-center rounded-lg p-2 relative ${
          isLocked ? 'bg-gray-600' : 'bg-b50'
        }`}>
        {ROUTE !== 'Documents' && ROUTE !== 'Live' && (
          <Image source={iconImage} className="w-11 h-10" />
        )}
        {ROUTE === 'Live' && !isLocked && (
          <Image source={liveclassTrue} className="w-11 h-10" />
        )}
        {ROUTE === 'Live' && isLocked && (
          <Image source={iconImage} className="w-11 h-10" />
        )}
        {ROUTE === 'Documents' && !isLocked && (
          <Image source={iconImage} className="w-11 h-10" />
        )}
        {ROUTE === 'Documents' && isLocked && (
          <Image source={darkDoc} className="w-11 h-10" />
        )}
        {isLocked && (
          <View className="absolute bottom-1.5">
            <Image source={lock} className="w-5 h-5" />
          </View>
        )}
      </View>
      <Text
        className={`mt-2 font-bold text-xs ${
          isLocked ? 'text-gray-600' : 'text-p1'
        }`}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Index;
