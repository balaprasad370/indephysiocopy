import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Animated} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../../Constants/routes';

const FAQItem = ({item, index}) => {
  const navigation = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    setIsExpanded(prevState => !prevState);
  }, [isExpanded, animation]);

  // Split answer into paragraphs
  const paragraphs = item.answer ? item.answer.split('\n') : [];

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View className="bg-white rounded-2xl mb-3 shadow-md overflow-hidden">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpand}
        className="flex-row justify-between items-center p-5 rounded-2xl bg-blue-50">
        <Text className="text-base font-semibold w-[90%] text-gray-800">
          {item.question}
        </Text>
        <Animated.View style={{transform: [{rotate: rotateIcon}]}}>
          <AntDesign name="down" size={18} color="#4B5563" />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View
          className="px-5 pb-5 pt-3 border-t border-gray-100"
          style={{opacity: animation}}>
          {paragraphs.map((paragraph, idx) => (
            <Text key={idx} className="text-sm leading-6 mb-2.5 text-gray-600">
              {paragraph}
            </Text>
          ))}

          {item.Installment && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate(ROUTES.Installement)}
              className="mt-2 bg-blue-50 p-2.5 rounded-lg">
              <Text className="text-blue-700 font-medium text-center">
                View Installment Plans
              </Text>
            </TouchableOpacity>
          )}

          {item.plans && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.navigate(ROUTES.PRICING)}
              className="mt-2 bg-blue-50 p-2.5 rounded-lg">
              <Text className="text-blue-700 font-medium text-center">
                Explore Our Packages
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default FAQItem;
