import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Checkbox} from 'react-native-paper';

const RememberField = ({route}) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();

  return (
    <View className="flex flex-row items-center justify-end  mt-6">
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        onPress={() => navigation.navigate(route)}>
        <Text className="text-md text-p1 font-semibold">Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RememberField;
