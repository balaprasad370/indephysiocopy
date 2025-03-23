import React, {useContext} from 'react';
import {
  View,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import color from '../../Constants/color';

const {width} = Dimensions.get('window');

export default function Example({
  id,
  lang_id,
  img,
  name,
  description,
  route,
  status,
  trackEvent,
}) {
  const navigation = useNavigation();
  const {isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const handleSave = id => {
    console.log(`Saved item with id: ${id}`);
  };

  return (
    <View className="w-[92%] self-center rounded-[24px] shadow-xl mb-4 overflow-hidden border border-p1/20 bg-white dark:bg-n75">
      <Pressable
        android_ripple={{color: '#613BFF10'}}
        style={({pressed}) => [
          {
            opacity: pressed ? 0.95 : 1,
          },
        ]}
        onPress={() => {
          if (status === 'unlocked') {
            trackEvent("Subjects", {
              lang_id: lang_id,
              subject_name: name,
              subject_description: description,
            });

            navigation.navigate(route, {lang_id: lang_id});
          }
        }}>
        <View className={`relative ${status === 'locked' ? 'opacity-75' : ''}`}>
          <View className="h-[160px]">
            {img ? (
              <Image
                resizeMode="cover"
                className="w-full h-full"
                source={{uri: img}}
              />
            ) : (
              <View className="w-full h-full bg-n40 justify-center items-center">
                <ActivityIndicator size="large" color="#613BFF" />
              </View>
            )}
            {status === 'unlocked' ? (
              <View className="absolute top-2 right-2 z-50 bg-white border border-green-600/20 px-3 py-1 rounded-full">
                <Text className="text-green-600 font-semibold text-xs">
                  Enrolled
                </Text>
              </View>
            ) : (
              <View className="absolute top-2 right-2 z-50 bg-white border border-red-600/20 px-3 py-1 rounded-full">
                <Text className="text-red-600 font-semibold text-xs">
                  Not Enrolled
                </Text>
              </View>
            )}
          </View>

          {status === 'locked' && (
            <View className="absolute inset-0 bg-p1/50 backdrop-blur-[2px] flex items-center justify-center w-full h-full">
              <IonIcon name="lock-closed" size={48} color="#FFF" />
            </View>
          )}

          <View className="p-4">
            <View className="mb-2">
              <Text className="text-lg font-bold text-p1 flex-wrap">
                {name}
              </Text>
            </View>
            <Text className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-wrap">
              {description}
            </Text>

            {status === 'unlocked' && (
              <TouchableOpacity
                className="mt-4 bg-p1 rounded-xl py-3 flex-row items-center justify-center shadow-lg shadow-p1/30"
                onPress={() => {
                  trackEvent("Subjects", {
                    lang_id: lang_id,
                    subject_name: name,
                    subject_description: description,
                  });
                  navigation.push(route, {lang_id: lang_id});
                }}>
                <MaterialIcons name="school" size={20} color="white" />
                <Text className="ml-2 text-white font-bold text-sm">
                  Learn Now
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
